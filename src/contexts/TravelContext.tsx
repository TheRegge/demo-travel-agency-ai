"use client"

import React, { createContext, useContext, useReducer, ReactNode } from "react"
import { AppState, TravelContextActions, TravelContextType, ChatMessage, FilterState, TripRecommendationSet } from "@/types/app"
import { TripRecommendation } from "@/types/travel"

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