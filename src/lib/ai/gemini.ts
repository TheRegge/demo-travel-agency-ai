/**
 * Google Gemini AI Integration
 * Handles structured travel planning responses using Gemini 2.0 Flash
 */

import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { AITripResponse, TripRecommendation } from '@/types/travel'
import { mockDestinations } from '@/lib/mock-data/destinations'

/**
 * System prompt for travel planning assistant
 * Based on PRD specifications (lines 275-320)
 */
const SYSTEM_PROMPT = `
You are TravelGenius, an expert travel planning assistant for DreamVoyager Travel.

CONTEXT: You work with a curated catalog of destinations, hotels, and activities.
PERSONALITY: Professional, helpful, and genuinely excited about travel.
CAPABILITIES: Budget analysis, family planning, seasonal recommendations, graceful budget handling.

RESPONSE FORMAT: You MUST respond with valid JSON matching the schema below.

BUDGET SENSITIVITY: Never dismiss a user's budget as "impossible". Always provide alternatives within their stated range and offer creative solutions like different destinations, timing, or trip length. Maintain enthusiasm for travel regardless of budget constraints.

TASK: Create personalized travel recommendations based on user input.

OUTPUT SCHEMA:
{
  "chatMessage": "Your friendly, conversational response here",
  "recommendations": {
    "trips": [
      {
        "tripId": "exact ID from AVAILABLE DESTINATIONS",
        "destination": "Destination name",
        "duration": "number of days",
        "estimatedCost": "total cost in USD",
        "highlights": ["key feature 1", "key feature 2"],
        "customizations": {
          "departureDate": "YYYY-MM-DD or null",
          "hotelType": "budget|standard|luxury",
          "activities": ["activity1", "activity2"]
        },
        "score": "relevance score 0-100"
      }
    ],
    "totalBudget": "sum of all trip costs"
  },
  "followUpQuestions": ["Would you like...", "Should I include..."]
}

IMPORTANT: 
- Always return valid JSON
- Only use tripIds from AVAILABLE DESTINATIONS
- Include 2-3 trip recommendations when possible
- Sort trips by relevance score (highest first)
- For low budgets, suggest alternatives and upgrade paths
- Maintain optimism and helpfulness regardless of budget
`

/**
 * Generate enhanced prompt with mock destination data
 */
const createEnhancedPrompt = (userInput: string, conversationHistory: { type: string; content: string }[] = []): string => {
  // Create available destinations list for AI context
  const availableDestinations = mockDestinations.map(dest => ({
    id: dest.id,
    name: dest.name,
    category: dest.category,
    location: `${dest.location.region}, ${dest.location.country}`,
    kidFriendlyScore: dest.kidFriendlyScore,
    pricing: dest.seasonalPricing,
    activities: dest.activities.slice(0, 3).map(activity => activity.name)
  }))

  // Build conversation context
  const contextHistory = conversationHistory.length > 0 
    ? `\nCONVERSATION HISTORY:\n${conversationHistory.map(msg => `${msg.type.toUpperCase()}: ${msg.content}`).join('\n')}\n`
    : ''

  return `
${SYSTEM_PROMPT}

AVAILABLE DESTINATIONS:
${JSON.stringify(availableDestinations, null, 2)}

${contextHistory}

USER REQUEST: ${userInput}

Respond with valid JSON only, no additional text or formatting.
`
}

/**
 * Parse and validate AI response
 */
