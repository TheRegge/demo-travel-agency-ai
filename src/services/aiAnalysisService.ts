/**
 * AI Analysis Service
 * Uses Gemini AI to intelligently extract travel information from user input
 */

import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { ConversationContext, ExtractedTravelInfo, ClarificationQuestionType } from '@/types/travel'
import { destinationResolutionService } from './destinationResolutionService'

interface AIAnalysisResult {
  destinations: string[]
  tripType: 'single' | 'multi-destination' | 'unknown'
  extractedInfo: ExtractedTravelInfo
  missingInfo: ClarificationQuestionType[]
  ambiguityLevel: 'clear' | 'somewhat_clear' | 'unclear'
  keywords: string[]
  travelRelevance: 'travel_related' | 'travel_adjacent' | 'non_travel'
}

const ANALYSIS_PROMPT = `
You are a travel planning assistant that analyzes user travel requests.

Your task is to extract structured information from user input and identify what information is missing for making good travel recommendations.

FIRST: Determine if this is a travel-related question or not.

RESPOND WITH VALID JSON ONLY using this exact schema:

{
  "travelRelevance": "travel_related|travel_adjacent|non_travel", // MANDATORY: Classify the question's relevance to travel
  "destinations": ["destination1", "destination2"], // Array of mentioned places/cities/countries
  "tripType": "single|multi-destination|unknown", // Based on whether they want one place or multiple
  "extractedInfo": {
    "budget": number_or_null, // Total budget in USD if mentioned
    "duration": number_or_null, // Trip length in days - ALWAYS extract from phrases like "a week"=7, "two weeks"=14, etc.
    "dates": {
      "startDate": "string_or_null", // Departure date if mentioned
      "endDate": "string_or_null", // Return date if mentioned  
      "season": "spring|summer|fall|autumn|winter|null", // General time periods mentioned
      "flexibility": "exact|flexible|very_flexible"
    } // or null if no dates mentioned,
    "period": "string_or_null", // General time references like "in the fall", "next month", "this summer"
    "travelers": {
      "adults": number,
      "children": number,
      "ages": [array_of_ages] // or empty array
    } // or null if not mentioned,
    "accommodationType": "budget|standard|luxury", // or null if not mentioned
    "preferences": ["keyword1", "keyword2"], // Travel interests (food, culture, nature, etc.)
    "regions": ["region1"], // Broader regions mentioned (europe, asia, etc.)
    "tripType": "single|multi-destination", // or null if unclear
    "budgetFlexibility": "strict|somewhat_flexible|very_flexible", // or null
    "durationFlexibility": "exact|plus_minus_few_days|flexible" // or null
  },
  "missingInfo": ["duration", "budget", "group_size", "trip_type", "preferences"], // What's needed for recommendations
  "ambiguityLevel": "clear|somewhat_clear|unclear",
  "keywords": ["keyword1", "keyword2"] // Relevant travel keywords found
}

TRAVEL RELEVANCE CLASSIFICATION (CRITICAL):

"travel_related": Direct travel planning questions
- "I want to visit Paris"
- "Plan a trip to Thailand"  
- "Best beaches in Hawaii"
- "Hotel recommendations for Rome"

"travel_adjacent": Location/culture questions that could lead to travel
- "What's the weather like in Japan?"
- "Tell me about Italian food"
- "What language do they speak in Brazil?"

"non_travel": Questions completely unrelated to travel
- Math problems ("what is 3 + 5?")
- General knowledge ("who is the president?")
- Technical questions ("how do I code?")
- Random topics ("what's your favorite color?")

CRITICAL EXTRACTION RULES - FOLLOW THESE EXACTLY:

DURATION EXTRACTION (MANDATORY):
- "a week" → duration: 7
- "two weeks" → duration: 14  
- "3 days" → duration: 3
- "weekend" → duration: 3
- "long weekend" → duration: 4
- "few days" → duration: 4
- ALWAYS convert word descriptions to numbers
- NEVER leave duration null if any time reference is mentioned

PERIOD/TIMING EXTRACTION (MANDATORY):
- "in the fall" → period: "in the fall", season: "fall"
- "during summer" → period: "during summer", season: "summer"  
- "next month" → period: "next month"
- "this winter" → period: "this winter", season: "winter"
- "over the holidays" → period: "over the holidays"
- ALWAYS extract both period (exact phrase) and season if mentioned

EXAMPLES FOR AI TO FOLLOW:
Input: "I want to spend a week on a beach in the caribbean in the fall"
Expected output:
{
  "travelRelevance": "travel_related",
  "destinations": ["caribbean"],
  "tripType": "single",
  "extractedInfo": {
    "duration": 7,
    "dates": {
      "season": "fall"
    },
    "period": "in the fall",
    "preferences": ["beach"]
  }
}

Input: "What is 3 + 5?"
Expected output:
{
  "travelRelevance": "non_travel",
  "destinations": [],
  "tripType": "unknown",
  "extractedInfo": {},
  "missingInfo": [],
  "ambiguityLevel": "clear",
  "keywords": []
}

ANALYSIS RULES:
1. MANDATORY: Extract duration from ANY time phrase ("a week"=7, "two weeks"=14, etc.)
2. MANDATORY: Extract period and season from timing phrases
3. Extract specific dates in readable format
4. Detect group composition from words like "family", "solo", "couple", "friends"
5. Identify budget level from words like "luxury", "budget", "cheap", "expensive"
6. Mark information as missing ONLY if truly not mentioned

REQUIRED INFO FOR RECOMMENDATIONS:
- destination OR region
- trip type (single/multi)
- duration OR dates OR season
- budget OR group size (at least one)

USER REQUEST: {USER_INPUT}

Respond with valid JSON only:
`

