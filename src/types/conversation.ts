/**
 * TypeScript interfaces for conversation flow
 * These interfaces are designed to work with both placeholder and real AI systems
 */

// Core conversation types
export interface ConversationMessage {
  id: string
  content: string
  timestamp: Date
  type: 'user' | 'ai'
}

export interface ConversationState {
  isLoading: boolean
  currentResponse: string
  userInput: string
  messages: ConversationMessage[]
  error: string | null
}

// AI Response interfaces (matches future real AI structure)
export interface AIResponse {
  success: boolean
  message: string
  data?: {
    recommendations?: TripRecommendation[]
    followUpQuestions?: string[]
  }
  error?: string
}

// Trip recommendation types (matches existing mock data structure)
export interface TripRecommendation {
  tripId: string
  destination: string
  duration: number
  estimatedCost: number
  highlights: string[]
  description: string
  activities: string[]
  season: string
  kidFriendly: boolean
}

// Service interfaces
export interface ConversationService {
  getResponse(input: string): Promise<AIResponse>
  validateInput(input: string): ValidationResult
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Hook interfaces
export interface UseConversationReturn {
  state: ConversationState
  submitMessage: (message: string) => Promise<void>
  clearConversation: () => void
  updateInput: (input: string) => void
}

export interface UseCharacterLimitReturn {
  count: number
  isValid: boolean
  getColorClass: () => string
  maxChars: number
}

// Component prop interfaces
export interface ConversationDisplayProps {
  isLoading: boolean
  response: string
  onLoadingComplete?: () => void
}

export interface ConversationInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
  disabled?: boolean
  maxLength: number
  placeholder?: string
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Error types
export type ConversationError = 
  | 'INVALID_INPUT'
  | 'CHARACTER_LIMIT_EXCEEDED'
  | 'SERVICE_UNAVAILABLE'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'

export interface ConversationErrorState {
  type: ConversationError
  message: string
  retryable: boolean
}