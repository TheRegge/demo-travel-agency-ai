/**
 * Real Data Service
 * Orchestrates calls to multiple travel APIs to provide comprehensive destination data
 */

import { restCountriesService, Country } from './restCountriesService'
import { openWeatherService, WeatherData } from './openWeatherService'
import { geoapifyService, GeoapifyPlace } from './geoapifyService'
import { amadeusService, AmadeusFlightOffer, AmadeusHotelOffer } from './amadeusService'
import { errorHandlingService } from './errorHandlingService'
import { RealAPIDestination, EnhancedTripRecommendation, TripRecommendation } from '@/types/travel'

export interface RealDataServiceOptions {
  includeWeather?: boolean
  includeAttractions?: boolean
  includeFlights?: boolean
  includeHotels?: boolean
  maxAttractions?: number
  maxFlights?: number
  maxHotels?: number
}

class RealDataService {
  private extractCountryFromDestination(destination: string): string {
    // Handle cases like "Rome, Italy" -> "Italy", "Paris, France" -> "France"
    const parts = destination.split(',')
    if (parts.length > 1) {
      return parts[parts.length - 1].trim()
    }
    
    // Handle cases like "Southern Italy" -> "Italy"
    const countryMappings: { [key: string]: string } = {
      'southern italy': 'Italy',
      'northern italy': 'Italy',
      'eastern europe': 'Poland', // Default to a representative country
      'western europe': 'France',
      'southern france': 'France',
      'northern france': 'France',
      'southern spain': 'Spain',
      'northern spain': 'Spain',
      'southern germany': 'Germany',
      'northern germany': 'Germany'
    }
    
    const lowerDest = destination.toLowerCase()
    for (const [pattern, country] of Object.entries(countryMappings)) {
      if (lowerDest.includes(pattern)) {
        return country
      }
    }
    
    // If no mapping found, return as-is
    return destination
  }