const parseAIResponse = (responseText: string): AITripResponse => {
  try {
    // Clean the response text (remove markdown formatting if present)
    const cleanedText = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    const parsed = JSON.parse(cleanedText)

    // Validate required fields
    if (!parsed.chatMessage || !parsed.recommendations) {
      throw new Error('Missing required fields in AI response')
    }

    // Ensure trips array exists
    if (!Array.isArray(parsed.recommendations.trips)) {
      parsed.recommendations.trips = []
    }

    // Validate trip recommendations against mock destinations
    const validTrips = parsed.recommendations.trips.filter((trip: unknown) => {
      if (typeof trip !== 'object' || trip === null || !('tripId' in trip)) {
        return false
      }
      const tripObj = trip as { tripId: string }
      const destination = mockDestinations.find(dest => dest.id === tripObj.tripId)
      return destination !== undefined
    })

    // Map to proper TripRecommendation structure
    const recommendations: TripRecommendation[] = validTrips.map((trip: unknown) => {
      const tripObj = trip as {
        tripId: string
        duration?: number
        estimatedCost?: number
        highlights?: string[]
        customizations?: {
          hotelType?: string
          activities?: string[]
          departureDate?: string
        }
        score?: number
      }
      const destination = mockDestinations.find(dest => dest.id === tripObj.tripId)!
      
      return {
        tripId: `trip-${tripObj.tripId}-${Date.now()}`,
        destination: destination.name,
        duration: Number(tripObj.duration) || 5,
        estimatedCost: Number(tripObj.estimatedCost) || destination.seasonalPricing.shoulder,
        highlights: Array.isArray(tripObj.highlights) ? tripObj.highlights : destination.activities.slice(0, 3).map(a => a.name),
        description: destination.description,
        activities: destination.activities.slice(0, 5).map(a => a.name),
        season: "spring", // Default season
        kidFriendly: destination.kidFriendlyScore > 7,
        customizations: {
          hotelType: (tripObj.customizations?.hotelType as "budget" | "standard" | "luxury") || "standard",
          activities: Array.isArray(tripObj.customizations?.activities) 
            ? tripObj.customizations.activities 
            : destination.activities.slice(0, 3).map(a => a.name),
          departureDate: tripObj.customizations?.departureDate || undefined
        },
        score: Number(tripObj.score) || 85
      }
    })

    return {
      chatMessage: parsed.chatMessage,
      recommendations: {
        trips: recommendations,
        totalBudget: Number(parsed.recommendations.totalBudget) || recommendations.reduce((sum, trip) => sum + trip.estimatedCost, 0),
        alternativeOptions: []
      },
      followUpQuestions: Array.isArray(parsed.followUpQuestions) ? parsed.followUpQuestions.slice(0, 3) : []
    }

  } catch (error) {
    console.error('Failed to parse AI response:', error)
    console.error('Raw response:', responseText)
    
    // Return fallback response
    return createFallbackResponse()
  }
}

/**
 * Create fallback response when AI fails
 */
const createFallbackResponse = (): AITripResponse => {
  // Use first 2 destinations as fallback
  const fallbackDestinations = mockDestinations.slice(0, 2)
  
  const fallbackTrips: TripRecommendation[] = fallbackDestinations.map((dest, index) => ({
    tripId: `fallback-${dest.id}-${Date.now()}-${index}`,
    destination: dest.name,
    duration: 5,
    estimatedCost: dest.seasonalPricing.shoulder,
    highlights: dest.activities.slice(0, 3).map(a => a.name),
    description: dest.description,
    activities: dest.activities.slice(0, 5).map(a => a.name),
    season: "spring",
    kidFriendly: dest.kidFriendlyScore > 7,
    customizations: {
      hotelType: "standard" as const,
      activities: dest.activities.slice(0, 3).map(a => a.name)
    },
    score: 80
  }))

  return {
    chatMessage: "I'm excited to help you plan your perfect trip! Based on popular destinations, here are some wonderful options to consider:",
    recommendations: {
      trips: fallbackTrips,
      totalBudget: fallbackTrips.reduce((sum, trip) => sum + trip.estimatedCost, 0)
    },
    followUpQuestions: [
      "What's your ideal travel budget?",
      "Are you traveling with family?",
      "Do you prefer adventure or relaxation?"
    ]
  }
}

/**
 * Query Gemini AI with structured travel planning prompt
 */
export const queryGeminiAI = async (
  userInput: string, 
  conversationHistory: { type: string; content: string }[] = []
): Promise<AITripResponse> => {
  try {
    // Generate enhanced prompt with destination data
    const enhancedPrompt = createEnhancedPrompt(userInput, conversationHistory)

    // Generate content using AI SDK
    const { text } = await generateText({
      model: google('gemini-2.0-flash-exp'),
      prompt: enhancedPrompt,
      maxTokens: 2000,
      temperature: 0.7,
    })

    // Parse and validate the response
    return parseAIResponse(text)

  } catch (error) {
    console.error('Gemini AI error:', error)
    
    // Return fallback response on any error
    return createFallbackResponse()
  }
}

/**
 * Validate environment setup
 */
export const validateGeminiSetup = (): { isValid: boolean; error?: string } => {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return {
      isValid: false,
      error: 'GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set'
    }
  }

  return { isValid: true }
}