"use client"

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react"
import { AppState, TravelContextActions, TravelContextType, ChatMessage, FilterState, TripRecommendationSet } from "@/types/app"
import { TripRecommendation, ConversationContext, ExtractedTravelInfo } from "@/types/travel"
import { contextStorage, PersistentConversationContext } from "@/services/contextStorageService"

// Initial state
const initialState: AppState = {
  chatHistory: [],
  tripHistory: [],
  recommendedTrips: [],
  savedTrips: [],
  activeFilters: {},
  isAIProcessing: false,
  selectedTripId: null,
  currentSessionTokens: 0,
  dailySessions: 0,
  error: null,
  // Context persistence state
  conversationContext: null,
  persistentContext: null,
  contextLoaded: false,
}

// Action types
type TravelAction = 
  | { type: "ADD_MESSAGE"; payload: ChatMessage }
  | { type: "CLEAR_CHAT_HISTORY" }
  | { type: "SET_IS_TYPING"; payload: boolean }
  | { type: "UPDATE_RECOMMENDATIONS"; payload: TripRecommendation[] }
  | { type: "ADD_TRIP_RECOMMENDATIONS"; payload: { messageId: string; trips: TripRecommendation[]; context?: string } }
  | { type: "SELECT_TRIP"; payload: string }
  | { type: "SAVE_TRIP"; payload: string }
  | { type: "UNSAVE_TRIP"; payload: string }
  | { type: "UPDATE_FILTERS"; payload: Partial<FilterState> }
  | { type: "CLEAR_FILTERS" }
  | { type: "INCREMENT_TOKEN_USAGE"; payload: number }
  | { type: "INCREMENT_SESSION_COUNT" }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_IS_PROCESSING"; payload: boolean }
  // Context persistence actions
  | { type: "LOAD_PERSISTENT_CONTEXT"; payload: PersistentConversationContext }
  | { type: "UPDATE_CONVERSATION_CONTEXT"; payload: ConversationContext }
  | { type: "UPDATE_CONTEXT_PREFERENCES"; payload: Partial<ExtractedTravelInfo> }
  | { type: "CLEAR_CONVERSATION_CONTEXT" }
  | { type: "SET_CONTEXT_LOADED"; payload: boolean }

// Reducer function
function travelReducer(state: AppState, action: TravelAction): AppState {
  switch (action.type) {
    case "ADD_MESSAGE":
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload],
      }
    
    case "CLEAR_CHAT_HISTORY":
      return {
        ...state,
        chatHistory: [],
      }
    
    case "SET_IS_TYPING":
      return {
        ...state,
        isAIProcessing: action.payload,
      }
    
    case "UPDATE_RECOMMENDATIONS":
      console.log('TravelContext: UPDATE_RECOMMENDATIONS called with:', action.payload)
      return {
        ...state,
        recommendedTrips: action.payload,
      }
    
    case "ADD_TRIP_RECOMMENDATIONS":
      const newTripSet: TripRecommendationSet = {
        id: crypto.randomUUID(),
        messageId: action.payload.messageId,
        trips: action.payload.trips,
        timestamp: new Date(),
        ...(action.payload.context && { conversationContext: action.payload.context })
      }
      console.log('TravelContext: ADD_TRIP_RECOMMENDATIONS called with:', newTripSet)
      return {
        ...state,
        tripHistory: [...state.tripHistory, newTripSet],
        currentTripDisplayId: newTripSet.id,
        recommendedTrips: action.payload.trips, // Also update current trips for backward compatibility
      }
    
    case "SELECT_TRIP":
      return {
        ...state,
        selectedTripId: action.payload,
      }
    
    case "SAVE_TRIP":
      return {
        ...state,
        savedTrips: [...state.savedTrips, action.payload],
      }
    
    case "UNSAVE_TRIP":
      return {
        ...state,
        savedTrips: state.savedTrips.filter(id => id !== action.payload),
      }
    
    case "UPDATE_FILTERS":
      return {
        ...state,
        activeFilters: { ...state.activeFilters, ...action.payload },
      }
    
    case "CLEAR_FILTERS":
      return {
        ...state,
        activeFilters: {},
      }
    
    case "INCREMENT_TOKEN_USAGE":
      return {
        ...state,
        currentSessionTokens: state.currentSessionTokens + action.payload,
      }
    
    case "INCREMENT_SESSION_COUNT":
      return {
        ...state,
        dailySessions: state.dailySessions + 1,
      }
    
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      }
    
    case "SET_IS_PROCESSING":
      return {
        ...state,
        isAIProcessing: action.payload,
      }
    
    case "LOAD_PERSISTENT_CONTEXT":
      return {
        ...state,
        persistentContext: action.payload,
        conversationContext: contextStorage.toConversationContext(action.payload),
        currentSessionTokens: action.payload.tokenUsage,
        contextLoaded: true,
      }
    
    case "UPDATE_CONVERSATION_CONTEXT":
      return {
        ...state,
        conversationContext: action.payload,
      }
    
    case "UPDATE_CONTEXT_PREFERENCES":
      const updatedPersistentContext = state.persistentContext ? {
        ...state.persistentContext,
        userPreferences: {
          ...state.persistentContext.userPreferences,
          ...action.payload
        },
        lastUpdated: new Date().toISOString()
      } : null
      
      const updatedConversationContext = state.conversationContext ? {
        ...state.conversationContext,
        extractedInfo: {
          ...state.conversationContext.extractedInfo,
          ...action.payload
        }
      } : null
      
      return {
        ...state,
        persistentContext: updatedPersistentContext,
        conversationContext: updatedConversationContext,
      }
    
    case "CLEAR_CONVERSATION_CONTEXT":
      return {
        ...state,
        conversationContext: null,
        persistentContext: null,
        currentSessionTokens: 0,
        contextLoaded: true,
      }
    
    case "SET_CONTEXT_LOADED":
      return {
        ...state,
        contextLoaded: action.payload,
      }
    
    default:
      return state
  }
}

