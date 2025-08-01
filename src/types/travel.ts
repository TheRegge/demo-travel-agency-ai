// Core travel data types matching PRD specifications

export interface TripRecommendation {
  tripId: string
  destination: string
  duration: number // Days  
  estimatedCost: number
  highlights: string[]
  description: string
  activities: string[]
  activityDetails?: Activity[] // Optional rich activity objects with descriptions
  season: string
  kidFriendly: boolean
  customizations: {
    departureDate?: string
    hotelType?: "budget" | "standard" | "luxury"
    activities?: string[]
  }
  score: number // Relevance score 0-100
  // New fields for multi-destination support
  type: "single" | "multi-destination"
  itinerary?: MultiDestinationItinerary
  // Hotel data from mock destinations
  hotels?: Hotel[]
}

// Multi-destination trip support
export interface MultiDestinationItinerary {
  legs: TripLeg[]
  totalDistance: string // "2,400 miles" or "3,850 km"
  totalTransportCost: number
  transportSummary: string // "Mix of flights and trains"
}

export interface TripLeg {
  legId: string
  destination: string
  duration: number // Days at this destination
  description: string
  highlights: string[]
  activities: string[]
  hotels: Hotel[]
  estimatedCost: number // Cost for this destination only
  transportToNext?: TransportationOption // How to get to next destination
}

export interface TransportationOption {
  method: TransportMethod
  duration: string // "3h 15min"
  cost: number
  description: string // "High-speed train from Paris Gare du Nord"
  alternatives?: TransportationAlternative[]
  bookingInfo?: string // "Book 2-3 weeks ahead for best prices"
}

export interface TransportationAlternative {
  method: TransportMethod
  duration: string
  cost: number
  description: string
  pros?: string[] // ["Scenic route", "No baggage restrictions"]
  cons?: string[] // ["Longer travel time", "Weather dependent"]
}

export type TransportMethod = "flight" | "train" | "bus" | "car_rental" | "ferry" | "rideshare" | "private_transfer"

export interface AITripResponse {
  // Human-readable chat message
  chatMessage: string
  
  // Structured trip recommendations  
  recommendations?: {
    trips: TripRecommendation[]
    totalBudget: number
    alternativeOptions?: TripRecommendation[]
  }
  
  // Follow-up engagement
  followUpQuestions?: string[]
  suggestedFilters?: string[]
  
  // New: Clarification questions when AI needs more info
  clarificationNeeded?: boolean
  clarificationQuestions?: ClarificationQuestion[]
  conversationContext?: ConversationContext
}

// Clarification system for multi-turn conversations
export interface ClarificationQuestion {
  id: string
  type: ClarificationQuestionType
  question: string
  options?: ClarificationOption[]
  required: boolean
  context?: string // Why this question is being asked
}

export interface ClarificationOption {
  value: string
  label: string
  description?: string
}

export type ClarificationQuestionType = 
  | "trip_type" // Single vs multi-destination
  | "duration" // How long is the trip
  | "dates" // When are they traveling
  | "budget" // Budget range
  | "preferences" // Food, culture, adventure, etc.
  | "group_size" // Solo, couple, family, group
  | "accommodation" // Hotel preferences

// Context for maintaining conversation state
export interface ConversationContext {
  userIntent: UserIntent
  extractedInfo: ExtractedTravelInfo
  missingInfo: ClarificationQuestionType[]
  conversationStage: "initial" | "clarifying" | "planning" | "refining" | "completed"
  travelRelevance?: 'travel_related' | 'travel_adjacent' | 'non_travel'
}

// Enhanced context for persistence and context management
export interface EnhancedConversationContext extends ConversationContext {
  sessionId?: string
  messageCount: number
  tokenUsage: number
  conversationSummary?: string
  originalQuery?: string
  lastUpdated?: Date
}

// Context modification types for tracking changes
export interface ContextModification {
  type: 'preference_update' | 'refinement' | 'variation_request' | 'new_query'
  field?: keyof ExtractedTravelInfo
  previousValue?: ExtractedTravelInfo[keyof ExtractedTravelInfo]
  newValue?: ExtractedTravelInfo[keyof ExtractedTravelInfo]
  confidence: number // 0-1 how confident we are about this modification
}

export interface UserIntent {
  destinations?: string[] // Mentioned places
  keywords: string[] // Budget, luxury, family, food, etc.
  ambiguityLevel: "clear" | "somewhat_clear" | "unclear"
  tripTypeHint?: "single" | "multi-destination" | "unknown"
}

export interface ExtractedTravelInfo {
  budget?: number
  duration?: number
  dates?: {
    startDate?: string
    endDate?: string
    season?: "spring" | "summer" | "fall" | "autumn" | "winter"
    flexibility?: "exact" | "flexible" | "very_flexible"
  }
  period?: string // General time references like "next month", "in the fall", "this summer"
  travelers?: {
    adults: number
    children: number
    ages?: number[]
  }
  preferences?: string[]
  accommodationType?: "budget" | "standard" | "luxury"
  // New fields for enhanced context tracking
  tripType?: "single" | "multi-destination"
  regions?: string[] // Preferred regions (europe, asia, etc.)
  budgetFlexibility?: "strict" | "somewhat_flexible" | "very_flexible"
  durationFlexibility?: "exact" | "plus_minus_few_days" | "flexible"
}

