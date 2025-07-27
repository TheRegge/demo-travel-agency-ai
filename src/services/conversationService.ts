/**
 * Conversation Service
 * Handles communication with AI via server-side API
 */

import { 
  AIResponse, 
  ConversationService, 
  ValidationResult
} from '@/types/conversation'

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
  async getResponse(input: string, conversationHistory: { type: string; content: string }[] = []): Promise<AIResponse> {
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

      // Call server-side API
      const response = await fetch('/api/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          conversationHistory
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
        error: data.error
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