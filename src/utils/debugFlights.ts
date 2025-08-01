/**
 * Debug utilities for flight data testing
 * Use in browser console or during development
 */

import { amadeusService } from '@/services/amadeusService'
import { realDataService } from '@/services/realDataService'
import { errorHandlingService } from '@/services/errorHandlingService'

export const debugFlights = {
  /**
   * Check Amadeus API status and connectivity
   */
  async checkAPIStatus() {
    console.log('🔍 Checking Amadeus API status...')
    try {
      const status = await amadeusService.getApiStatus()
      console.log('📊 API Status:', status)
      return status
    } catch (error) {
      console.error('❌ API Status check failed:', error)
      return null
    }
  },

  /**
   * Test flight search for a specific destination
   */
  async testFlightSearch(cityName: string = 'Dublin') {
    console.log(`🧪 Testing flight search for ${cityName}...`)
    try {
      const result = await amadeusService.testDublinFlights()
      console.log('🇮🇪 Flight Test Result:', result)
      return result
    } catch (error) {
      console.error('❌ Flight test failed:', error)
      return null
    }
  },

  /**
   * Test the fallback system for flight data
   */
  async testFallbackSystem(cityName: string = 'Unknown City') {
    console.log(`🔄 Testing fallback system for ${cityName}...`)
    try {
      // This should force fallback to mock data
      const mockFlights = errorHandlingService.getFlightDataWithFallback(
        cityName,
        async () => {
          throw new Error('Simulated API failure')
        }
      )
      console.log(`✅ Fallback flights for ${cityName}:`, await mockFlights)
      return mockFlights
    } catch (error) {
      console.error('❌ Fallback test failed:', error)
      return null
    }
  },

  /**
   * Test complete trip enhancement with flight data
   */
  async testTripEnhancement(destination: string = 'Dublin, Ireland') {
    console.log(`🎯 Testing trip enhancement for ${destination}...`)
    try {
      const enhanced = await realDataService.enhanceTripRecommendation({
        tripId: 'debug-001',
        destination,
        duration: 5,
        estimatedCost: 2500,
        highlights: ['Historic sites', 'Local culture'],
        description: `A wonderful trip to ${destination} with rich history and vibrant culture.`,
        activities: ['City walking tour', 'Museum visits', 'Local dining'],
        season: 'spring',
        kidFriendly: true,
        customizations: {},
        score: 88,
        type: 'single'
      }, {
        includeFlights: true,
        includeHotels: true,
        includeWeather: true,
        includeAttractions: true
      })

      console.log(`✅ Enhanced trip for ${destination}:`)
      console.log(`  📊 Data Source: ${enhanced.dataSource}`)
      console.log(`  ✈️ Flight Data: ${enhanced.apiSources.flightData ? 'Real API' : 'Fallback'} (${enhanced.realData?.flights?.length || 0} flights)`)
      console.log(`  🏨 Hotel Data: ${enhanced.hotelDataSource} (${enhanced.realData?.hotels?.length || 0} hotels)`)
      console.log(`  🌤️ Weather Data: ${enhanced.apiSources.weatherData ? 'Real API' : 'Fallback'}`)
      console.log(`  💬 User Message: ${enhanced.dataSourceMessage}`)
      
      if (enhanced.realData?.flights) {
        enhanced.realData.flights.slice(0, 2).forEach((flight, i) => {
          console.log(`    Flight ${i + 1}: ${flight.airline} - $${flight.price} - ${flight.duration}`)
        })
      }

      return enhanced
    } catch (error) {
      console.error('❌ Trip enhancement test failed:', error)
      return null
    }
  },

  /**
   * Run all flight-related tests
   */
  async runAllTests() {
    console.log('🚀 Running comprehensive flight data tests...\n')
    
    const results = {
      apiStatus: await this.checkAPIStatus(),
      flightSearch: await this.testFlightSearch(),
      fallbackSystem: await this.testFallbackSystem(),
      dublinTrip: await this.testTripEnhancement('Dublin, Ireland'),
      tokyoTrip: await this.testTripEnhancement('Tokyo, Japan'),
      unknownTrip: await this.testTripEnhancement('Unknown City, Nowhere')
    }

    console.log('\n📋 Test Summary:')
    console.log(`  API Status: ${results.apiStatus?.authenticated ? '✅' : '❌'}`)
    console.log(`  Flight Search: ${results.flightSearch?.success ? '✅' : '❌'}`)
    console.log(`  Fallback System: ${results.fallbackSystem ? '✅' : '❌'}`)
    console.log(`  Dublin Enhancement: ${results.dublinTrip ? '✅' : '❌'}`)
    console.log(`  Tokyo Enhancement: ${results.tokyoTrip ? '✅' : '❌'}`)
    console.log(`  Unknown City Enhancement: ${results.unknownTrip ? '✅' : '❌'}`)

    return results
  }
}

// Make available globally in development
if (typeof window !== 'undefined') {
  (window as typeof window & { debugFlights: typeof debugFlights }).debugFlights = debugFlights
  console.log('🔧 Debug utilities available: window.debugFlights')
  console.log('💡 Try: debugFlights.runAllTests()')
}