/**
 * Real Data Service
 * Orchestrates calls to multiple travel APIs to provide comprehensive destination data
 */

import { restCountriesService } from './restCountriesService'
import { openWeatherService, WeatherForecast } from './openWeatherService'
import { geoapifyService, GeoapifyPlace } from './geoapifyService'
import { amadeusService, SimplifiedFlight, SimplifiedHotel } from './amadeusService'
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
      const lastPart = parts[parts.length - 1]
      if (lastPart) {
        return lastPart.trim()
      }
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
      if (!country) {
        console.warn(`Country data missing for "${actualCountryName}"`)
        return null
      }
      
      const [lat, lon] = country.latlng

      const countryInfo = restCountriesService.formatCountryForDestination(country)
      if (!countryInfo) {
        console.warn(`Failed to format country info for "${actualCountryName}"`)
        return null
      }

      const destination: RealAPIDestination = {
        countryInfo
      }

      // Fetch additional data in parallel
      const promises: Promise<unknown>[] = []

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
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          const value = result.value as { type: string; data: unknown }
          const { type, data } = value

          switch (type) {
            case 'weather':
              if (data) {
                const weatherData = data as { 
                  current: { 
                    temp: number; 
                    feels_like: number; 
                    humidity: number; 
                    weather: { main: string; description: string; icon: string; }; 
                  }; 
                  forecast?: unknown[] 
                }
                destination.weather = {
                  current: weatherData.current,
                  forecast: [] // Will be populated separately if needed
                }
              }
              break

            case 'attractions':
              if (data && Array.isArray(data) && data.length > 0) {
                destination.attractions = data.map((place: unknown) =>
                  geoapifyService.formatPlaceForDisplay(place as GeoapifyPlace)
                )
              }
              break

            case 'flights':
              if (data && Array.isArray(data) && data.length > 0) {
                destination.flights = data
              }
              break

            case 'hotels':
              if (data && Array.isArray(data) && data.length > 0) {
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
      if (trip.hotels && trip.hotels.length > 0) {
        return { hotels: trip.hotels, source: 'mock' as const }
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

    // Add data source messaging for user transparency
    enhanced.dataSourceMessage = this.createDataSourceMessage(enhanced.apiSources, enhanced.hotelDataSource)

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
          mockActivity.name.toLowerCase().includes(activityName?.toLowerCase() || '') ||
          (activityName?.toLowerCase() || '').includes(mockActivity.name.toLowerCase())
        ) || null
      }

      // If no mock match, try to match with real attractions data
      if (!activityDetail && realData?.attractions) {
        const matchingAttraction = realData.attractions.find(attraction =>
          attraction.name.toLowerCase().includes(activityName?.toLowerCase() || '') ||
          (activityName?.toLowerCase() || '').includes(attraction.name.toLowerCase())
        )

        if (matchingAttraction) {
          activityDetail = {
            id: `real-${matchingAttraction.id}`,
            name: matchingAttraction.name,
            type: this.categorizeActivityType(matchingAttraction.categories),
            duration: 4, // Default 4 hours for attractions
            cost: 25, // Default cost estimate
            ageAppropriate: true,
            description: matchingAttraction.description || `Visit ${matchingAttraction.name}, a popular attraction in ${trip.destination}.`
          }
          
          // Only add location if it exists
          if (matchingAttraction.address) {
            activityDetail.location = matchingAttraction.address
          }
        }
      }

      // If still no match, create a generic activity detail WITHOUT generic description
      if (!activityDetail) {
        activityDetail = {
          id: `generic-${i}`,
          name: activityName || 'Activity',
          type: this.inferActivityType(activityName || ''),
          duration: 3, // Default 3 hours
          cost: 20, // Default cost
          ageAppropriate: true,
          description: '' // Empty description - don't show generic "Enjoy..." text
        }
      }

      if (activityDetail) {
        activityDetails.push(activityDetail)
      }
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
            const trip = trips[index]
            if (!trip) {
              throw new Error(`Trip at index ${index} is undefined`)
            }
            console.warn(`Failed to enhance trip "${trip.destination}":`, result.reason)
            return {
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
            } as EnhancedTripRecommendation
          }
        })
      }
    )
  }

  private async getFlightDataForDestination(cityName: string): Promise<SimplifiedFlight[]> {
    return errorHandlingService.getFlightDataWithFallback(
      cityName,
      async (city) => {
        console.log(`🔍 Real Data Service: Attempting to fetch flight data for ${city}`);
        
        // This would require departure airport - simplified for demo
        // In a real implementation, you'd need user's location or selected departure city
        const airports = await amadeusService.getAirportInfo(city)
        if (airports.length === 0) {
          console.warn(`⚠️ No airports found for ${city} - will use fallback data`);
          throw new Error(`No airports found for ${city}`)
        }

        const firstAirport = airports[0]
        if (!firstAirport) {
          throw new Error(`First airport is undefined for ${city}`)
        }

        console.log(`✅ Found ${airports.length} airports for ${city}, using: ${firstAirport.iataCode}`);

        // Mock flight search from a major hub (would be dynamic in real app)
        const destinationCode = firstAirport.iataCode
        const departureDate = new Date()
        departureDate.setDate(departureDate.getDate() + 30) // 30 days from now

        const flights = await amadeusService.searchFlights(
          'NYC', // Mock departure - would be dynamic
          destinationCode,
          departureDate.toISOString().split('T')[0] || departureDate.toISOString().substring(0, 10),
          undefined,
          1,
          5
        )

        if (flights.length === 0) {
          console.warn(`⚠️ No flights found for NYC → ${destinationCode} - will use fallback data`);
          throw new Error(`No flights available for ${city}`)
        }

        console.log(`✅ Found ${flights.length} real flights for ${city}`);
        return flights.map(flight => amadeusService.formatFlightOfferForDisplay(flight))
      }
    )
  }

  private async getHotelDataForDestination(cityName: string): Promise<SimplifiedHotel[]> {
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
          checkIn.toISOString().split('T')[0] || '',
          checkOut.toISOString().split('T')[0] || '',
          2
        )

        return hotels.map(hotel => amadeusService.formatHotelOfferForDisplay(hotel))
      }
    )
  }

  /**
   * Create user-friendly message about data sources for transparency
   */
  private createDataSourceMessage(
    apiSources: {
      countryData: boolean;
      weatherData: boolean;
      attractionsData: boolean;
      flightData: boolean;
      hotelData: boolean;
    },
    hotelDataSource?: 'api' | 'mock' | 'generated'
  ): string {
    const realDataCount = Object.values(apiSources).filter(source => source).length;
    const totalSources = Object.keys(apiSources).length;
    
    if (realDataCount === totalSources) {
      return "All travel data is live and up-to-date from real APIs.";
    }
    
    if (realDataCount === 0) {
      return "Travel data is curated from our comprehensive database.";
    }
    
    // Hybrid scenario - be specific about what's real vs mock
    const realSources: string[] = [];
    const mockSources: string[] = [];
    
    if (apiSources.countryData) realSources.push("country information");
    else mockSources.push("country details");
    
    if (apiSources.weatherData) realSources.push("current weather");
    else mockSources.push("weather estimates");
    
    if (apiSources.attractionsData) realSources.push("attractions");
    else mockSources.push("suggested activities");
    
    if (apiSources.flightData) realSources.push("flight prices");
    else mockSources.push("flight estimates");
    
    if (apiSources.hotelData) realSources.push("hotel availability");
    else {
      if (hotelDataSource === 'generated') mockSources.push("hotel recommendations");
      else mockSources.push("accommodation options");
    }
    
    let message = "";
    if (realSources.length > 0) {
      message += `Live data: ${realSources.join(", ")}. `;
    }
    if (mockSources.length > 0) {
      message += `Curated data: ${mockSources.join(", ")}.`;
    }
    
    return message.trim();
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

  async getWeatherForecast(countryName: string, days: number = 5): Promise<WeatherForecast[]> {
    try {
      const countries = await restCountriesService.getCountryByName(countryName)
      if (!countries || countries.length === 0) {
        return []
      }

      const firstCountry = countries[0]
      if (!firstCountry) {
        return []
      }
      const [lat, lon] = firstCountry.latlng
      return await openWeatherService.getWeatherForecast(lat, lon, days)
    } catch (error) {
      console.error(`Error fetching weather forecast for "${countryName}":`, error)
      return []
    }
  }

  async searchAttractionsByCity(cityName: string, limit: number = 20): Promise<GeoapifyPlace[]> {
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