/**
 * Conversation Service
 * Handles communication with AI via server-side API
 */

import { 
  AIResponse, 
  ConversationService, 
  ValidationResult
} from '@/types/conversation'
import { ConversationContext, ClarificationQuestion } from '@/types/travel'
import { 
  generateClarificationQuestions, 
  generateContextAwareClarificationQuestions,
  updateContextWithClarification,
  detectContextModifications
} from './clarificationService'
import { contextStorage } from './contextStorageService'

// Security validation patterns
const FORBIDDEN_PATTERNS = [
  'ignore previous',
  'system:',
  'assistant:',
  'forget your',
  'pretend you are',
  'act as if'
]

/**
 * Input validation utility with security checks
 */
const validateInput = (input: string): ValidationResult => {
  const trimmedInput = input.trim()
  const lowerInput = trimmedInput.toLowerCase()
  const errors: string[] = []

  if (!trimmedInput) {
    errors.push('Please enter your travel preferences')
  }

  if (trimmedInput.length > 1000) {
    errors.push('Message is too long. Please keep it under 1000 characters.')
  }

  if (trimmedInput.length < 10) {
    errors.push('Please provide more details about your dream trip')
  }

  // Basic prompt injection protection
  const hasSecurityIssue = FORBIDDEN_PATTERNS.some(pattern => 
    lowerInput.includes(pattern.toLowerCase())
  )
  
  if (hasSecurityIssue) {
    errors.push('Please focus on travel planning questions only.')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}


/**
 * Main conversation service implementation with server-side AI API
 */
class ConversationServiceImpl implements ConversationService {
  /**
   * Get AI response for user input via server-side API
   */
  async getResponse(input: string, conversationHistory: { type: string; content: string }[] = [], context?: ConversationContext): Promise<AIResponse> {
    try {
      // Validate input client-side first
      const validation = this.validateInput(input)
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.errors[0] || 'Invalid input provided',
          error: 'INVALID_INPUT'
        }
      }

      // Load persistent context and analyze input with accumulated context
      const persistentContext = contextStorage.loadContext()
      let currentContext: ConversationContext
      let contextModifications: import('@/types/travel').ContextModification[] = []

      if (context) {
        // Use provided context as-is - let the API handle AI analysis
        currentContext = context
      } else {
        // No context provided - let the API handle initial AI analysis
        // Create a minimal context for now
        currentContext = {
          userIntent: {
            destinations: [],
            keywords: [],
            ambiguityLevel: 'unclear' as const,
            tripTypeHint: 'unknown' as const
          },
          extractedInfo: {},
          missingInfo: [],
          conversationStage: 'initial'
        }
      }

      // SKIP old clarification logic - let the API handle AI analysis and clarification
      // The API route will use AI analysis to determine if clarification is needed

      // Call server-side API
      
      const response = await fetch('/api/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          conversationHistory,
          context: currentContext
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      
      
      return {
        success: data.success,
        message: data.message,
        data: data.data,
        error: data.error,
        clarificationNeeded: data.clarificationNeeded,
        clarificationQuestions: data.clarificationQuestions,
        conversationContext: data.conversationContext
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

  /**
   * Check if user input is answering a clarification question
   */
  private isAnsweringClarification(input: string): boolean {
    // Simple heuristics - could be improved
    const clarificationIndicators = [
      /^(single|multi|one|multiple)/i,
      /^(solo|couple|family|group)/i,
      /^(budget|moderate|luxury|comfortable)/i,
      /^\d+\s*(day|week|month)/i,
      /^(food|culture|nature|city|relaxation)/i
    ]
    
    return clarificationIndicators.some(pattern => pattern.test(input.trim()))
  }

  /**
   * Parse clarification answer from user input
   */
  private parseClarificationAnswer(input: string): { questionId?: string, answer: string } {
    // For now, return the input as the answer
    // In a real implementation, this would parse structured responses
    return { answer: input.toLowerCase().trim() }
  }

  /**
   * Generate a friendly clarification message
   */
  private generateClarificationMessage(context: ConversationContext, _questions: ClarificationQuestion[]): string {
    const { userIntent, conversationStage } = context
    
    let message = ""
    
    if (conversationStage === "initial") {
      if (userIntent.destinations && userIntent.destinations.length > 0) {
        message = `${userIntent.destinations.join(', ')} sounds amazing! `
      } else {
        message = "That sounds like a wonderful trip! "
      }
      message += "To help me create the perfect recommendations, I have a few questions:"
    } else {
      message = "Great! I have a couple more questions to help personalize your recommendations:"
    }
    
    return message
  }
}

// Export singleton instance
export const conversationService = new ConversationServiceImpl()

// Export for testing
export { validateInput }