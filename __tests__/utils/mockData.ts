import { 
  TripRecommendation, 
  MockDestination, 
  ConversationContext,
  AITripResponse 
} from '@/types/travel'
import { ChatMessage } from '@/types/app'

export const mockTripRecommendations: TripRecommendation[] = [
  {
    tripId: 'paris-romantic-trip',
    destination: 'Paris, France',
    duration: 7,
    estimatedCost: 4500,
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Seine River Cruise'],
    description: 'A romantic week in the City of Light',
    activities: ['City tour', 'Museum visits', 'Fine dining'],
    season: 'spring',
    kidFriendly: false,
    customizations: {
      hotelType: 'luxury',
      activities: ['romantic dinner cruise']
    },
    score: 92,
    type: 'single',
  },
  {
    tripId: 'tokyo-family-trip',
    destination: 'Tokyo, Japan',
    duration: 10,
    estimatedCost: 6000,
    highlights: ['Disney Tokyo', 'Mount Fuji', 'Traditional temples'],
    description: 'Family adventure in modern and traditional Japan',
    activities: ['Theme parks', 'Cultural experiences', 'Food tours'],
    season: 'spring',
    kidFriendly: true,
    customizations: {
      hotelType: 'standard'
    },
    score: 88,
    type: 'single',
  }
]

export const mockDestination: MockDestination = {
  id: 'paris-france',
  name: 'Paris, France',
  category: 'romantic',
  location: {
    country: 'France',
    region: 'Île-de-France',
    coordinates: { lat: 48.8566, lng: 2.3522 }
  },
  seasonalPricing: {
    peak: 5000,
    shoulder: 4000,
    offSeason: 3000
  },
  kidFriendlyScore: 7,
  activities: [
    {
      id: 'eiffel-tower-visit',
      name: 'Eiffel Tower Visit',
      type: 'attraction',
      duration: 2,
      cost: 30,
      ageAppropriate: true,
      description: 'Visit the iconic Eiffel Tower'
    }
  ],
  hotels: [
    {
      id: 'luxury-hotel-paris',
      name: 'Le Meurice',
      type: 'luxury',
      pricePerNight: 800,
      rating: 5,
      amenities: ['Spa', 'Fine dining', 'Concierge'],
      kidFriendly: true,
      description: 'Luxury hotel in the heart of Paris'
    }
  ],
  flightData: {
    averageCost: 800,
    duration: '8h 30m',
    airlines: ['Air France', 'Delta'],
    directFlight: true
  },
  description: 'The romantic capital of the world'
}

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    type: 'user',
    content: 'I want to plan a romantic trip to Paris',
    timestamp: new Date('2024-01-01T12:00:00Z')
  },
  {
    id: 'msg-2',
    type: 'assistant',
    content: 'I\'d love to help you plan a romantic trip to Paris! Here are some wonderful options:',
    timestamp: new Date('2024-01-01T12:00:30Z')
  }
]

export const mockConversationContext: ConversationContext = {
  userIntent: {
    destinations: ['Paris'],
    keywords: ['romantic', 'luxury'],
    ambiguityLevel: 'clear',
    tripTypeHint: 'single'
  },
  extractedInfo: {
    budget: 5000,
    duration: 7,
    dates: {
      season: 'spring',
      flexibility: 'flexible'
    },
    travelers: {
      adults: 2,
      children: 0
    },
    preferences: ['romantic', 'culture', 'fine dining'],
    accommodationType: 'luxury'
  },
  missingInfo: [],
  conversationStage: 'planning'
}

export const mockAIResponse: AITripResponse = {
  chatMessage: 'Here are some wonderful romantic trip options for Paris!',
  recommendations: {
    trips: mockTripRecommendations,
    totalBudget: 4500
  },
  followUpQuestions: [
    'Would you prefer a specific arrondissement?',
    'Are you interested in day trips outside Paris?'
  ]
}