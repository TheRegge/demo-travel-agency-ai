import { TripRecommendation, ConversationContext, ExtractedTravelInfo } from "./travel"
import { PersistentConversationContext } from "@/services/contextStorageService"

// Chat message types
export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
}

// Trip recommendation set with message association
export interface TripRecommendationSet {
  id: string
  messageId: string  // Links to the AI message that generated these trips
  trips: TripRecommendation[]
  timestamp: Date
  conversationContext?: string // Optional context about what user asked for
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
  
  // Trip recommendation history with message associations
  tripHistory: TripRecommendationSet[]
  
  // Currently recommended trips (displayed outside chat) - kept for backward compatibility
  recommendedTrips: TripRecommendation[]
  
  // Which trip set is currently featured (optional)
  currentTripDisplayId?: string
  
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
  
  // Context persistence state
  conversationContext: ConversationContext | null
  persistentContext: PersistentConversationContext | null
  contextLoaded: boolean
}

// Context actions for state management
export interface TravelContextActions {
  // Chat actions
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => string // Returns the generated message ID
  clearChatHistory: () => void
  setIsTyping: (isTyping: boolean) => void
  
  // Trip recommendation actions
  updateRecommendations: (trips: TripRecommendation[]) => void
  addTripRecommendations: (messageId: string, trips: TripRecommendation[], context?: string) => void
  getTripsByMessageId: (messageId: string) => TripRecommendation[] | undefined
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
  
  // Context persistence actions
  loadPersistentContext: () => PersistentConversationContext | null
  updateConversationContext: (context: ConversationContext) => void
  updateContextPreferences: (preferences: Partial<ExtractedTravelInfo>) => void
  clearConversationContext: () => void
  getContextSummary: () => {
    hasContext: boolean
    preferences: string[]
    lastUpdated?: Date
    messageCount: number
  }
  isContextPersistenceEnabled: () => boolean
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