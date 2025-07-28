/**
 * Error Handling Service
 * Provides centralized error handling and fallback mechanisms for API failures
 */

import { TripRecommendation, EnhancedTripRecommendation } from '@/types/travel'

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

  private createMockEnhancedTrips(trips: TripRecommendation[]): EnhancedTripRecommendation[] {
    return trips.map(trip => ({
      ...trip,
      dataSource: 'mock' as const,
      lastUpdated: new Date(),
      apiSources: {
        countryData: false,
        weatherData: false,
        attractionsData: false,
        flightData: false,
        hotelData: false,
      }
    }))
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