/**
 * TypeScript interfaces for conversation flow
 * These interfaces are designed to work with both placeholder and real AI systems
 */

import { TripRecommendation, ClarificationQuestion, ConversationContext } from './travel'

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
  // New: Clarification support
  clarificationQuestions?: ClarificationQuestion[]
  conversationContext?: ConversationContext
  waitingForClarification: boolean
  // Security features
  requiresCaptcha?: boolean
}

// Rate limit information interface
export interface RateLimitInfo {
  sessionsUsed: number
  sessionsRemaining: number
  tokensUsed: number
  tokensRemaining: number
  resetTime: Date | string
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
  // New: Clarification support
  clarificationNeeded?: boolean
  clarificationQuestions?: ClarificationQuestion[]
  conversationContext?: ConversationContext
  // Rate limiting information
  rateLimitInfo?: RateLimitInfo
  // Security features
  requiresCaptcha?: boolean
}

// TripRecommendation is imported from './travel' at the top

// Service interfaces
export interface ConversationService {
  getResponse(input: string, conversationHistory?: { type: string; content: string }[], context?: ConversationContext): Promise<AIResponse>
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
  // New: Clarification support
  answerClarification: (questionId: string, answer: string) => void
  submitClarificationAnswers: () => Promise<void>
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
  onSubmit: (value: string, captchaToken?: string) => void
  disabled?: boolean
  maxLength: number
  placeholder?: string
  requiresCaptcha?: boolean
  onCaptchaVerify?: (token: string) => void
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

// Trip component interfaces
export interface TripCardProps {
  trip: TripRecommendation
  onSelect?: (trip: TripRecommendation) => void
  onSave?: ((tripId: string) => void) | undefined
  isSaved?: boolean
}

export interface TripRecommendationsProps {
  trips: TripRecommendation[]
  onTripSelect?: (trip: TripRecommendation) => void
  onTripSave?: (tripId: string) => void
  savedTripIds?: string[]
  isLoading?: boolean
}

export interface TripDetailModalProps {
  trip: TripRecommendation | null
  isOpen: boolean
  onClose: () => void
  onSave?: (tripId: string) => void
  isSaved?: boolean
}

// Trip detail interfaces
export interface TripItinerary {
  day: number
  title: string
  activities: string[]
  meals: string[]
  accommodation?: string
}

export interface TripBudgetBreakdown {
  category: string
  amount: number
  description: string
}

export interface ExtendedTripRecommendation extends TripRecommendation {
  legacyItinerary?: TripItinerary[] // Renamed to avoid conflict with MultiDestinationItinerary
  budgetBreakdown?: TripBudgetBreakdown[]
  images?: string[]
  weatherInfo?: string
  bestTimeToVisit?: string
  travelTips?: string[]
}