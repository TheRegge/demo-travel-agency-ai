/**
 * Conversation Service
 * Handles communication with AI (placeholder system for Phase 1)
 * 
 * TODO: REMOVE IN PHASE 2 - Replace placeholder logic with real Gemini AI integration
 */

import { 
  AIResponse, 
  ConversationService, 
  ValidationResult
} from '@/types/conversation'
import { TripRecommendation } from '@/types/travel'
import { mockDestinations } from '@/lib/mock-data/destinations'

// TODO: REMOVE IN PHASE 2 - Two-step conversation responses
const FIRST_RESPONSE = "That sounds like an incredible adventure! I'm analyzing your preferences and checking the best options available. What specific aspects of your trip are most important to you - the activities, accommodations, or perhaps the local culture?"

const SECOND_RESPONSES = [
  "Perfect! Based on your preferences, I've found some amazing destinations that match exactly what you're looking for. Here are my top recommendations:",
  
  "Excellent! I've analyzed your requirements and found some incredible options. These destinations offer exactly the kind of experience you're seeking:",
  
  "Wonderful! Your travel style is coming together beautifully. I've curated these perfect matches for your dream adventure:"
]

/**
 * Input validation utility
 */
const validateInput = (input: string): ValidationResult => {
  const trimmedInput = input.trim()
  const errors: string[] = []

  if (!trimmedInput) {
    errors.push('Please enter your travel preferences')
  }

  if (trimmedInput.length > 750) {
    errors.push('Message is too long. Please keep it under 750 characters.')
  }

  if (trimmedInput.length < 10) {
    errors.push('Please provide more details about your dream trip')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * TODO: REMOVE IN PHASE 2 - Replace with real AI service
 * Two-step conversation response generator
 */
const generatePlaceholderResponse = async (_input: string, isFirstMessage: boolean): Promise<string> => {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
  
  if (isFirstMessage) {
    return FIRST_RESPONSE
  } else {
    // Return a random second response
    const randomIndex = Math.floor(Math.random() * SECOND_RESPONSES.length)
    return SECOND_RESPONSES[randomIndex] || "Perfect! Here are my recommendations:"
  }
}

/**
 * TODO: REMOVE IN PHASE 2 - Replace with real AI trip generation
 * Generate mock trip recommendations based on user input
 */
const generateMockTrips = (): TripRecommendation[] => {
  // Simple keyword-based trip selection (TODO: implement actual keyword matching in Phase 2)
  const selectedDestinations = mockDestinations.slice(0, 3) // Get first 3 destinations
  
  return selectedDestinations.map((destination, index) => ({
    tripId: `trip-${destination.id}-${Date.now()}-${index}`,
    destination: destination.name,
    duration: 5 + Math.floor(Math.random() * 5), // 5-9 days
    estimatedCost: destination.seasonalPricing.shoulder + Math.floor(Math.random() * 500),
    highlights: destination.activities.slice(0, 3).map(activity => activity.name),
    description: destination.description,
    activities: destination.activities.slice(0, 5).map(activity => activity.name),
    season: "spring",
    kidFriendly: destination.kidFriendlyScore > 7,
    customizations: {
      hotelType: "standard" as const,
      activities: destination.activities.slice(0, 3).map(activity => activity.name)
    },
    score: 75 + Math.floor(Math.random() * 25) // 75-100 score
  }))
}

/**
 * Main conversation service implementation
 * TODO: REMOVE IN PHASE 2 - Replace entire implementation with real AI integration
 */
class ConversationServiceImpl implements ConversationService {
  /**
   * Get AI response for user input
   * TODO: REMOVE IN PHASE 2 - Replace with real Gemini AI call
   */
  async getResponse(input: string, conversationHistory: { type: string }[] = []): Promise<AIResponse> {
    try {
      // Validate input
      const validation = this.validateInput(input)
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.errors[0] || 'Invalid input provided',
          error: 'INVALID_INPUT'
        }
      }

      // Determine if this is the first message (no prior AI responses)
      const aiMessages = conversationHistory.filter(msg => msg.type === 'ai')
      const isFirstMessage = aiMessages.length === 0

      // TODO: REMOVE IN PHASE 2 - Replace with real AI call
      const responseMessage = await generatePlaceholderResponse(input, isFirstMessage)

      // Only generate trip recommendations on second response
      let mockTrips: TripRecommendation[] = []
      if (!isFirstMessage) {
        mockTrips = generateMockTrips()
      }

      return {
        success: true,
        message: responseMessage,
        data: {
          recommendations: mockTrips,
          followUpQuestions: isFirstMessage ? [
            "What's your ideal travel budget?",
            "Are you traveling with family or friends?", 
            "Do you prefer adventure or relaxation?"
          ] : []
        }
      }

    } catch (error) {
      console.error('Conversation service error:', error)
      
      return {
        success: false,
        message: "I'm having trouble processing your request right now. Please try again in a moment.",
        error: 'SERVICE_UNAVAILABLE'
      }
    }
  }

  /**
   * Validate user input
   */
  validateInput(input: string): ValidationResult {
    return validateInput(input)
  }
}

// Export singleton instance
export const conversationService = new ConversationServiceImpl()

// Export for testing
export { validateInput }