/**
 * Destination Resolution Service
 * Maps user input to real worldwide destinations and enriches with location data
 */

import { restCountriesService } from './restCountriesService'
import { amadeusService } from './amadeusService'

export interface ResolvedDestination {
  id: string
  name: string
  country: string
  region: string
  type: 'city' | 'country' | 'region'
  coordinates?: [number, number] // [longitude, latitude]
  airportCode?: string
  countryInfo?: {
    capital: string
    currency: string
    languages: string[]
    region: string
    subregion: string
  }
  confidence: number // 0-100 confidence score for the match
}

interface DestinationKeyword {
  keywords: string[]
  destination: Omit<ResolvedDestination, 'confidence'>
}

/**
 * Common destination mappings for popular travel destinations
 */
const DESTINATION_MAPPINGS: DestinationKeyword[] = [
  // Mexico destinations
  {
    keywords: ['mexico', 'mexico city', 'cdmx'],
    destination: {
      id: 'mexico-city-mx',
      name: 'Mexico City',
      country: 'Mexico',
      region: 'North America',
      type: 'city',
      coordinates: [-99.1332, 19.4326],
      airportCode: 'MEX'
    }
  },
  {
    keywords: ['cancun', 'riviera maya'],
    destination: {
      id: 'cancun-mx',
      name: 'Cancun',
      country: 'Mexico',
      region: 'North America',
      type: 'city',
      coordinates: [-86.8515, 21.1619],
      airportCode: 'CUN'
    }
  },
  {
    keywords: ['puerto vallarta', 'vallarta'],
    destination: {
      id: 'puerto-vallarta-mx',
      name: 'Puerto Vallarta',
      country: 'Mexico',
      region: 'North America',
      type: 'city',
      coordinates: [-105.2253, 20.6534],
      airportCode: 'PVR'
    }
  },
  {
    keywords: ['playa del carmen', 'playa carmen'],
    destination: {
      id: 'playa-del-carmen-mx',
      name: 'Playa del Carmen',
      country: 'Mexico',
      region: 'North America',
      type: 'city',
      coordinates: [-87.0739, 20.6296]
    }
  },
  {
    keywords: ['tulum'],
    destination: {
      id: 'tulum-mx',
      name: 'Tulum',
      country: 'Mexico',
      region: 'North America',
      type: 'city',
      coordinates: [-87.4653, 20.2085]
    }
  },
  // Europe destinations
  {
    keywords: ['paris', 'france'],
    destination: {
      id: 'paris-fr',
      name: 'Paris',
      country: 'France',
      region: 'Europe',
      type: 'city',
      coordinates: [2.3522, 48.8566],
      airportCode: 'CDG'
    }
  },
  {
    keywords: ['london', 'england', 'uk', 'britain'],
    destination: {
      id: 'london-gb',
      name: 'London',
      country: 'United Kingdom',
      region: 'Europe',
      type: 'city',
      coordinates: [-0.1276, 51.5074],
      airportCode: 'LHR'
    }
  },
  {
    keywords: ['rome', 'italy'],
    destination: {
      id: 'rome-it',
      name: 'Rome',
      country: 'Italy',
      region: 'Europe',
      type: 'city',
      coordinates: [12.4964, 41.9028],
      airportCode: 'FCO'
    }
  },
  {
    keywords: ['barcelona', 'spain'],
    destination: {
      id: 'barcelona-es',
      name: 'Barcelona',
      country: 'Spain',
      region: 'Europe',
      type: 'city',
      coordinates: [2.1734, 41.3851],
      airportCode: 'BCN'
    }
  },
  // Asia destinations
  {
    keywords: ['tokyo', 'japan'],
    destination: {
      id: 'tokyo-jp',
      name: 'Tokyo',
      country: 'Japan',
      region: 'Asia',
      type: 'city',
      coordinates: [139.6917, 35.6895],
      airportCode: 'NRT'
    }
  },
  {
    keywords: ['bangkok', 'thailand'],
    destination: {
      id: 'bangkok-th',
      name: 'Bangkok',
      country: 'Thailand',
      region: 'Asia',
      type: 'city',
      coordinates: [100.5018, 13.7563],
      airportCode: 'BKK'
    }
  },
  {
    keywords: ['singapore'],
    destination: {
      id: 'singapore-sg',
      name: 'Singapore',
      country: 'Singapore',
      region: 'Asia',
      type: 'city',
      coordinates: [103.8198, 1.3521],
      airportCode: 'SIN'
    }
  }
]

class DestinationResolutionService {
  /**
   * Resolve destination from user input text
   */
  async resolveDestination(input: string): Promise<ResolvedDestination[]> {
    const lowerInput = input.toLowerCase()
    const resolvedDestinations: ResolvedDestination[] = []

    // 1. Try exact keyword matching first
    const keywordMatches = this.findKeywordMatches(lowerInput)
    for (const match of keywordMatches) {
      const enriched = await this.enrichDestinationWithCountryData(match)
      resolvedDestinations.push(enriched)
    }

    // 2. If no keyword matches, try country-based resolution
    if (resolvedDestinations.length === 0) {
      const countryMatches = await this.findCountryMatches(lowerInput)
      resolvedDestinations.push(...countryMatches)
    }

    // 3. Remove duplicates and sort by confidence
    const uniqueDestinations = this.deduplicateDestinations(resolvedDestinations)
    return uniqueDestinations.sort((a, b) => b.confidence - a.confidence)
  }

  /**
   * Find destinations by exact keyword matching
   */
  private findKeywordMatches(input: string): ResolvedDestination[] {
    const matches: ResolvedDestination[] = []

    for (const mapping of DESTINATION_MAPPINGS) {
      for (const keyword of mapping.keywords) {
        if (input.includes(keyword)) {
          const confidence = this.calculateKeywordConfidence(keyword, input)
          matches.push({
            ...mapping.destination,
            confidence
          })
          break // Only add once per mapping
        }
      }
    }

    return matches
  }