/**
 * Use AI to analyze user input and extract structured travel information
 */
export async function analyzeUserInputWithAI(
  userInput: string,
  conversationHistory: { type: string; content: string }[] = []
): Promise<ConversationContext> {
  // Check if AI is available
  if (!validateAISetup()) {
    console.error('🤖 AI Analysis: API key not available - AI analysis required')
    throw new Error('AI analysis service is not configured')
  }

  try {
    console.log('🤖 AI Analysis: Starting analysis for input:', userInput.substring(0, 100))
    
    // Add conversation context if available
    const contextPrompt = conversationHistory.length > 0 
      ? `\n\nCONVERSATION HISTORY:\n${conversationHistory.map(msg => `${msg.type.toUpperCase()}: ${msg.content}`).join('\n')}\n`
      : ''
    
    const fullPrompt = ANALYSIS_PROMPT.replace('{USER_INPUT}', userInput) + contextPrompt

    // Generate analysis using Gemini
    const { text } = await generateText({
      model: google('gemini-2.0-flash-exp'),
      prompt: fullPrompt,
      maxTokens: 1000,
      temperature: 0.3, // Low temperature for consistent structured output
    })

    console.log('🤖 AI Analysis: Raw response:', text.substring(0, 200))

    // Parse the AI response
    const analysisResult = parseAIAnalysis(text)
    
    console.log('🤖 AI Analysis: Raw AI response:', text)
    console.log('🤖 AI Analysis: Parsed result:', analysisResult)

    // Enhance destinations with real location data
    let enhancedDestinations = analysisResult.destinations
    try {
      if (analysisResult.destinations.length > 0) {
        console.log('🌍 Resolving destinations:', analysisResult.destinations)
        const resolved = await destinationResolutionService.resolveDestination(userInput)
        if (resolved.length > 0) {
          enhancedDestinations = resolved.map(dest => dest.name)
          console.log('🌍 Enhanced destinations:', enhancedDestinations)
        }
      }
    } catch (error) {
      console.warn('🌍 Failed to resolve destinations, using AI extracted ones:', error)
    }

    // Convert to ConversationContext format
    const context: ConversationContext = {
      userIntent: {
        destinations: enhancedDestinations,
        keywords: analysisResult.keywords,
        ambiguityLevel: analysisResult.ambiguityLevel,
        tripTypeHint: analysisResult.tripType
      },
      extractedInfo: analysisResult.extractedInfo,
      missingInfo: analysisResult.missingInfo,
      conversationStage: determineStage(analysisResult.ambiguityLevel, analysisResult.missingInfo.length),
      travelRelevance: analysisResult.travelRelevance
    }

    return context

  } catch (error) {
    console.error('🤖 AI Analysis error:', error)
    
    // No fallback - AI analysis is required
    throw new Error(`AI analysis failed: ${error}`)
  }
}

