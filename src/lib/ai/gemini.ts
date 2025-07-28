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
 * Updated to handle worldwide destinations beyond mock data catalog
 */
const SYSTEM_PROMPT = `
You are TravelGenius, an expert travel planning assistant for DreamVoyager Travel.

CONTEXT: You have access to worldwide travel destinations and can recommend trips to any location globally.
PERSONALITY: Professional, helpful, and genuinely excited about travel.
CAPABILITIES: Budget analysis, family planning, seasonal recommendations, graceful budget handling, worldwide destination expertise.

RESPONSE FORMAT: You MUST respond with valid JSON matching the schema below.

BUDGET SENSITIVITY: Never dismiss a user's budget as "impossible". Always provide alternatives within their stated range and offer creative solutions like different destinations, timing, or trip length. Maintain enthusiasm for travel regardless of budget constraints.

DESTINATION FLEXIBILITY: You can recommend ANY worldwide destination. Create appropriate trip IDs and provide detailed, realistic information for any location the user requests.

TASK: Create personalized travel recommendations based on user input.

OUTPUT SCHEMA:
{
  "chatMessage": "Your friendly, conversational response here",
  "recommendations": {
    "trips": [
      {
        "tripId": "unique-trip-identifier",
        "destination": "Any worldwide destination name",
        "duration": "number of days",
        "estimatedCost": "realistic total cost in USD",
        "highlights": ["key feature 1", "key feature 2", "key feature 3"],
        "customizations": {
          "departureDate": "YYYY-MM-DD or null",
          "hotelType": "budget|standard|luxury",
          "activities": ["activity1", "activity2", "activity3"]
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
- You can recommend ANY worldwide destination (Mexico, Europe, Asia, etc.)
- Generate unique tripIds for each recommendation
- Include 2-3 trip recommendations when possible
- Sort trips by relevance score (highest first)
- For low budgets, suggest alternatives and upgrade paths
- Maintain optimism and helpfulness regardless of budget
- Use realistic pricing for any destination you recommend
`

/**
 * Generate enhanced prompt for worldwide destination support
 */