  /**
   * Find destinations by country name matching
   */
  private async findCountryMatches(input: string): Promise<ResolvedDestination[]> {
    try {
      // Extract potential country names from input
      const words = input.split(/\s+/).filter(word => word.length > 2)
      const matches: ResolvedDestination[] = []

      for (const word of words) {
        try {
          const countries = await restCountriesService.getCountryByName(word)
          for (const country of countries) {
            const confidence = this.calculateCountryConfidence(word, country.name.common)
            if (confidence > 60) { // Only include high-confidence matches
              matches.push({
                id: `${country.name.common.toLowerCase().replace(/\s+/g, '-')}-country`,
                name: country.name.common,
                country: country.name.common,
                region: country.region,
                type: 'country',
                coordinates: country.latlng ? [country.latlng[1], country.latlng[0]] : [0, 0],
                countryInfo: {
                  capital: country.capital?.[0] || 'N/A',
                  currency: Object.keys(country.currencies || {})[0] || 'N/A',
                  languages: Object.values(country.languages || {}),
                  region: country.region,
                  subregion: country.subregion || ''
                },
                confidence
              })
            }
          }
        } catch {
          // Ignore individual country lookup errors
          console.warn(`Could not find country data for: ${word}`)
        }
      }

      return matches
    } catch (error) {
      console.error('Error finding country matches:', error)
      return []
    }
  }

  /**
   * Enrich destination with country data from REST Countries API
   */
  private async enrichDestinationWithCountryData(destination: ResolvedDestination): Promise<ResolvedDestination> {
    if (destination.countryInfo) {
      return destination
    }

    try {
      const countries = await restCountriesService.getCountryByName(destination.country)
      if (countries.length > 0) {
        const country = countries[0]
        if (!country) return destination
        return {
          ...destination,
          countryInfo: {
            capital: country.capital?.[0] || 'N/A',
            currency: Object.keys(country.currencies || {})[0] || 'N/A',
            languages: Object.values(country.languages || {}),
            region: country.region,
            subregion: country.subregion || ''
          }
        }
      }
    } catch (error) {
      console.warn(`Could not enrich destination ${destination.name} with country data:`, error)
    }

    return destination
  }

  /**
   * Calculate confidence score for keyword matches
   */
  private calculateKeywordConfidence(keyword: string, input: string): number {
    const exactMatch = input === keyword
    const wordBoundaryMatch = new RegExp(`\\b${keyword}\\b`).test(input)
    const containsMatch = input.includes(keyword)

    if (exactMatch) return 100
    if (wordBoundaryMatch) return 90
    if (containsMatch) return 75
    return 0
  }

  /**
   * Calculate confidence score for country matches
   */
  private calculateCountryConfidence(searchTerm: string, countryName: string): number {
    const lowerSearch = searchTerm.toLowerCase()
    const lowerCountry = countryName.toLowerCase()

    if (lowerSearch === lowerCountry) return 100
    if (lowerCountry.includes(lowerSearch)) return 85
    if (lowerSearch.includes(lowerCountry)) return 80

    // Fuzzy matching for similar names
    const similarity = this.calculateStringSimilarity(lowerSearch, lowerCountry)
    return Math.floor(similarity * 100)
  }

  /**
   * Simple string similarity calculation
   */
  private calculateStringSimilarity(a: string, b: string): number {
    const longer = a.length > b.length ? a : b
    const shorter = a.length > b.length ? b : a
    
    if (longer.length === 0) return 1.0
    
    const editDistance = this.getEditDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  /**
   * Calculate edit distance between two strings
   */
  private getEditDistance(a: string, b: string): number {
    const matrix: number[][] = []

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = []
    }

    for (let i = 0; i <= b.length; i++) {
      matrix[i]![0] = i
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0]![j] = j
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const prev = matrix[i - 1]?.[j - 1] ?? 0
        const del = matrix[i - 1]?.[j] ?? 0
        const ins = matrix[i]?.[j - 1] ?? 0
        
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i]![j] = prev
        } else {
          matrix[i]![j] = Math.min(
            prev + 1,
            ins + 1,
            del + 1
          )
        }
      }
    }

    return matrix[b.length]?.[a.length] ?? 0
  }

  /**
   * Remove duplicate destinations based on ID and name similarity
   */
  private deduplicateDestinations(destinations: ResolvedDestination[]): ResolvedDestination[] {
    const seen = new Set<string>()
    const unique: ResolvedDestination[] = []

    for (const dest of destinations) {
      const key = `${dest.name.toLowerCase()}-${dest.country.toLowerCase()}`
      if (!seen.has(key)) {
        seen.add(key)
        unique.push(dest)
      }
    }

    return unique
  }

  /**
   * Get airport information for a destination using Amadeus API
   */
  async getAirportInfo(destination: ResolvedDestination): Promise<string | undefined> {
    if (destination.airportCode) {
      return destination.airportCode
    }

    try {
      const airports = await amadeusService.getAirportInfo(destination.name)
      if (airports.length > 0 && airports[0]) {
        return airports[0].iataCode
      }
    } catch (error) {
      console.warn(`Could not get airport info for ${destination.name}:`, error)
    }

    return undefined
  }

  /**
   * Get multiple destination suggestions for a given input
   */
  async getDestinationSuggestions(input: string, limit: number = 5): Promise<ResolvedDestination[]> {
    const resolved = await this.resolveDestination(input)
    return resolved.slice(0, limit)
  }
}

export const destinationResolutionService = new DestinationResolutionService()