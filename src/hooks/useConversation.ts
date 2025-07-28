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
  error: null,
  waitingForClarification: false
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
      // Format conversation history for AI service
      const formattedHistory = state.messages.map(msg => ({
        type: msg.type,
        content: msg.content
      }))
      
      // Get AI response, passing conversation history
      const response = await conversationService.getResponse(message, formattedHistory)

      if (response.success) {
        
        // Add AI message to conversation
        const aiMessage: ConversationMessage = {
          id: `ai-${Date.now()}`,
          content: response.message,
          timestamp: new Date(),
          type: 'ai'
        }

        setState(prev => {
          const newState = {
            ...prev,
            isLoading: false,
            currentResponse: response.message,
            messages: [...prev.messages, aiMessage],
            error: null,
            userInput: '', // Ensure input stays cleared
            // Handle clarification questions
            ...(response.clarificationQuestions && { clarificationQuestions: response.clarificationQuestions }),
            ...(response.conversationContext && { conversationContext: response.conversationContext }),
            waitingForClarification: response.clarificationNeeded || false
          }
          
          
          return newState
        })

        // Add AI message to global context and get the generated message ID
        const messageId = travelActions.addMessage({
          role: 'assistant',
          content: response.message
        })

        // Update trip recommendations using new trip history system
        if (response.data?.recommendations && response.data.recommendations.length > 0) {
          
          // Use the new trip history system
          travelActions.addTripRecommendations(
            messageId, 
            response.data.recommendations,
            'AI travel recommendations' // Optional context
          )
          
          // Also update old system for backward compatibility
          travelActions.updateRecommendations(response.data.recommendations)
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
  }, [travelActions, state.messages])

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

  /**
   * Store answer to clarification question
   */
  const answerClarification = useCallback((questionId: string, answer: string) => {
    
    // Update the conversation context with the answer
    setState(prev => {
      if (!prev.conversationContext) return prev
      
      const updatedContext = { 
        ...prev.conversationContext,
        extractedInfo: { ...prev.conversationContext.extractedInfo }
      }
      
      
      // Update context based on question type - handle the actual question IDs
      if (questionId.includes('duration')) {
        // Answer is just the number (e.g., "3" for 3 days)
        const days = parseInt(answer)
        if (!isNaN(days)) {
          updatedContext.extractedInfo.duration = days
        }
      } else if (questionId.includes('budget')) {
        // Answer is just the number (e.g., "10000" for $10,000)
        const budget = parseInt(answer)
        if (!isNaN(budget)) {
          updatedContext.extractedInfo.budget = budget
        }
      } else if (questionId.includes('group_size')) {
        if (answer.includes('solo') || answer === '1') {
          updatedContext.extractedInfo.travelers = { adults: 1, children: 0 }
        } else if (answer.includes('couple') || answer === '2') {
          updatedContext.extractedInfo.travelers = { adults: 2, children: 0 }
        } else if (answer.includes('family')) {
          updatedContext.extractedInfo.travelers = { adults: 2, children: 2 }
        }
      } else if (questionId.includes('preferences')) {
        updatedContext.extractedInfo.preferences = [answer]
      }
      
      
      return {
        ...prev,
        conversationContext: updatedContext
      }
    })
  }, [])

  /**
   * Submit all clarification answers and get final recommendations
   */
  const submitClarificationAnswers = useCallback(async () => {
    if (!state.conversationContext) {
      console.error('🎯 submitClarificationAnswers: No context available!')
      return
    }
    
    // Set loading state
    setState(prev => ({
      ...prev,
      isLoading: true,
      waitingForClarification: false,
      error: null
    }))
    travelActions.setIsTyping(true)
    
    try {
      // Create a summary message based on the clarification answers
      const contextSummary = summarizeContext(state.conversationContext)
      const clarificationMessage = `Based on your preferences: ${contextSummary}`
      
      // Don't add the summary as a user message - it's internal
      // The API will handle showing the AI's response
      
      // Format conversation history for AI service
      const formattedHistory = state.messages.map(msg => ({
        type: msg.type,
        content: msg.content
      }))
      
      // Get AI response with the updated context
      // IMPORTANT: We need to ensure the context has the clarification answers
      const updatedContext = { ...state.conversationContext }
      
      // Remove items from missingInfo that we now have answers for
      
      if (updatedContext.extractedInfo.duration) {
        updatedContext.missingInfo = updatedContext.missingInfo.filter(item => item !== 'duration')
      }
      if (updatedContext.extractedInfo.budget) {
        updatedContext.missingInfo = updatedContext.missingInfo.filter(item => item !== 'budget')
      }
      if (updatedContext.extractedInfo.travelers) {
        updatedContext.missingInfo = updatedContext.missingInfo.filter(item => item !== 'group_size')
      }
      
      
      const response = await conversationService.getResponse(
        clarificationMessage, 
        formattedHistory, 
        updatedContext
      )

      
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
          // Clear clarification state
          waitingForClarification: false,
          clarificationQuestions: undefined,
          // Update context if provided
          ...(response.conversationContext && { conversationContext: response.conversationContext })
        }))

        // Add AI message to global context
        const messageId = travelActions.addMessage({
          role: 'assistant',
          content: response.message
        })

        // Update trip recommendations if provided
        if (response.data?.recommendations && response.data.recommendations.length > 0) {
          travelActions.addTripRecommendations(
            messageId, 
            response.data.recommendations,
            'Personalized recommendations based on your preferences'
          )
        }

        travelActions.setIsTyping(false)
      } else {
        // Handle error response
        console.error('🎯 submitClarificationAnswers: Error response:', response)
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Something went wrong. Please try again.',
          waitingForClarification: false
        }))
        travelActions.setIsTyping(false)
        travelActions.setError(response.message || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('🎯 submitClarificationAnswers: Exception caught:', error)
      const errorMessage = 'Unable to process your preferences. Please try again.'
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      travelActions.setIsTyping(false)
      travelActions.setError(errorMessage)
    }
  }, [state.conversationContext, state.messages, travelActions])
  
  /**
   * Helper function to summarize context for AI
   */
  const summarizeContext = (context: import('@/types/travel').ConversationContext): string => {
    const parts = []
    
    if (context.userIntent.destinations?.length) {
      parts.push(`destination: ${context.userIntent.destinations.join(', ')}`)
    }
    
    if (context.extractedInfo.budget) {
      parts.push(`budget: $${context.extractedInfo.budget}`)
    }
    
    if (context.extractedInfo.duration) {
      parts.push(`duration: ${context.extractedInfo.duration} days`)
    }
    
    if (context.extractedInfo.dates) {
      if (context.extractedInfo.dates.startDate && context.extractedInfo.dates.endDate) {
        parts.push(`dates: ${context.extractedInfo.dates.startDate} to ${context.extractedInfo.dates.endDate}`)
      } else if (context.extractedInfo.dates.season) {
        parts.push(`season: ${context.extractedInfo.dates.season}`)
      }
    }
    
    if (context.extractedInfo.period) {
      parts.push(`period: ${context.extractedInfo.period}`)
    }
    
    if (context.extractedInfo.travelers) {
      const { adults, children } = context.extractedInfo.travelers
      if (adults === 1 && children === 0) {
        parts.push('solo traveler')
      } else if (adults === 2 && children === 0) {
        parts.push('couple')
      } else if (children > 0) {
        parts.push('family trip')
      } else {
        parts.push(`${adults} adults`)
      }
    }
    
    if (context.extractedInfo.accommodationType) {
      parts.push(`${context.extractedInfo.accommodationType} accommodation`)
    }
    
    return parts.join(', ')
  }

  return {
    state,
    submitMessage,
    clearConversation,
    updateInput,
    answerClarification,
    submitClarificationAnswers
  }
}