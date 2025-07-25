/**
 * Conversation Service
 * Handles communication with AI (placeholder system for Phase 1)
 * 
 * TODO: REMOVE IN PHASE 2 - Replace placeholder logic with real Gemini AI integration
 */

import { 
  AIResponse, 
  ConversationService, 
  ValidationResult,
  ConversationError
} from '@/types/conversation'

// TODO: REMOVE IN PHASE 2 - Simple placeholder responses
const PLACEHOLDER_RESPONSES = [
  "Great choice! I'd love to help you plan your dream trip. Based on what you've told me, I can already see some amazing possibilities. Let me gather some personalized recommendations that match your budget, style, and preferences.",
  
  "That sounds like an incredible adventure! I'm analyzing your preferences and checking the best options available. What specific aspects of your trip are most important to you - the activities, accommodations, or perhaps the local culture?",
  
  "Wonderful! I can see you have excellent taste in destinations. I'm currently researching the perfect itinerary that balances your interests with practical considerations. Would you like me to focus on budget-friendly options or premium experiences?",
  
  "Exciting! Your travel dreams are coming together beautifully. I'm gathering information about the best times to visit, local attractions, and accommodation options that match your style. What's your flexibility with travel dates?"
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
 * Simple placeholder response generator
 */
const generatePlaceholderResponse = async (input: string): Promise<string> => {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
  
  // Return a random placeholder response
  const randomIndex = Math.floor(Math.random() * PLACEHOLDER_RESPONSES.length)
  return PLACEHOLDER_RESPONSES[randomIndex]
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
  async getResponse(input: string): Promise<AIResponse> {
    try {
      // Validate input
      const validation = this.validateInput(input)
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.errors[0],
          error: 'INVALID_INPUT'
        }
      }

      // TODO: REMOVE IN PHASE 2 - Replace with real AI call
      const responseMessage = await generatePlaceholderResponse(input)

      return {
        success: true,
        message: responseMessage,
        data: {
          // TODO: REMOVE IN PHASE 2 - Add real trip recommendations
          recommendations: [],
          followUpQuestions: [
            "What's your ideal travel budget?",
            "Are you traveling with family or friends?",
            "Do you prefer adventure or relaxation?"
          ]
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
export { validateInput, PLACEHOLDER_RESPONSES }