/**
 * Parse AI response and validate the structure
 */
function parseAIAnalysis(responseText: string): AIAnalysisResult {
  try {
    // Clean the response
    const cleanedText = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    const parsed = JSON.parse(cleanedText)

    // Validate and provide defaults
    return {
      destinations: Array.isArray(parsed.destinations) ? parsed.destinations : [],
      tripType: ['single', 'multi-destination', 'unknown'].includes(parsed.tripType) ? parsed.tripType : 'unknown',
      extractedInfo: {
        budget: typeof parsed.extractedInfo?.budget === 'number' ? parsed.extractedInfo.budget : undefined,
        duration: typeof parsed.extractedInfo?.duration === 'number' ? parsed.extractedInfo.duration : undefined,
        dates: parsed.extractedInfo?.dates || undefined,
        period: parsed.extractedInfo?.period || undefined,
        travelers: parsed.extractedInfo?.travelers || undefined,
        accommodationType: parsed.extractedInfo?.accommodationType || undefined,
        preferences: Array.isArray(parsed.extractedInfo?.preferences) ? parsed.extractedInfo.preferences : undefined,
        regions: Array.isArray(parsed.extractedInfo?.regions) ? parsed.extractedInfo.regions : undefined,
        tripType: parsed.extractedInfo?.tripType || undefined,
        budgetFlexibility: parsed.extractedInfo?.budgetFlexibility || undefined,
        durationFlexibility: parsed.extractedInfo?.durationFlexibility || undefined
      },
      missingInfo: Array.isArray(parsed.missingInfo) ? parsed.missingInfo : [],
      ambiguityLevel: ['clear', 'somewhat_clear', 'unclear'].includes(parsed.ambiguityLevel) ? parsed.ambiguityLevel : 'unclear',
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
      travelRelevance: ['travel_related', 'travel_adjacent', 'non_travel'].includes(parsed.travelRelevance) ? parsed.travelRelevance : 'non_travel'
    }

  } catch (error) {
    console.error('Failed to parse AI analysis response:', error)
    throw new Error('Invalid AI analysis response format')
  }
}

/**
 * Determine conversation stage based on analysis
 */
function determineStage(
  ambiguityLevel: 'clear' | 'somewhat_clear' | 'unclear',
  missingInfoCount: number
): ConversationContext['conversationStage'] {
  if (missingInfoCount === 0) return 'planning'
  if (ambiguityLevel === 'unclear') return 'clarifying'
  if (missingInfoCount > 2) return 'clarifying'
  return 'planning'
}


/**
 * Validate Gemini setup for AI analysis
 */
function validateAISetup(): boolean {
  return Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY)
}

/**
 * Check if we have enough information using AI-extracted data
 */
export function hasEnoughInfoForRecommendationsAI(context: ConversationContext): boolean {
  const { extractedInfo, userIntent } = context
  
  // Debug logging
  console.log('🔍 AI-based hasEnoughInfo - Debug:', {
    destinations: userIntent.destinations,
    tripTypeHint: userIntent.tripTypeHint,
    duration: extractedInfo.duration,
    dates: extractedInfo.dates,
    budget: extractedInfo.budget,
    travelers: extractedInfo.travelers,
    missingInfo: context.missingInfo
  })
  
  // Check core requirements more intelligently
  const hasDestination = Boolean(userIntent.destinations && userIntent.destinations.length > 0)
  const hasTiming = Boolean(extractedInfo.duration) || Boolean(extractedInfo.dates?.startDate) || Boolean(extractedInfo.dates?.season) || Boolean(extractedInfo.period)
  const hasContext = Boolean(extractedInfo.budget) || Boolean(extractedInfo.travelers) || Boolean(extractedInfo.preferences && extractedInfo.preferences.length > 0)
  
  // Allow recommendations with just destination + timing for better UX
  // This explains why your first query worked without budget/preferences!
  // Using relaxed criteria: destination + timing is enough
  const hasEnoughInfo = hasDestination && hasTiming
  
  console.log('🔍 AI-based hasEnoughInfo - Analysis:', {
    hasDestination,
    hasTiming: hasTiming,
    hasContext,
    hasEnoughInfo,
    missingInfo: context.missingInfo
  })
  
  return hasEnoughInfo
}