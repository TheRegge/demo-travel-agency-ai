/**
 * Custom hook for conversation logic
 * Handles state management and AI communication
 */

import { useState, useCallback } from 'react'
import { conversationService } from '@/services/conversationService'
import { useTravelContext } from '@/contexts/TravelContext'
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
  const { actions: travelActions } = useTravelContext()

  /**
   * Submit a message to the AI service
   */
  const submitMessage = useCallback(async (message: string) => {
    if (!message.trim()) return

    // Set loading state in both local and global context
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      userInput: ''
    }))
    travelActions.setIsTyping(true)

    // Add user message to both contexts
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

    travelActions.addMessage({
      role: 'user',
      content: message
    })

    try {
      // Get AI response, passing conversation history
      const response = await conversationService.getResponse(message, state.messages)

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
          error: null,
          userInput: '' // Ensure input stays cleared
        }))

        // Add AI message to global context and get the generated message ID
        const messageId = travelActions.addMessage({
          role: 'assistant',
          content: response.message
        })

        // Update trip recommendations using new trip history system
        if (response.data?.recommendations && response.data.recommendations.length > 0) {
          console.log('Adding trip recommendations to history for message:', messageId, response.data.recommendations) // Debug logging
          
          // Use the new trip history system
          travelActions.addTripRecommendations(
            messageId, 
            response.data.recommendations,
            'AI travel recommendations' // Optional context
          )
          
          // Also update old system for backward compatibility
          travelActions.updateRecommendations(response.data.recommendations)
        } else {
          console.log('No recommendations in response (likely first message):', response.data) // Debug logging
        }

        travelActions.setIsTyping(false)
      } else {
        // Handle error response
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Something went wrong. Please try again.',
          currentResponse: '',
          userInput: '' // Ensure input stays cleared
        }))
        travelActions.setIsTyping(false)
        travelActions.setError(response.message || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting message:', error)
      const errorMessage = 'Unable to process your request. Please check your connection and try again.'
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        currentResponse: '',
        userInput: '' // Ensure input stays cleared
      }))
      travelActions.setIsTyping(false)
      travelActions.setError(errorMessage)
    }
  }, [travelActions])

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