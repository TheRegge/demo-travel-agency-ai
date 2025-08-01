/**
 * Conversation Service
 * Handles communication with AI via server-side API
 */

import { 
  AIResponse, 
  ConversationService,
  ValidationResult
} from '@/types/conversation'
import { ConversationContext } from '@/types/travel'
// Note: The following imports are kept for potential future use
// import { 
//   generateClarificationQuestions, 
//   generateContextAwareClarificationQuestions,
//   updateContextWithClarification,
//   detectContextModifications
// } from './clarificationService'
// import { contextStorage } from './contextStorageService' // Keeping for future use

// Note: All validation is now handled server-side by securityService


/**
 * Main conversation service implementation with server-side AI API
 */
class ConversationServiceImpl implements ConversationService {
  /**
   * Get AI response for user input via server-side API
   */
  async getResponse(input: string, conversationHistory: { type: string; content: string }[] = [], context?: ConversationContext, captchaToken?: string): Promise<AIResponse> {
    try {
      // Note: All validation is now done server-side including CAPTCHA verification

      // Load persistent context and analyze input with accumulated context
      // const persistentContext = contextStorage.loadContext()
      let currentContext: ConversationContext
      // const contextModifications: import('@/types/travel').ContextModification[] = []

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
      const requestBody = {
        input,
        conversationHistory,
        context: currentContext,
        captchaToken
      }
      
      console.log('🌐 Sending to API:', {
        input: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
        inputLength: input.length,
        historyLength: conversationHistory.length,
        hasContext: !!currentContext
      })
      
      const response = await fetch('/api/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json().catch(() => ({ 
        success: false, 
        error: 'Unknown error',
        message: 'Failed to parse server response'
      }))
      
      // Handle both successful and error responses properly
      return {
        success: data.success || false,
        message: data.message || 'An error occurred',
        data: data.data,
        error: data.error,
        clarificationNeeded: data.clarificationNeeded,
        clarificationQuestions: data.clarificationQuestions,
        conversationContext: data.conversationContext,
        rateLimitInfo: data.rateLimitInfo,
        requiresCaptcha: data.requiresCaptcha // Include CAPTCHA requirement
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

  // Note: Input validation is now handled server-side

  /**
   * Validate user input
   */
  validateInput(input: string): ValidationResult {
    const errors: string[] = []
    
    if (!input || input.trim().length === 0) {
      errors.push('Input cannot be empty')
    }
    
    if (input.length > 1000) {
      errors.push('Input is too long (max 1000 characters)')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Export singleton instance
export const conversationService = new ConversationServiceImpl()

// Note: Validation functions moved to securityService