const createEnhancedPrompt = (userInput: string, conversationHistory: { type: string; content: string }[] = []): string => {
  // Build conversation context
  const contextHistory = conversationHistory.length > 0 
    ? `\nCONVERSATION HISTORY:\n${conversationHistory.map(msg => `${msg.type.toUpperCase()}: ${msg.content}`).join('\n')}\n`
    : ''

  // Include sample destinations as reference for format, but not as restrictions
  const sampleDestinations = mockDestinations.slice(0, 3).map(dest => ({
    id: dest.id,
    name: dest.name,
    category: dest.category,
    location: `${dest.location.region}, ${dest.location.country}`,
    kidFriendlyScore: dest.kidFriendlyScore,
    pricing: dest.seasonalPricing,
    activities: dest.activities.slice(0, 3).map(activity => activity.name)
  }))

  return `
${SYSTEM_PROMPT}

EXAMPLE DESTINATION FORMAT (you can recommend ANY destination worldwide, not limited to these):
${JSON.stringify(sampleDestinations, null, 2)}

DESTINATION GUIDANCE:
- You can recommend ANY city, country, or region worldwide
- For Mexico: Cancun, Puerto Vallarta, Mexico City, Playa del Carmen, Tulum, etc.
- For Europe: Paris, Rome, Barcelona, Amsterdam, Prague, etc.
- For Asia: Tokyo, Bangkok, Singapore, Bali, etc.
- Generate realistic pricing based on actual destination costs
- Consider seasonal factors, local activities, and cultural highlights

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

    // Validate trip recommendations structure (no longer restricted to mock destinations)
    const validTrips = parsed.recommendations.trips.filter((trip: unknown) => {
      if (typeof trip !== 'object' || trip === null || !('tripId' in trip) || !('destination' in trip)) {
        return false
      }
      const tripObj = trip as { tripId: string; destination: string }
      // Basic validation - just ensure we have required fields
      return tripObj.tripId && tripObj.destination && tripObj.destination.trim().length > 0
    })

    // Map to proper TripRecommendation structure for worldwide destinations
    const recommendations: TripRecommendation[] = validTrips.map((trip: unknown) => {
      const tripObj = trip as {
        tripId: string
        destination: string
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
      
      // Generate a unique trip ID if not provided or enhance existing one
      const uniqueTripId = tripObj.tripId.includes('trip-') 
        ? tripObj.tripId 
        : `trip-${tripObj.tripId}-${Date.now()}`
      
      return {
        tripId: uniqueTripId,
        destination: tripObj.destination,
        duration: Number(tripObj.duration) || 5,
        estimatedCost: Number(tripObj.estimatedCost) || 2500, // Default reasonable cost
        highlights: Array.isArray(tripObj.highlights) ? tripObj.highlights : ['Cultural experiences', 'Local cuisine', 'Scenic attractions'],
        description: `Experience the best of ${tripObj.destination} with carefully curated activities and accommodations.`,
        activities: Array.isArray(tripObj.customizations?.activities) 
          ? tripObj.customizations.activities 
          : Array.isArray(tripObj.highlights) 
            ? tripObj.highlights 
            : ['Sightseeing', 'Local tours', 'Cultural activities'],
        season: "spring", // Default season
        kidFriendly: true, // Default to family-friendly
        type: "single" as const, // Add required type field
        customizations: {
          hotelType: (tripObj.customizations?.hotelType as "budget" | "standard" | "luxury") || "standard",
          activities: Array.isArray(tripObj.customizations?.activities) 
            ? tripObj.customizations.activities 
            : Array.isArray(tripObj.highlights) 
              ? tripObj.highlights.slice(0, 3)
              : ['Sightseeing', 'Local culture', 'Dining'],
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
 * Create user-aware fallback response when AI fails
 * This respects the user's actual request instead of showing random destinations
 */
const createUserAwareFallbackResponse = (userInput: string, _conversationHistory: { type: string; content: string }[] = []): AITripResponse => {
  console.log('🎯 Creating user-aware fallback for:', userInput)
  
  // Extract user preferences from input
  const lowerInput = userInput.toLowerCase()
  
  // Extract mentioned destinations
  const mentionedDestinations = extractDestinationsFromInput(lowerInput)
  console.log('🎯 Mentioned destinations:', mentionedDestinations)
  
  // Extract budget
  const budgetMatch = userInput.match(/\$(\d+(?:,\d+)?)/g)
  const budget = budgetMatch ? parseInt(budgetMatch[0].replace(/[$,]/g, '')) : 3000
  console.log('🎯 Extracted budget:', budget)
  
  // Find matching destinations from our mock data
  let relevantDestinations = mockDestinations.filter(dest => {
    // Check if destination name matches mentioned places
    const destName = dest.name.toLowerCase()
    const destCountry = dest.location.country.toLowerCase()
    const destRegion = dest.location.region.toLowerCase()
    
    return mentionedDestinations.some(mentioned => 
      destName.includes(mentioned) || 
      destCountry.includes(mentioned) || 
      destRegion.includes(mentioned) ||
      mentioned.includes(destName.split(',')[0] || destName) // Match city part
    )
  })
  
  // If no specific destinations found, try to match by category/preferences
  if (relevantDestinations.length === 0) {
    console.log('🎯 No direct destination matches, finding by preferences')
    
    if (lowerInput.includes('family') || lowerInput.includes('kids')) {
      relevantDestinations = mockDestinations.filter(dest => dest.kidFriendlyScore > 7)
    } else if (lowerInput.includes('beach') || lowerInput.includes('tropical')) {
      relevantDestinations = mockDestinations.filter(dest => dest.category === 'scenic')
    } else if (lowerInput.includes('culture') || lowerInput.includes('history')) {
      relevantDestinations = mockDestinations.filter(dest => dest.category === 'cultural')
    } else if (lowerInput.includes('adventure')) {
      relevantDestinations = mockDestinations.filter(dest => dest.category === 'adventure')
    } else {
      // Default to budget-appropriate destinations
      relevantDestinations = mockDestinations.filter(dest => 
        dest.seasonalPricing.shoulder <= budget * 1.2 // Within 20% of budget
      )
    }
  }
  
  // Take first 2-3 relevant destinations
  const selectedDestinations = relevantDestinations.slice(0, 3)
  console.log('🎯 Selected destinations:', selectedDestinations.map(d => d?.name || 'Unknown'))
  
  // If still no matches, fall back to budget-appropriate destinations
  if (selectedDestinations.length === 0) {
    console.log('🎯 Still no matches, using budget-based fallback')
    const budgetAppropriate = mockDestinations.filter(dest => dest.seasonalPricing.shoulder <= budget)
    selectedDestinations.push(...budgetAppropriate.slice(0, 2))
  }
  
  const fallbackTrips: TripRecommendation[] = selectedDestinations.map((dest, index) => ({
    tripId: `smart-fallback-${dest.id}-${Date.now()}-${index}`,
    destination: dest.name,
    duration: 5,
    estimatedCost: Math.min(dest.seasonalPricing.shoulder, budget * 0.8), // Stay within budget
    highlights: dest.activities.slice(0, 3).map(a => a.name),
    description: dest.description,
    activities: dest.activities.slice(0, 5).map(a => a.name),
    season: "spring",
    kidFriendly: dest.kidFriendlyScore > 7,
    customizations: {
      hotelType: budget > 4000 ? "luxury" : budget > 2000 ? "standard" : "budget",
      activities: dest.activities.slice(0, 3).map(a => a.name)
    },
    score: 80,
    type: "single" as const
  }))

  // Create personalized message
  let message = "I understand you're looking for "
  if (mentionedDestinations.length > 0) {
    message += `${mentionedDestinations.join(' and ')} `
  }
  if (budget) {
    message += `within a $${budget.toLocaleString()} budget. `
  }
  message += "Here are some great options I found:"

  return {
    chatMessage: message,
    recommendations: {
      trips: fallbackTrips,
      totalBudget: fallbackTrips.reduce((sum, trip) => sum + trip.estimatedCost, 0)
    },
    followUpQuestions: [
      "Would you like to see more options in this area?",
      "Are these within your preferred budget range?",
      "Would you prefer different types of accommodations?"
    ]
  }
}

/**
 * Extract destination names from user input
 */
function extractDestinationsFromInput(input: string): string[] {
  const destinations: string[] = []
  
  // Common destinations that might be in our mock data
  const destinationKeywords = [
    'paris', 'france', 'london', 'england', 'rome', 'italy', 'spain', 'madrid', 'barcelona',
    'germany', 'berlin', 'amsterdam', 'netherlands', 'prague', 'czech', 'austria', 'vienna',
    'switzerland', 'japan', 'tokyo', 'thailand', 'bangkok', 'singapore', 'australia', 'sydney',
    'new york', 'florida', 'california', 'orlando', 'miami', 'los angeles', 'san francisco'
  ]
  
  destinationKeywords.forEach(dest => {
    if (input.includes(dest)) {
      destinations.push(dest)
    }
  })
  
  return [...new Set(destinations)] // Remove duplicates
}

/**
 * Create fallback response when AI fails (legacy - should not be used)
 */
const createFallbackResponse = (): AITripResponse => {
  console.warn('⚠️ Using legacy fallback - this should not happen!')
  return createUserAwareFallbackResponse("general travel request", [])
}

/**
 * Query Gemini AI with structured travel planning prompt
 */
export const queryGeminiAI = async (
  userInput: string, 
  conversationHistory: { type: string; content: string }[] = []
): Promise<AITripResponse> => {
  try {
    console.log('🤖 Gemini AI: Starting request for input:', userInput.substring(0, 100))
    
    // Generate enhanced prompt with destination data
    const enhancedPrompt = createEnhancedPrompt(userInput, conversationHistory)
    console.log('🤖 Gemini AI: Generated prompt length:', enhancedPrompt.length)

    // Generate content using AI SDK
    const { text } = await generateText({
      model: google('gemini-2.0-flash-exp'),
      prompt: enhancedPrompt,
      maxTokens: 2000,
      temperature: 0.7,
    })

    console.log('🤖 Gemini AI: Received response length:', text.length)
    console.log('🤖 Gemini AI: Response preview:', text.substring(0, 200))

    // Parse and validate the response
    const parsedResponse = parseAIResponse(text)
    console.log('🤖 Gemini AI: Successfully parsed response with', parsedResponse.recommendations?.trips?.length || 0, 'trips')
    
    return parsedResponse

  } catch (error) {
    console.error('🤖 Gemini AI error:', error)
    console.log('🤖 Gemini AI: Falling back to user-request-aware response')
    
    // Return fallback response that respects the user's request
    return createUserAwareFallbackResponse(userInput, conversationHistory)
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