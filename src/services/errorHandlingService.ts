/**
 * Error Handling Service
 * Provides centralized error handling and fallback mechanisms for API failures
 */

import { TripRecommendation, EnhancedTripRecommendation, Hotel } from '@/types/travel'
import { mockDestinations } from '@/lib/mock-data/destinations'

// Import SimplifiedFlight type
interface SimplifiedFlight {
  id: string;
  price: number;
  currency: string;
  duration: string;
  stops: number;
  airline: string;
  departure: {
    airport: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    time: string;
    date: string;
  };
  segments: unknown[];
}

// Mock data interfaces
export interface MockCountryData {
  name: { common: string; official: string };
  capital: string[];
  region: string;
  currency: string;
  languages: string[];
  timezone: string;
  latlng: number[];
  flag: string;
}

export interface MockWeatherData {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    };
  };
  forecast?: {
    daily: Array<{
      dt: number;
      temp: { day: number; night: number };
      weather: { main: string; description: string };
    }>;
  };
}

export interface MockAttraction {
  name: string;
  category: string;
  description: string;
  rating: number;
}

export interface MockFlightData {
  id: string;
  airline: string;
  price: number;
  currency: string;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  stops: number;
}

export interface MockHotelData {
  name: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  description: string;
}

export interface APIError {
  service: string
  error: Error
  fallbackUsed: boolean
  timestamp: Date
}

export interface ErrorHandlingOptions {
  retryAttempts?: number
  retryDelay?: number
  fallbackToMock?: boolean
  logErrors?: boolean
}

class ErrorHandlingService {
  private errorLog: APIError[] = []
  private maxLogSize = 100