// Context-aware response enhancement
export interface ContextAwareResponse {
  isContextual: boolean
  referencedPreferences: string[]
  modifiedPreferences?: ContextModification[]
  contextContinuity: number // 0-1 how well this response continues the conversation
}

// Conversation management types
export interface ConversationMemory {
  establishedFacts: Record<string, unknown>
  userPreferences: ExtractedTravelInfo
  conversationHistory: Array<{
    userInput: string
    systemResponse: string
    timestamp: Date
    contextModifications?: ContextModification[]
  }>
  activeTopics: string[]
  resolvedQuestions: ClarificationQuestionType[]
}

export interface MockDestination {
  id: string
  name: string
  category: "family-friendly" | "budget" | "luxury" | "adventure" | "urban" | "scenic" | "cultural" | "romantic"
  location: {
    country: string
    region: string
    coordinates?: { lat: number; lng: number }
  }
  seasonalPricing: {
    peak: number
    shoulder: number  
    offSeason: number
  }
  kidFriendlyScore: number // 0-10
  activities: Activity[]
  hotels: Hotel[]
  flightData: FlightData
  description: string
  imageUrl?: string
  weatherInfo?: WeatherInfo
}

export interface Activity {
  id: string
  name: string
  type: "attraction" | "dining" | "adventure" | "cultural" | "relaxation" | "romantic"
  duration: number // Hours
  cost: number
  ageAppropriate: boolean
  description: string
  location?: string
}

export interface Hotel {
  id: string
  name: string
  type: "budget" | "standard" | "luxury"
  pricePerNight: number
  rating: number // 1-5
  amenities: string[]
  kidFriendly: boolean
  description: string
}

export interface FlightData {
  averageCost: number
  duration: string // "3h 30m"
  airlines: string[]
  directFlight: boolean
}

export interface WeatherInfo {
  currentTemp: number
  condition: string
  forecast: {
    date: string
    high: number
    low: number
    condition: string
  }[]
}

// Real API integration types
export interface RealAPIDestination {
  countryInfo: {
    name: string
    capital: string
    region: string
    currency: string
    languages: string[]
    timezone: string
    coordinates: [number, number]
    flag: string
  }
  weather?: {
    current: {
      temp: number
      feels_like: number
      humidity: number
      weather: {
        main: string
        description: string
        icon: string
      }
    }
    forecast: Array<{
      date: string
      temp_min: number
      temp_max: number
      weather: {
        main: string
        description: string
        icon: string
      }
    }>
  }
  attractions?: Array<{
    id: string
    name: string
    coordinates: [number, number]
    rating: number
    categories: string[]
    address?: string
    description?: string
    image?: string
    url?: string
    phone?: string
    website?: string
    openingHours?: string
  }>
  flights?: Array<{
    id: string
    price: number
    currency: string
    duration: string
    stops: number
    airline: string
    departure: {
      airport: string
      time: string
      date: string
    }
    arrival: {
      airport: string
      time: string
      date: string
    }
  }>
  hotels?: Array<{
    id: string
    name: string
    rating?: string | number
    address?: string
    coordinates?: [number, number]
    minPrice?: number
    pricePerNight?: number
    currency?: string
    amenities?: string[]
    type?: string
    kidFriendly?: boolean
    description?: string
  }>
}

// Enhanced trip recommendation with real data
export interface EnhancedTripRecommendation extends TripRecommendation {
  realData?: RealAPIDestination
  dataSource: 'mock' | 'real' | 'hybrid'
  lastUpdated?: Date
  apiSources: {
    countryData: boolean
    weatherData: boolean
    attractionsData: boolean
    flightData: boolean
    hotelData: boolean
  }
  hotelDataSource?: 'api' | 'mock' | 'generated'
  dataSourceMessage?: string // User-friendly message about data sources
}

export interface PriceBreakdown {
  flights: number
  accommodation: number
  activities: number
  meals: number
  transportation: number
  other: number
  total: number
}

// Fallback trip database structure
export interface FallbackTripDatabase {
  ultraBudget: {
    localDayTrips: LocalDestination[]
    freeActivities: Activity[]
    budgetTips: SavingStrategy[]
  }
  lowBudget: {
    weekendGetaways: WeekendTrip[]
    campingOptions: CampgroundData[]
    budgetHotels: Hotel[]
  }
  moderateBudget: {
    fullTrips: CompleteItinerary[]
    standardOptions: TravelPackage[]
  }
}

export interface LocalDestination {
  name: string
  distance: string // "30 miles"
  activities: string[]
  estimatedCost: number
  duration: string // "half day"
}

export interface WeekendTrip {
  destination: string
  duration: number
  highlights: string[]
  totalCost: number
  transportation: string
}

export interface CampgroundData {
  name: string
  location: string
  costPerNight: number
  amenities: string[]
  activities: string[]
}

export interface CompleteItinerary {
  destination: string
  days: DayPlan[]
  totalCost: number
  includes: string[]
}

export interface DayPlan {
  day: number
  title: string
  activities: {
    time: string
    activity: string
    cost?: number
    notes?: string
  }[]
}

export interface TravelPackage {
  name: string
  destination: string
  duration: number
  highlights: string[]
  price: number
  includes: string[]
}

export interface SavingStrategy {
  title: string
  description: string
  potentialSavings: string
  effort: "low" | "medium" | "high"
}