  async getDestinationData(
    countryName: string,
    options: RealDataServiceOptions = {}
  ): Promise<RealAPIDestination | null> {
    const {
      includeWeather = true,
      includeAttractions = true,
      includeFlights = false,
      includeHotels = false,
      maxAttractions = 10,
      maxFlights = 5,
      maxHotels = 5,
    } = options

    try {
      // Extract actual country name from destination
      const actualCountryName = this.extractCountryFromDestination(countryName)
      console.log(`🌍 Destination parsing: "${countryName}" -> "${actualCountryName}"`)
      
      // Get country information (always required) with error handling
      const countries = await errorHandlingService.getCountryDataWithFallback(
        actualCountryName,
        (name) => restCountriesService.getCountryByName(name)
      )
      
      if (!countries || countries.length === 0) {
        console.warn(`Country "${actualCountryName}" not found`)
        return null
      }

      const country = countries[0]
      const [lat, lon] = country.latlng

      const destination: RealAPIDestination = {
        countryInfo: restCountriesService.formatCountryForDestination(country)
      }

      // Fetch additional data in parallel
      const promises: Promise<any>[] = []

      if (includeWeather) {
        promises.push(
          errorHandlingService.getWeatherDataWithFallback(
            lat, lon,
            (lat, lon) => openWeatherService.getCurrentWeather(lat, lon)
          ).then(weather => ({ type: 'weather', data: weather }))
        )
      }

      if (includeAttractions) {
        promises.push(
          errorHandlingService.getAttractionsWithFallback(
            lat, lon,
            (lat, lon) => geoapifyService.getPlacesByRadius(lat, lon, 50000, maxAttractions, geoapifyService.getTouristAttractionCategories())
          ).then(places => ({ type: 'attractions', data: places }))
        )
      }

      if (includeFlights && country.capital?.[0]) {
        promises.push(
          this.getFlightDataForDestination(country.capital[0])
            .then(flights => ({ type: 'flights', data: flights }))
        )
      }

      if (includeHotels && country.capital?.[0]) {
        promises.push(
          this.getHotelDataForDestination(country.capital[0])
            .then(hotels => ({ type: 'hotels', data: hotels }))
        )
      }

      // Wait for all data to be fetched
      const results = await Promise.allSettled(promises)

      // Process results
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          const { type, data } = result.value

          switch (type) {
            case 'weather':
              if (data) {
                destination.weather = {
                  current: data.current,
                  forecast: [] // Will be populated separately if needed
                }
              }
              break

            case 'attractions':
              if (data && data.length > 0) {
                destination.attractions = data.map((place: GeoapifyPlace) =>
                  geoapifyService.formatPlaceForDisplay(place)
                )
              }
              break

            case 'flights':
              if (data && data.length > 0) {
                destination.flights = data
              }
              break

            case 'hotels':
              if (data && data.length > 0) {
                destination.hotels = data
              }
              break
          }
        }
      })

      return destination

    } catch (error) {
      console.error(`Error fetching destination data for "${countryName}":`, error)
      return null
    }
  }

  async enhanceTripRecommendation(
    trip: TripRecommendation,
    options: RealDataServiceOptions = {}
  ): Promise<EnhancedTripRecommendation> {
    const realData = await this.getDestinationData(trip.destination, options)

    const enhanced: EnhancedTripRecommendation = {
      ...trip,
      realData: realData || undefined,
      dataSource: realData ? 'hybrid' : 'mock',
      lastUpdated: new Date(),
      apiSources: {
        countryData: !!realData?.countryInfo,
        weatherData: !!realData?.weather,
        attractionsData: !!realData?.attractions && realData.attractions.length > 0,
        flightData: !!realData?.flights && realData.flights.length > 0,
        hotelData: !!realData?.hotels && realData.hotels.length > 0,
      }
    }

    // Enhance description with real data if available
    if (realData) {
      enhanced.description = this.enhanceDescriptionWithRealData(trip.description, realData)
    }

    return enhanced
  }

  async enhanceMultipleTrips(
    trips: TripRecommendation[],
    options: RealDataServiceOptions = {}
  ): Promise<EnhancedTripRecommendation[]> {
    return errorHandlingService.enhanceTripsWithFallback(
      trips,
      async (trips) => {
        const enhancePromises = trips.map(trip => 
          this.enhanceTripRecommendation(trip, options)
        )

        const results = await Promise.allSettled(enhancePromises)

        return results.map((result, index) => {
          if (result.status === 'fulfilled') {
            return result.value
          } else {
            // Fallback to mock data if enhancement fails
            console.warn(`Failed to enhance trip "${trips[index].destination}":`, result.reason)
            return {
              ...trips[index],
              dataSource: 'mock' as const,
              lastUpdated: new Date(),
              apiSources: {
                countryData: false,
                weatherData: false,
                attractionsData: false,
                flightData: false,
                hotelData: false,
              }
            }
          }
        })
      }
    )
  }

  private async getFlightDataForDestination(cityName: string): Promise<any[]> {
    try {
      // This would require departure airport - simplified for demo
      // In a real implementation, you'd need user's location or selected departure city
      const airports = await amadeusService.getAirportInfo(cityName)
      if (airports.length === 0) {
        return []
      }

      // Mock flight search from a major hub (would be dynamic in real app)
      const destinationCode = airports[0].iataCode
      const departureDate = new Date()
      departureDate.setDate(departureDate.getDate() + 30) // 30 days from now

      const flights = await amadeusService.searchFlights(
        'NYC', // Mock departure - would be dynamic
        destinationCode,
        departureDate.toISOString().split('T')[0],
        undefined,
        1,
        5
      )

      return flights.map(flight => amadeusService.formatFlightOfferForDisplay(flight))
    } catch (error) {
      console.error('Error fetching flight data:', error)
      return []
    }
  }

  private async getHotelDataForDestination(cityName: string): Promise<any[]> {
    try {
      // Get city code for hotels - simplified approach
      const checkIn = new Date()
      checkIn.setDate(checkIn.getDate() + 30)
      const checkOut = new Date(checkIn)
      checkOut.setDate(checkOut.getDate() + 3)

      // This would need proper city code mapping in a real implementation
      const hotels = await amadeusService.searchHotels(
        cityName.substring(0, 3).toUpperCase(), // Simplified city code
        checkIn.toISOString().split('T')[0],
        checkOut.toISOString().split('T')[0],
        2
      )

      return hotels.map(hotel => amadeusService.formatHotelOfferForDisplay(hotel))
    } catch (error) {
      console.error('Error fetching hotel data:', error)
      return []
    }
  }

  private enhanceDescriptionWithRealData(
    originalDescription: string,
    realData: RealAPIDestination
  ): string {
    let enhanced = originalDescription

    // Add weather information if available
    if (realData.weather?.current) {
      const weather = realData.weather.current
      enhanced += ` Currently experiencing ${weather.weather.description} with temperatures around ${weather.temp}°F.`
    }

    // Add currency information
    if (realData.countryInfo.currency && realData.countryInfo.currency !== 'N/A') {
      enhanced += ` The local currency is ${realData.countryInfo.currency}.`
    }

    // Add language information
    if (realData.countryInfo.languages.length > 0) {
      const languages = realData.countryInfo.languages.slice(0, 2).join(' and ')
      enhanced += ` ${languages} ${realData.countryInfo.languages.length > 1 ? 'are' : 'is'} commonly spoken.`
    }

    return enhanced
  }

  async getWeatherForecast(countryName: string, days: number = 5): Promise<any[]> {
    try {
      const countries = await restCountriesService.getCountryByName(countryName)
      if (!countries || countries.length === 0) {
        return []
      }

      const [lat, lon] = countries[0].latlng
      return await openWeatherService.getWeatherForecast(lat, lon, days)
    } catch (error) {
      console.error(`Error fetching weather forecast for "${countryName}":`, error)
      return []
    }
  }

  async searchAttractionsByCity(cityName: string, limit: number = 20): Promise<any[]> {
    try {
      return await geoapifyService.getTopAttractionsForCity(cityName, limit)
    } catch (error) {
      console.error(`Error searching attractions for "${cityName}":`, error)
      return []
    }
  }


  getApiStatus(): { [key: string]: boolean } {
    return {
      restCountries: true, // Always available (no API key required)
      openWeather: !!process.env.OPENWEATHER_API_KEY,
      geoapify: !!process.env.GEOAPIFY_API_KEY,
      amadeus: !!(process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET),
    }
  }
}

export const realDataService = new RealDataService()