  async withFallback<T>(
    apiCall: () => Promise<T>,
    fallback: () => T | Promise<T>,
    serviceName: string,
    options: ErrorHandlingOptions = {}
  ): Promise<T> {
    const {
      retryAttempts = 1,
      retryDelay = 1000,
      fallbackToMock = true,
      logErrors = true
    } = options

    let lastError: Error | null = null

    // Try the API call with retries
    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        const result = await apiCall()
        return result
      } catch (error) {
        lastError = error as Error
        
        if (logErrors) {
          console.warn(`${serviceName} API attempt ${attempt} failed:`, error)
        }

        // Wait before retry (except on last attempt)
        if (attempt < retryAttempts) {
          await this.delay(retryDelay * attempt)
        }
      }
    }

    // Log the error
    if (logErrors && lastError) {
      this.logError(serviceName, lastError, fallbackToMock)
    }

    // Use fallback if enabled
    if (fallbackToMock) {
      console.log(`${serviceName} API failed, using fallback data`)
      return await fallback()
    }

    // If no fallback, throw the last error
    throw lastError
  }

  async enhanceTripsWithFallback(
    trips: TripRecommendation[],
    enhanceFunction: (trips: TripRecommendation[]) => Promise<EnhancedTripRecommendation[]>
  ): Promise<EnhancedTripRecommendation[]> {
    return this.withFallback(
      () => enhanceFunction(trips),
      () => this.createMockEnhancedTrips(trips),
      'TripEnhancement',
      {
        retryAttempts: 2,
        retryDelay: 500,
        fallbackToMock: true
      }
    )
  }

  async getCountryDataWithFallback<T>(
    countryName: string,
    apiCall: (name: string) => Promise<T>
  ): Promise<T> {
    return this.withFallback(
      () => apiCall(countryName),
      () => this.getMockCountryData(countryName) as T,
      'CountryData',
      {
        retryAttempts: 2,
        retryDelay: 1000
      }
    )
  }

  async getWeatherDataWithFallback<T>(
    lat: number,
    lon: number,
    apiCall: (lat: number, lon: number) => Promise<T>
  ): Promise<T> {
    return this.withFallback(
      () => apiCall(lat, lon),
      () => this.getMockWeatherData() as T,
      'WeatherData',
      {
        retryAttempts: 3,
        retryDelay: 500
      }
    )
  }

  async getAttractionsWithFallback<T>(
    lat: number,
    lon: number,
    apiCall: (lat: number, lon: number) => Promise<T[]>
  ): Promise<T[]> {
    return this.withFallback(
      () => apiCall(lat, lon),
      () => this.getMockAttractions() as T[],
      'Attractions',
      {
        retryAttempts: 2,
        retryDelay: 1000
      }
    )
  }

  async getFlightDataWithFallback<T>(
    cityName: string,
    apiCall: (cityName: string) => Promise<T[]>
  ): Promise<T[]> {
    return this.withFallback(
      () => apiCall(cityName),
      () => {
        const mockFlights = this.getMockFlightData(cityName);
        // Convert mock flights to SimplifiedFlight format expected by UI
        const convertedFlights = mockFlights.map(mockFlight => 
          this.convertMockFlightToSimplified(mockFlight, cityName)
        );
        return convertedFlights as T[];
      },
      'FlightData',
      {
        retryAttempts: 2,
        retryDelay: 2000, // Longer delay for rate limiting
        fallbackToMock: true
      }
    )
  }

  async getHotelDataWithFallback<T>(
    cityName: string,
    apiCall: (cityName: string) => Promise<T[]>
  ): Promise<T[]> {
    return this.withFallback(
      () => apiCall(cityName),
      () => this.getMockHotelData(cityName) as T[],
      'HotelData',
      {
        retryAttempts: 2,
        retryDelay: 2000, // Longer delay for rate limiting
        fallbackToMock: true
      }
    )
  }

  private createMockEnhancedTrips(trips: TripRecommendation[]): EnhancedTripRecommendation[] {
    return trips.map(trip => {
      // Find matching mock destination to get hotel data
      const mockDest = mockDestinations.find(dest => {
        const tripDest = trip.destination.toLowerCase().split(',')[0] || ''
        const destName = dest.name.toLowerCase().split(',')[0] || ''
        return dest.name.toLowerCase().includes(tripDest) ||
               trip.destination.toLowerCase().includes(destName)
      })
      
      // Always ensure we have hotels - prioritize: trip.hotels → mock destination → generated
      let hotels: Hotel[]
      let hotelSource: 'api' | 'mock' | 'generated' = 'generated'
      
      if (trip.hotels && trip.hotels.length > 0) {
        hotels = trip.hotels
        hotelSource = 'mock' // Trip already had hotels (likely from AI)
      } else if (mockDest?.hotels && mockDest.hotels.length > 0) {
        hotels = mockDest.hotels
        hotelSource = 'mock' // Got hotels from mock destination
      } else {
        // Generate hotels if none found
        const mockHotels = this.generateHotelsForDestination(trip.destination)
        hotels = mockHotels.map(h => ({
          id: `hotel-${h.name.toLowerCase().replace(/\s+/g, '-')}`,
          name: h.name,
          type: h.pricePerNight < 100 ? 'budget' as const : h.pricePerNight < 200 ? 'standard' as const : 'luxury' as const,
          pricePerNight: h.pricePerNight,
          rating: h.rating,
          amenities: h.amenities,
          kidFriendly: h.amenities.includes('Family-friendly'),
          description: h.description
        }))
        hotelSource = 'generated'
      }
      
      return {
        ...trip,
        hotels,
        dataSource: 'mock' as const,
        lastUpdated: new Date(),
        apiSources: {
          countryData: false,
          weatherData: false,
          attractionsData: false,
          flightData: false,
          hotelData: false, // Never mark as true since these aren't from real API
        },
        hotelDataSource: hotelSource
      }
    })
  }

  private getMockCountryData(countryName: string): MockCountryData {
    // Provide realistic mock data for common countries
    const mockCountries: { [key: string]: MockCountryData } = {
      'Italy': {
        name: { common: 'Italy', official: 'Italian Republic' },
        capital: ['Rome'],
        region: 'Europe',
        currency: 'Euro',
        languages: ['Italian'],
        timezone: 'UTC+1',
        latlng: [42.8333, 12.8333],
        flag: 'https://flagcdn.com/it.svg'
      },
      'France': {
        name: { common: 'France', official: 'French Republic' },
        capital: ['Paris'],
        region: 'Europe',
        currency: 'Euro',
        languages: ['French'],
        timezone: 'UTC+1',
        latlng: [46, 2],
        flag: 'https://flagcdn.com/fr.svg'
      },
      'Spain': {
        name: { common: 'Spain', official: 'Kingdom of Spain' },
        capital: ['Madrid'],
        region: 'Europe',
        currency: 'Euro',
        languages: ['Spanish'],
        timezone: 'UTC+1',
        latlng: [40, -4],
        flag: 'https://flagcdn.com/es.svg'
      },
      'Germany': {
        name: { common: 'Germany', official: 'Federal Republic of Germany' },
        capital: ['Berlin'],
        region: 'Europe',
        currency: 'Euro',
        languages: ['German'],
        timezone: 'UTC+1',
        latlng: [51, 9],
        flag: 'https://flagcdn.com/de.svg'
      }
    }

    // Return specific mock data if available, otherwise generic
    if (mockCountries[countryName]) {
      return mockCountries[countryName]
    }

    // Generic fallback
    return {
      name: { common: countryName, official: countryName },
      capital: ['Capital City'],
      region: 'Region',
      currency: 'Local Currency',
      languages: ['Local Language'],
      timezone: 'UTC+0',
      latlng: [0, 0],
      flag: ''
    }
  }

  private getMockWeatherData(): MockWeatherData {
    return {
      current: {
        temp: 22,
        feels_like: 24,
        humidity: 65,
        weather: {
          main: 'Clear',
          description: 'clear sky',
          icon: '01d'
        }
      },
      forecast: {
        daily: []
      }
    }
  }

  private getMockAttractions(): MockAttraction[] {
    return [
      {
        name: 'Historic City Center',
        category: 'Historic',
        rating: 3,
        description: 'Beautiful historic center with traditional architecture'
      },
      {
        name: 'Local Museum',
        category: 'Museums',
        rating: 2,
        description: 'Fascinating local history and culture'
      }
    ]
  }

  private getMockFlightData(cityName: string): MockFlightData[] {
    console.log(`🔄 Generating fallback flight data for ${cityName}`);
    
    // Determine price range based on destination characteristics
    const getFlightPricing = (city: string) => {
      const cityLower = city.toLowerCase();
      
      // European destinations - typically cheaper from US East Coast
      if (cityLower.includes('london') || cityLower.includes('paris') || cityLower.includes('dublin') || 
          cityLower.includes('amsterdam') || cityLower.includes('berlin') || cityLower.includes('rome')) {
        return { base: 400, range: 300, region: 'Europe' };
      }
      
      // Asian destinations - more expensive, longer flights
      if (cityLower.includes('tokyo') || cityLower.includes('bangkok') || cityLower.includes('singapore') ||
          cityLower.includes('seoul') || cityLower.includes('beijing')) {
        return { base: 800, range: 500, region: 'Asia' };
      }
      
      // South American destinations
      if (cityLower.includes('rio') || cityLower.includes('lima') || cityLower.includes('buenos aires')) {
        return { base: 600, range: 400, region: 'South America' };
      }
      
      // Default to mid-range international
      return { base: 500, range: 350, region: 'International' };
    };

    const pricing = getFlightPricing(cityName);
    
    // Generate 2-4 realistic flight options
    const flightOptions: MockFlightData[] = [
      {
        id: `mock-flight-${Date.now()}-1`,
        airline: 'AA',
        price: pricing.base + Math.floor(Math.random() * pricing.range),
        currency: 'USD',
        duration: pricing.region === 'Asia' ? 'PT14H30M' : pricing.region === 'Europe' ? 'PT8H15M' : 'PT11H45M',
        departureTime: '10:30 AM',
        arrivalTime: pricing.region === 'Asia' ? '2:00 PM+1' : pricing.region === 'Europe' ? '6:45 PM' : '10:15 PM',
        stops: 0
      },
      {
        id: `mock-flight-${Date.now()}-2`,
        airline: pricing.region === 'Europe' ? 'VS' : 'DL',
        price: pricing.base - 50 + Math.floor(Math.random() * (pricing.range - 100)),
        currency: 'USD',
        duration: pricing.region === 'Asia' ? 'PT16H20M' : pricing.region === 'Europe' ? 'PT10H30M' : 'PT13H15M',
        departureTime: '2:15 PM',
        arrivalTime: pricing.region === 'Asia' ? '8:35 PM+1' : pricing.region === 'Europe' ? '12:45 PM+1' : '3:30 AM+1',
        stops: 1
      },
      {
        id: `mock-flight-${Date.now()}-3`,
        airline: pricing.region === 'Europe' ? 'BA' : 'UA',
        price: pricing.base + 100 + Math.floor(Math.random() * (pricing.range - 150)),
        currency: 'USD',
        duration: pricing.region === 'Asia' ? 'PT15H45M' : pricing.region === 'Europe' ? 'PT9H20M' : 'PT12H30M',
        departureTime: '6:45 PM',
        arrivalTime: pricing.region === 'Asia' ? '12:30 PM+2' : pricing.region === 'Europe' ? '4:05 PM+1' : '7:15 AM+1',
        stops: pricing.region === 'Asia' ? 1 : 0
      }
    ];
    
    // Return 2-3 options randomly
    const numOptions = 2 + Math.floor(Math.random() * 2);
    const selectedOptions = flightOptions.slice(0, numOptions);
    
    console.log(`✅ Generated ${selectedOptions.length} fallback flights for ${cityName} (${pricing.region})`);
    selectedOptions.forEach(flight => {
      console.log(`  - ${flight.airline}: $${flight.price}, ${flight.duration}, ${flight.stops} stops`);
    });
    
    return selectedOptions;
  }

  /**
   * Convert MockFlightData to SimplifiedFlight format expected by UI
   */
  convertMockFlightToSimplified(mockFlight: MockFlightData, cityName: string): SimplifiedFlight {
    // Generate airport codes based on destination
    const getAirportCodes = (city: string) => {
      const cityLower = city.toLowerCase();
      if (cityLower.includes('dublin')) return { departure: 'JFK', arrival: 'DUB' };
      if (cityLower.includes('london')) return { departure: 'JFK', arrival: 'LHR' };
      if (cityLower.includes('paris')) return { departure: 'JFK', arrival: 'CDG' };
      if (cityLower.includes('tokyo')) return { departure: 'JFK', arrival: 'NRT' };
      if (cityLower.includes('rome')) return { departure: 'JFK', arrival: 'FCO' };
      if (cityLower.includes('amsterdam')) return { departure: 'JFK', arrival: 'AMS' };
      // Default fallback
      return { departure: 'JFK', arrival: 'INT' };
    };

    const airports = getAirportCodes(cityName);
    
    // Parse arrival time to handle +1 day notation
    const parseArrivalTime = (arrivalTime: string) => {
      const isNextDay = arrivalTime.includes('+');
      const time = arrivalTime.replace(/\+\d+$/, '');
      
      const today = new Date();
      const arrivalDate = new Date(today);
      if (isNextDay) {
        arrivalDate.setDate(arrivalDate.getDate() + 1);
      }
      
      return {
        time,
        date: arrivalDate.toLocaleDateString()
      };
    };

    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + 30); // 30 days from now
    
    const arrival = parseArrivalTime(mockFlight.arrivalTime);

    return {
      id: mockFlight.id,
      price: mockFlight.price,
      currency: mockFlight.currency,
      duration: mockFlight.duration,
      stops: mockFlight.stops,
      airline: mockFlight.airline,
      departure: {
        airport: airports.departure,
        time: mockFlight.departureTime,
        date: departureDate.toLocaleDateString()
      },
      arrival: {
        airport: airports.arrival,
        time: arrival.time,
        date: arrival.date
      },
      segments: [] // Mock segments - could be populated if needed
    };
  }

  generateHotelsForDestination(destination: string): MockHotelData[] {
    // Extract city name from destination (e.g., "Paris, France" -> "Paris")
    const cityName = destination.split(',')[0]?.trim() || destination
    
    // Generate contextual hotel names based on destination
    const hotelTemplates = [
      {
        nameTemplate: `Grand ${cityName} Hotel`,
        type: 'luxury',
        basePrice: 280,
        priceRange: 200,
        rating: 4.5 + Math.random() * 0.4,
        amenities: ['WiFi', 'Spa', 'Fine Dining', 'Concierge', 'Fitness Center']
      },
      {
        nameTemplate: `${cityName} Boutique Inn`,
        type: 'standard',
        basePrice: 150,
        priceRange: 100,
        rating: 4.0 + Math.random() * 0.5,
        amenities: ['WiFi', 'Restaurant', 'Bar', 'Room Service']
      },
      {
        nameTemplate: `Historic ${cityName} Lodge`,
        type: 'standard',
        basePrice: 120,
        priceRange: 80,
        rating: 3.8 + Math.random() * 0.6,
        amenities: ['WiFi', 'Breakfast', 'Historic Building', 'Garden']
      },
      {
        nameTemplate: `${cityName} Budget Stay`,
        type: 'budget',
        basePrice: 75,
        priceRange: 50,
        rating: 3.5 + Math.random() * 0.8,
        amenities: ['WiFi', 'Breakfast', 'Parking']
      }
    ]
    
    return hotelTemplates.map((template, index) => ({
      id: `generated-hotel-${cityName.toLowerCase().replace(/\s+/g, '-')}-${index + 1}`,
      name: template.nameTemplate,
      type: template.type,
      pricePerNight: template.basePrice + Math.floor(Math.random() * template.priceRange),
      minPrice: template.basePrice + Math.floor(Math.random() * template.priceRange), // For compatibility
      rating: Math.round(template.rating * 10) / 10,
      amenities: template.amenities,
      kidFriendly: template.type !== 'luxury', // Luxury hotels may be less kid-friendly
      description: `${template.type === 'luxury' ? 'Luxurious' : template.type === 'budget' ? 'Comfortable and affordable' : 'Charming'} accommodation in the heart of ${cityName}.`,
      address: `${Math.floor(Math.random() * 999) + 1} ${['Main', 'Central', 'Historic', 'Royal', 'Grand'][Math.floor(Math.random() * 5)]} Street, ${cityName}`,
      coordinates: [0, 0],
      currency: 'USD'
    }))
  }

  private getMockHotelData(cityName: string): MockHotelData[] {
    // Use the same generation logic for API fallback
    return this.generateHotelsForDestination(cityName)
  }

  private logError(serviceName: string, error: Error, fallbackUsed: boolean): void {
    const errorEntry: APIError = {
      service: serviceName,
      error,
      fallbackUsed,
      timestamp: new Date()
    }

    this.errorLog.push(errorEntry)

    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize)
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Public methods for monitoring
  getErrorLog(): APIError[] {
    return [...this.errorLog]
  }

  getErrorStats(): { [service: string]: { total: number; withFallback: number } } {
    const stats: { [service: string]: { total: number; withFallback: number } } = {}

    this.errorLog.forEach(error => {
      if (!stats[error.service]) {
        stats[error.service] = { total: 0, withFallback: 0 }
      }
      const serviceStats = stats[error.service]
      if (serviceStats) {
        serviceStats.total++
        if (error.fallbackUsed) {
          serviceStats.withFallback++
        }
      }
    })

    return stats
  }

  clearErrorLog(): void {
    this.errorLog = []
  }

  // Health check methods
  getServiceHealth(): { [service: string]: 'healthy' | 'degraded' | 'unhealthy' } {
    const stats = this.getErrorStats()
    const now = new Date()
    const recentErrors = this.errorLog.filter(
      error => now.getTime() - error.timestamp.getTime() < 5 * 60 * 1000 // Last 5 minutes
    )

    const health: { [service: string]: 'healthy' | 'degraded' | 'unhealthy' } = {}

    // Check each service
    Object.keys(stats).forEach(service => {
      const serviceRecentErrors = recentErrors.filter(error => error.service === service)
      const errorCount = serviceRecentErrors.length

      if (errorCount === 0) {
        health[service] = 'healthy'
      } else if (errorCount <= 3) {
        health[service] = 'degraded'
      } else {
        health[service] = 'unhealthy'
      }
    })

    return health
  }

  isServiceHealthy(serviceName: string): boolean {
    const health = this.getServiceHealth()
    return health[serviceName] === 'healthy' || !health[serviceName] // Assume healthy if no errors
  }
}

export const errorHandlingService = new ErrorHandlingService()