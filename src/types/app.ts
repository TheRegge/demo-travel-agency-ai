import { TripRecommendation } from "./travel"

// Chat message types
export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
}

// Filter state for trip recommendations
export interface FilterState {
  budget?: {
    min: number
    max: number
  }
  duration?: {
    min: number
    max: number
  }
  category?: string[]
  kidFriendly?: boolean
  destination?: string
}

// Global application state
export interface AppState {
  // Chat conversation history
  chatHistory: ChatMessage[]
  
  // Currently recommended trips (displayed outside chat)
  recommendedTrips: TripRecommendation[]
  
  // User's saved/favorited trips
  savedTrips: string[]
  
  // Active filters from AI suggestions
  activeFilters: FilterState
  
  // UI state
  isAIProcessing: boolean
  selectedTripId: string | null
  currentSessionTokens: number
  dailySessions: number
  
  // Error state
  error: string | null
}

// Context actions for state management
export interface TravelContextActions {
  // Chat actions
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void
  clearChatHistory: () => void
  setIsTyping: (isTyping: boolean) => void
  
  // Trip recommendation actions
  updateRecommendations: (trips: TripRecommendation[]) => void
  selectTrip: (tripId: string) => void
  saveTrip: (tripId: string) => void
  unsaveTrip: (tripId: string) => void
  
  // Filter actions
  updateFilters: (filters: Partial<FilterState>) => void
  clearFilters: () => void
  
  // Session management
  incrementTokenUsage: (tokens: number) => void
  incrementSessionCount: () => void
  
  // Error handling
  setError: (error: string | null) => void
}

// Context type combining state and actions
export interface TravelContextType {
  state: AppState
  actions: TravelContextActions
}

// UI component prop types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// Animation variant types for Framer Motion
export type AnimationVariant = 
  | "fadeIn"
  | "slideUp"
  | "slideLeft"  
  | "scaleIn"
  | "bounce"
  | "drift"
  | "sway"
  | "wave"

// Theme mode (for future dark mode support)
export type ThemeMode = "light" | "dark"

// Device type for responsive behavior
export type DeviceType = "mobile" | "tablet" | "desktop"

// Loading states
export type LoadingState = "idle" | "loading" | "success" | "error"