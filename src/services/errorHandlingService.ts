/**
 * Error Handling Service
 * Provides centralized error handling and fallback mechanisms for API failures
 */

import { TripRecommendation, EnhancedTripRecommendation } from '@/types/travel'
import { mockDestinations } from '@/lib/mock-data/destinations'

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

  async getCountryDataWithFallback(
    countryName: string,
    apiCall: (name: string) => Promise<any>
  ): Promise<any> {
    return this.withFallback(
      () => apiCall(countryName),
      () => this.getMockCountryData(countryName),
      'CountryData',
      {
        retryAttempts: 2,
        retryDelay: 1000
      }
    )
  }

  async getWeatherDataWithFallback(
    lat: number,
    lon: number,
    apiCall: (lat: number, lon: number) => Promise<any>
  ): Promise<any> {
    return this.withFallback(
      () => apiCall(lat, lon),
      () => this.getMockWeatherData(),
      'WeatherData',
      {
        retryAttempts: 3,
        retryDelay: 500
      }
    )
  }

  async getAttractionsWithFallback(
    lat: number,
    lon: number,
    apiCall: (lat: number, lon: number) => Promise<any[]>
  ): Promise<any[]> {
    return this.withFallback(
      () => apiCall(lat, lon),
      () => this.getMockAttractions(),
      'Attractions',
      {
        retryAttempts: 2,
        retryDelay: 1000
      }
    )
  }

  async getFlightDataWithFallback(
    cityName: string,
    apiCall: (cityName: string) => Promise<any[]>
  ): Promise<any[]> {
    return this.withFallback(
      () => apiCall(cityName),
      () => this.getMockFlightData(cityName),
      'FlightData',
      {
        retryAttempts: 2,
        retryDelay: 2000, // Longer delay for rate limiting
        fallbackToMock: true
      }
    )
  }

  async getHotelDataWithFallback(
    cityName: string,
    apiCall: (cityName: string) => Promise<any[]>
  ): Promise<any[]> {
    return this.withFallback(
      () => apiCall(cityName),
      () => this.getMockHotelData(cityName),
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
      const mockDest = mockDestinations.find(dest => 
        dest.name.toLowerCase().includes(trip.destination.toLowerCase().split(',')[0]) ||
        trip.destination.toLowerCase().includes(dest.name.toLowerCase().split(',')[0])
      )
      
      // Always ensure we have hotels - prioritize: trip.hotels → mock destination → generated
      let hotels = trip.hotels || mockDest?.hotels
      let hotelSource: 'api' | 'mock' | 'generated' = 'generated'
      
      if (trip.hotels && trip.hotels.length > 0) {
        hotelSource = 'mock' // Trip already had hotels (likely from AI)
      } else if (mockDest?.hotels && mockDest.hotels.length > 0) {
        hotelSource = 'mock' // Got hotels from mock destination
      } else {
        // Generate hotels if none found
        hotels = this.generateHotelsForDestination(trip.destination)
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

  private getMockCountryData(countryName: string): any {
    // Provide realistic mock data for common countries
    const mockCountries: { [key: string]: any } = {
      'Italy': {
        name: { common: 'Italy', official: 'Italian Republic' },
        capital: ['Rome'],
        region: 'Europe',
        currency: 'Euro',
        languages: ['Italian'],
        timezone: 'UTC+1',
        latlng: [42.8333, 12.8333],
        flags: { svg: 'https://flagcdn.com/it.svg' }
      },
      'France': {
        name: { common: 'France', official: 'French Republic' },
        capital: ['Paris'],
        region: 'Europe',
        currency: 'Euro',
        languages: ['French'],
        timezone: 'UTC+1',
        latlng: [46, 2],
        flags: { svg: 'https://flagcdn.com/fr.svg' }
      },
      'Spain': {
        name: { common: 'Spain', official: 'Kingdom of Spain' },
        capital: ['Madrid'],
        region: 'Europe',
        currency: 'Euro',
        languages: ['Spanish'],
        timezone: 'UTC+1',
        latlng: [40, -4],
        flags: { svg: 'https://flagcdn.com/es.svg' }
      },
      'Germany': {
        name: { common: 'Germany', official: 'Federal Republic of Germany' },
        capital: ['Berlin'],
        region: 'Europe',
        currency: 'Euro',
        languages: ['German'],
        timezone: 'UTC+1',
        latlng: [51, 9],
        flags: { svg: 'https://flagcdn.com/de.svg' }
      }
    }

    // Return specific mock data if available, otherwise generic
    if (mockCountries[countryName]) {
      return [mockCountries[countryName]]
    }

    // Generic fallback
    return [{
      name: { common: countryName, official: countryName },
      capital: ['Capital City'],
      region: 'Region',
      currency: 'Local Currency',
      languages: ['Local Language'],
      timezone: 'UTC+0',
      latlng: [0, 0],
      flags: { svg: '' }
    }]
  }

  private getMockWeatherData(): any {
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
      forecast: []
    }
  }

  private getMockAttractions(): any[] {
    return [
      {
        id: 'mock-1',
        name: 'Historic City Center',
        coordinates: [0, 0],
        rating: 3,
        categories: ['Historic', 'Architecture'],
        description: 'Beautiful historic center with traditional architecture'
      },
      {
        id: 'mock-2',
        name: 'Local Museum',
        coordinates: [0, 0],
        rating: 2,
        categories: ['Museums', 'Culture'],
        description: 'Fascinating local history and culture'
      }
    ]
  }

  private getMockFlightData(cityName: string): any[] {
    // Generate mock flight data based on city
    const flightOptions = [
      {
        id: `mock-flight-${cityName}-1`,
        price: 450 + Math.floor(Math.random() * 300),
        currency: 'USD',
        duration: 'PT8H15M',
        stops: 0,
        airline: 'AA',
        departure: {
          airport: 'NYC',
          time: '10:30 AM',
          date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
        },
        arrival: {
          airport: cityName.slice(0, 3).toUpperCase(),
          time: '6:45 PM',
          date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
        },
        segments: []
      },
      {
        id: `mock-flight-${cityName}-2`,
        price: 380 + Math.floor(Math.random() * 250),
        currency: 'USD',
        duration: 'PT10H45M',
        stops: 1,
        airline: 'DL',
        departure: {
          airport: 'NYC',
          time: '2:15 PM',
          date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
        },
        arrival: {
          airport: cityName.slice(0, 3).toUpperCase(),
          time: '11:00 PM',
          date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
        },
        segments: []
      }
    ]
    
    return flightOptions
  }

  generateHotelsForDestination(destination: string): any[] {
    // Extract city name from destination (e.g., "Paris, France" -> "Paris")
    const cityName = destination.split(',')[0].trim()
    
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

  private getMockHotelData(cityName: string): any[] {
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
      stats[error.service].total++
      if (error.fallbackUsed) {
        stats[error.service].withFallback++
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