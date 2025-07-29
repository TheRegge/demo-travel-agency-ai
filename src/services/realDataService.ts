/**
 * Real Data Service
 * Orchestrates calls to multiple travel APIs to provide comprehensive destination data
 */

import { restCountriesService, Country } from './restCountriesService'
import { openWeatherService, WeatherData } from './openWeatherService'
import { geoapifyService, GeoapifyPlace } from './geoapifyService'
import { amadeusService, AmadeusFlightOffer, AmadeusHotelOffer } from './amadeusService'
import { errorHandlingService } from './errorHandlingService'
import { RealAPIDestination, EnhancedTripRecommendation, TripRecommendation, Activity } from '@/types/travel'
import { mockDestinations } from '@/lib/mock-data/destinations'

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
    // Normalize destination name before API calls
    const normalizedDestination = this.normalizeDestinationName(trip.destination)
    const realData = await this.getDestinationData(normalizedDestination, options)

    // Ensure we always have hotel data - prioritize real data, then trip data, then generate
    const ensureHotels = () => {
      if (realData?.hotels && realData.hotels.length > 0) {
        return { hotels: realData.hotels, source: 'api' as const }
      }
      if ((trip as any).hotels && (trip as any).hotels.length > 0) {
        return { hotels: (trip as any).hotels, source: 'mock' as const }
      }
      // Generate hotels if none found
      return { hotels: errorHandlingService.generateHotelsForDestination(normalizedDestination), source: 'generated' as const }
    }

    const hotelResult = ensureHotels()

    const enhanced: EnhancedTripRecommendation = {
      ...trip,
      realData: realData ? {
        ...realData,
        hotels: hotelResult.hotels // Always ensure hotels are present
      } : {
        countryInfo: {
          name: normalizedDestination.split(',')[0] || 'Unknown',
          capital: normalizedDestination.split(',')[0] || 'Unknown',
          region: 'Unknown',
          currency: 'USD',
          languages: ['Local Language'],
          timezone: 'UTC+0',
          coordinates: [0, 0] as [number, number],
          flag: ''
        },
        hotels: hotelResult.hotels
      },
      dataSource: realData ? 'hybrid' : 'mock',
      lastUpdated: new Date(),
      apiSources: {
        countryData: !!realData?.countryInfo,
        weatherData: !!realData?.weather,
        attractionsData: !!realData?.attractions && realData.attractions.length > 0,
        flightData: !!realData?.flights && realData.flights.length > 0,
        hotelData: hotelResult.source === 'api', // Only true for real API data
      },
      // Add hotel data source for accurate labeling
      hotelDataSource: hotelResult.source
    }

    // Enhance description with real data if available
    if (realData) {
      enhanced.description = this.enhanceDescriptionWithRealData(trip.description, realData)
    }

    // Populate activityDetails with rich activity objects
    enhanced.activityDetails = await this.createActivityDetails(trip, realData)

    return enhanced
  }

  /**
   * Create rich activity details from trip activities and real data
   */
  private async createActivityDetails(
    trip: TripRecommendation, 
    realData: RealAPIDestination | null
  ): Promise<Activity[]> {
    const activityDetails: Activity[] = []

    // First, try to match activities with mock destination data
    const mockDestination = mockDestinations.find(dest => 
      dest.name.toLowerCase().includes(trip.destination.toLowerCase()) ||
      trip.destination.toLowerCase().includes(dest.name.toLowerCase())
    )

    for (let i = 0; i < trip.activities.length; i++) {
      const activityName = trip.activities[i]
      let activityDetail: Activity | null = null

      // Try to match with mock destination activities first
      if (mockDestination) {
        activityDetail = mockDestination.activities.find(mockActivity =>
          mockActivity.name.toLowerCase().includes(activityName.toLowerCase()) ||
          activityName.toLowerCase().includes(mockActivity.name.toLowerCase())
        ) || null
      }

      // If no mock match, try to match with real attractions data
      if (!activityDetail && realData?.attractions) {
        const matchingAttraction = realData.attractions.find(attraction =>
          attraction.name.toLowerCase().includes(activityName.toLowerCase()) ||
          activityName.toLowerCase().includes(attraction.name.toLowerCase())
        )

        if (matchingAttraction) {
          activityDetail = {
            id: `real-${matchingAttraction.id}`,
            name: matchingAttraction.name,
            type: this.categorizeActivityType(matchingAttraction.categories),
            duration: 4, // Default 4 hours for attractions
            cost: 25, // Default cost estimate
            ageAppropriate: true,
            description: matchingAttraction.description || `Visit ${matchingAttraction.name}, a popular attraction in ${trip.destination}.`,
            location: matchingAttraction.address
          }
        }
      }

      // If still no match, create a generic activity detail WITHOUT generic description
      if (!activityDetail) {
        activityDetail = {
          id: `generic-${i}`,
          name: activityName,
          type: this.inferActivityType(activityName),
          duration: 3, // Default 3 hours
          cost: 20, // Default cost
          ageAppropriate: true,
          description: '' // Empty description - don't show generic "Enjoy..." text
        }
      }

      activityDetails.push(activityDetail)
    }

    return activityDetails
  }

  /**
   * Categorize Geoapify attraction categories to our activity types
   */
  private categorizeActivityType(categories: string[]): Activity['type'] {
    const categoryLower = categories.join(' ').toLowerCase()
    
    if (categoryLower.includes('restaurant') || categoryLower.includes('food') || categoryLower.includes('cafe')) {
      return 'dining'
    }
    if (categoryLower.includes('museum') || categoryLower.includes('historical') || categoryLower.includes('cultural')) {
      return 'cultural'
    }
    if (categoryLower.includes('adventure') || categoryLower.includes('sport') || categoryLower.includes('outdoor')) {
      return 'adventure'
    }
    if (categoryLower.includes('spa') || categoryLower.includes('wellness') || categoryLower.includes('beach')) {
      return 'relaxation'
    }
    
    return 'attraction' // Default
  }

  /**
   * Infer activity type from activity name
   */
  private inferActivityType(activityName: string): Activity['type'] {
    const nameLower = activityName.toLowerCase()
    
    if (nameLower.includes('dining') || nameLower.includes('restaurant') || nameLower.includes('food') || nameLower.includes('cuisine')) {
      return 'dining'
    }
    if (nameLower.includes('museum') || nameLower.includes('history') || nameLower.includes('culture') || nameLower.includes('art')) {
      return 'cultural'
    }
    if (nameLower.includes('hiking') || nameLower.includes('adventure') || nameLower.includes('climbing') || nameLower.includes('rafting')) {
      return 'adventure'
    }
    if (nameLower.includes('spa') || nameLower.includes('relax') || nameLower.includes('beach') || nameLower.includes('wellness')) {
      return 'relaxation'
    }
    
    return 'attraction' // Default
  }

  private normalizeDestinationName(destination: string): string {
    // Remove parenthetical descriptions like "(Budget-Friendly)"
    let normalized = destination.replace(/\s*\([^)]*\)/g, '')
    
    // Remove extra descriptive text
    normalized = normalized.replace(/\s*-\s*(Budget-Friendly|Luxury|Premium|etc\.?)$/i, '')
    
    // Clean up extra spaces
    normalized = normalized.replace(/\s+/g, ' ').trim()
    
    // Handle specific problematic cases
    if (normalized.toLowerCase() === 'capital city') {
      return 'Paris, France' // Default fallback
    }
    
    return normalized
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
    return errorHandlingService.getFlightDataWithFallback(
      cityName,
      async (city) => {
        // This would require departure airport - simplified for demo
        // In a real implementation, you'd need user's location or selected departure city
        const airports = await amadeusService.getAirportInfo(city)
        if (airports.length === 0) {
          throw new Error(`No airports found for ${city}`)
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
      }
    )
  }

  private async getHotelDataForDestination(cityName: string): Promise<any[]> {
    return errorHandlingService.getHotelDataWithFallback(
      cityName,
      async (city) => {
        // Resolve city name to proper IATA city code
        const cityCode = amadeusService.resolveCityCode(city)
        if (!cityCode) {
          throw new Error(`No city code mapping found for "${city}"`)
        }

        const checkIn = new Date()
        checkIn.setDate(checkIn.getDate() + 30)
        const checkOut = new Date(checkIn)
        checkOut.setDate(checkOut.getDate() + 3)

        console.log(`Searching hotels for ${city} (${cityCode})`)
        const hotels = await amadeusService.searchHotels(
          cityCode,
          checkIn.toISOString().split('T')[0],
          checkOut.toISOString().split('T')[0],
          2
        )

        return hotels.map(hotel => amadeusService.formatHotelOfferForDisplay(hotel))
      }
    )
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