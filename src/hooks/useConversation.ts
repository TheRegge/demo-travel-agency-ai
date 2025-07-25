/**
 * Custom hook for conversation logic
 * Handles state management and AI communication
 */

import { useState, useCallback } from 'react'
import { conversationService } from '@/services/conversationService'
import { 
  ConversationState, 
  UseConversationReturn,
  ConversationMessage 
} from '@/types/conversation'

const INITIAL_STATE: ConversationState = {
  isLoading: false,
  currentResponse: '',
  userInput: '',
  messages: [],
  error: null
}

export const useConversation = (): UseConversationReturn => {
  const [state, setState] = useState<ConversationState>(INITIAL_STATE)

  /**
   * Submit a message to the AI service
   */
  const submitMessage = useCallback(async (message: string) => {
    if (!message.trim()) return

    // Set loading state
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      userInput: ''
    }))

    // Add user message to conversation
    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      content: message,
      timestamp: new Date(),
      type: 'user'
    }

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }))

    try {
      // Get AI response
      const response = await conversationService.getResponse(message)

      if (response.success) {
        // Add AI message to conversation
        const aiMessage: ConversationMessage = {
          id: `ai-${Date.now()}`,
          content: response.message,
          timestamp: new Date(),
          type: 'ai'
        }

        setState(prev => ({
          ...prev,
          isLoading: false,
          currentResponse: response.message,
          messages: [...prev.messages, aiMessage],
          error: null
        }))
      } else {
        // Handle error response
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Something went wrong. Please try again.',
          currentResponse: ''
        }))
      }
    } catch (error) {
      console.error('Error submitting message:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Unable to process your request. Please check your connection and try again.',
        currentResponse: ''
      }))
    }
  }, [])

  /**
   * Clear the conversation
   */
  const clearConversation = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  /**
   * Update user input
   */
  const updateInput = useCallback((input: string) => {
    setState(prev => ({
      ...prev,
      userInput: input
    }))
  }, [])

  return {
    state,
    submitMessage,
    clearConversation,
    updateInput
  }
}