// Create context
const TravelContext = createContext<TravelContextType | undefined>(undefined)

// Provider component
interface TravelProviderProps {
  children: ReactNode
}

export function TravelProvider({ children }: TravelProviderProps) {
  const [state, dispatch] = useReducer(travelReducer, initialState)
  
  // Load context on mount
  useEffect(() => {
    const loadContext = async () => {
      try {
        const persistentContext = contextStorage.loadContext()
        if (persistentContext) {
          dispatch({ type: "LOAD_PERSISTENT_CONTEXT", payload: persistentContext })
        } else {
          dispatch({ type: "SET_CONTEXT_LOADED", payload: true })
        }
      } catch (error) {
        console.warn('Error loading persistent context:', error)
        dispatch({ type: "SET_CONTEXT_LOADED", payload: true })
      }
    }
    
    loadContext()
  }, [])
  
  // Save context when it changes
  useEffect(() => {
    if (state.conversationContext && state.contextLoaded) {
      const saveContext = () => {
        try {
          const originalQuery = state.persistentContext?.originalQuery || state.chatHistory[0]?.content
          const saveData: {
            messageCount: number
            tokenUsage: number
            conversationSummary?: string
            originalQuery?: string
          } = {
            messageCount: state.chatHistory.length,
            tokenUsage: state.currentSessionTokens,
            ...(state.persistentContext?.conversationSummary && { 
              conversationSummary: state.persistentContext.conversationSummary 
            }),
            ...(originalQuery && { originalQuery })
          }
          contextStorage.saveContext(state.conversationContext!, saveData)
        } catch (error) {
          console.warn('Error saving conversation context:', error)
        }
      }
      
      // Debounce context saving
      const timeoutId = setTimeout(saveContext, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [state.conversationContext, state.chatHistory.length, state.currentSessionTokens, state.contextLoaded, state.persistentContext])
  
  const actions: TravelContextActions = {
    addMessage: (message) => {
      const messageId = crypto.randomUUID()
      const fullMessage = {
        ...message,
        id: messageId,
        timestamp: new Date()
      }
      dispatch({ type: "ADD_MESSAGE", payload: fullMessage })
      return messageId
    },
    clearChatHistory: () => dispatch({ type: "CLEAR_CHAT_HISTORY" }),
    setIsTyping: (isTyping) => dispatch({ type: "SET_IS_TYPING", payload: isTyping }),
    updateRecommendations: (trips) => dispatch({ type: "UPDATE_RECOMMENDATIONS", payload: trips }),
    addTripRecommendations: (messageId, trips, context) => 
      dispatch({ type: "ADD_TRIP_RECOMMENDATIONS", payload: { messageId, trips, ...(context && { context }) } }),
    getTripsByMessageId: (messageId) => 
      state.tripHistory.find(set => set.messageId === messageId)?.trips,
    selectTrip: (tripId) => dispatch({ type: "SELECT_TRIP", payload: tripId }),
    saveTrip: (tripId) => dispatch({ type: "SAVE_TRIP", payload: tripId }),
    unsaveTrip: (tripId) => dispatch({ type: "UNSAVE_TRIP", payload: tripId }),
    updateFilters: (filters) => dispatch({ type: "UPDATE_FILTERS", payload: filters }),
    clearFilters: () => dispatch({ type: "CLEAR_FILTERS" }),
    incrementTokenUsage: (tokens) => dispatch({ type: "INCREMENT_TOKEN_USAGE", payload: tokens }),
    incrementSessionCount: () => dispatch({ type: "INCREMENT_SESSION_COUNT" }),
    setError: (error) => dispatch({ type: "SET_ERROR", payload: error }),
    // Context persistence actions
    loadPersistentContext: () => {
      const persistentContext = contextStorage.loadContext()
      if (persistentContext) {
        dispatch({ type: "LOAD_PERSISTENT_CONTEXT", payload: persistentContext })
      }
      return persistentContext
    },
    updateConversationContext: (context) => dispatch({ type: "UPDATE_CONVERSATION_CONTEXT", payload: context }),
    updateContextPreferences: (preferences) => {
      dispatch({ type: "UPDATE_CONTEXT_PREFERENCES", payload: preferences })
      // Also save to localStorage
      contextStorage.updateContextPreferences(preferences)
    },
    clearConversationContext: () => {
      dispatch({ type: "CLEAR_CONVERSATION_CONTEXT" })
      contextStorage.clearContext()
    },
    getContextSummary: () => contextStorage.getContextSummary(),
    isContextPersistenceEnabled: () => contextStorage.isContextPersistenceEnabled(),
  }
  
  return (
    <TravelContext.Provider value={{ state, actions }}>
      {children}
    </TravelContext.Provider>
  )
}

// Hook to use the context
export function useTravelContext() {
  const context = useContext(TravelContext)
  if (context === undefined) {
    throw new Error("useTravelContext must be used within a TravelProvider")
  }
  return context
}

export { TravelContext }