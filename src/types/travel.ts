// Core travel data types matching PRD specifications

export interface TripRecommendation {
  tripId: string
  destination: string
  duration: number // Days  
  estimatedCost: number
  highlights: string[]
  customizations: {
    departureDate?: string
    hotelType?: "budget" | "standard" | "luxury"
    activities?: string[]
  }
  score: number // Relevance score 0-100
}

export interface AITripResponse {
  // Human-readable chat message
  chatMessage: string
  
  // Structured trip recommendations  
  recommendations: {
    trips: TripRecommendation[]
    totalBudget: number
    alternativeOptions?: TripRecommendation[]
  }
  
  // Follow-up engagement
  followUpQuestions?: string[]
  suggestedFilters?: string[]
}

export interface MockDestination {
  id: string
  name: string
  category: "family-friendly" | "budget" | "luxury" | "adventure" | "urban" | "scenic" | "cultural"
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
  type: "attraction" | "dining" | "adventure" | "cultural" | "relaxation"
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