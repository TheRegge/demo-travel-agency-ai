/**
 * Amadeus API Service
 * Provides flight and hotel data through Amadeus Self-Service APIs
 * Free tier: 200-10,000 requests/month depending on API
 */

import { apiUsageService } from './apiUsageService'

export interface AmadeusFlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  lastTicketingDateTime: string;
  numberOfBookableSeats: number;
  itineraries: FlightItinerary[];
  price: {
    currency: string;
    total: string;
    base: string;
    fees: AmadeusFee[];
    grandTotal: string;
  };
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}

export interface FlightItinerary {
  duration: string;
  segments: FlightSegment[];
}

export interface FlightSegment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
  };
  operating?: {
    carrierCode: string;
  };
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: {
    currency: string;
    total: string;
    base: string;
  };
  fareDetailsBySegment: FareDetails[];
}

export interface FareDetails {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  class: string;
  includedCheckedBags: {
    weight?: number;
    weightUnit?: string;
  };
}

export interface AmadeusFee {
  amount: string;
  type: string;
}

export interface AmadeusHotelOffer {
  type: string;
  hotel: {
    type: string;
    hotelId: string;
    chainCode: string;
    dupeId: string;
    name: string;
    rating?: string;
    cityCode: string;
    latitude: number;
    longitude: number;
    hotelDistance?: {
      distance: number;
      distanceUnit: string;
    };
    address: {
      lines: string[];
      postalCode: string;
      cityName: string;
      countryCode: string;
    };
    contact?: {
      phone: string;
      fax?: string;
      email?: string;
    };
    amenities?: string[];
  };
  available: boolean;
  offers: HotelRoomOffer[];
  self?: string;
}

export interface HotelRoomOffer {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  rateCode: string;
  rateFamilyEstimated?: {
    code: string;
    type: string;
  };
  category: string;
  description?: {
    text: string;
    lang: string;
  };
  commission?: {
    percentage: string;
  };
  boardType?: string;
  room: {
    type: string;
    typeEstimated?: {
      category: string;
      beds: number;
      bedType: string;
    };
    description?: {
      text: string;
      lang: string;
    };
  };
  guests: {
    adults: number;
    childAges?: number[];
  };
  price: {
    currency: string;
    base: string;
    total: string;
    variations?: {
      average: {
        base: string;
      };
      changes: PriceVariation[];
    };
  };
  policies?: {
    paymentType: string;
    cancellation?: {
      type: string;
      amount?: string;
      deadline?: string;
    };
  };
  self?: string;
}

export interface PriceVariation {
  startDate: string;
  endDate: string;
  base: string;
}

export interface AirportInfo {
  type: string;
  subType: string;
  name: string;
  detailedName: string;
  id: string;
  self: {
    href: string;
    methods: string[];
  };
  timeZoneOffset: string;
  iataCode: string;
  geoCode: {
    latitude: number;
    longitude: number;
  };
  address: {
    cityName: string;
    cityCode: string;
    countryName: string;
    countryCode: string;
    regionCode: string;
  };
  analytics: {
    travelers: {
      score: number;
    };
  };
}

export interface FlightSegmentDetails {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  carrierCode: string;
  number: string;
  aircraft?: {
    code: string;
  };
  operating?: {
    carrierCode: string;
  };
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

export interface SimplifiedFlight {
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
  segments: FlightSegmentDetails[];
}

export interface SimplifiedHotel {
  id: string;
  name: string;
  rating?: string;
  address: string;
  coordinates: [number, number];
  minPrice: number;
  currency: string;
  offers: HotelRoomOffer[];
  amenities?: string[];
}

class AmadeusService {
  private readonly baseUrl = 'https://test.api.amadeus.com/v2';
  private readonly apiKey = process.env.AMADEUS_API_KEY;
  private readonly apiSecret = process.env.AMADEUS_API_SECRET;
  private accessToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  constructor() {
    if (!this.apiKey || !this.apiSecret) {
      console.warn('Amadeus API credentials not found. Flight and hotel data will not be available.');
    }
  }

  private async withRateLimitHandling(
    apiCall: () => Promise<Response>,
    retryAttempts: number = 3
  ): Promise<Response> {
    let lastError: Error | null = null
    const startTime = Date.now()

    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        const response = await apiCall()
        const responseTime = Date.now() - startTime
        
        // If successful, return immediately
        if (response.ok) {
          apiUsageService.recordAPICall('amadeus', responseTime, false)
          return response
        }
        
        // Handle rate limiting specifically
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After')
          const delay = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 1000
          
          console.warn(`Amadeus API rate limit hit (429). Attempt ${attempt}/${retryAttempts}. Waiting ${delay}ms`)
          
          if (attempt < retryAttempts) {
            await this.delay(delay)
            continue
          }
        }
        
        // For other HTTP errors, throw immediately
        throw new Error(`Amadeus API error: ${response.status}`)
        
      } catch (error) {
        lastError = error as Error
        
        // For network errors, use exponential backoff
        if (attempt < retryAttempts) {
          const delay = Math.pow(2, attempt) * 1000
          console.warn(`Amadeus API network error. Attempt ${attempt}/${retryAttempts}. Waiting ${delay}ms`)
          await this.delay(delay)
        }
      }
    }

    // Record the failed API call
    const responseTime = Date.now() - startTime
    apiUsageService.recordAPICall('amadeus', responseTime, true)
    
    throw lastError || new Error('Amadeus API request failed after all retries')
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async getAccessToken(): Promise<string | null> {
    if (!this.apiKey || !this.apiSecret) {
      return null;
    }

    // Check if token is still valid
    if (this.accessToken && this.tokenExpiresAt && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    try {
      const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.apiKey,
          client_secret: this.apiSecret,
        }),
      });

      if (!response.ok) {
        throw new Error(`Amadeus auth error: ${response.status}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiresAt = Date.now() + (data.expires_in * 1000) - 60000; // Subtract 1 minute for safety

      return this.accessToken;
    } catch (error) {
      console.error('Error getting Amadeus access token:', error);
      return null;
    }
  }

  async searchFlights(
    originCode: string,
    destinationCode: string,
    departureDate: string,
    returnDate?: string,
    adults: number = 1,
    max: number = 10
  ): Promise<AmadeusFlightOffer[]> {
    const token = await this.getAccessToken();
    if (!token) {
      return [];
    }

    try {
      const params = new URLSearchParams({
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate,
        adults: adults.toString(),
        max: max.toString(),
        currencyCode: 'USD'
      });

      if (returnDate) {
        params.append('returnDate', returnDate);
      }

      const response = await this.withRateLimitHandling(() => 
        fetch(`${this.baseUrl}/shopping/flight-offers?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      );

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error searching flights:', error);
      return [];
    }
  }

  async searchHotels(
    cityCode: string,
    checkInDate: string,
    checkOutDate: string,
    adults: number = 1,
    radius: number = 5,
    radiusUnit: 'KM' | 'MILE' = 'KM'
  ): Promise<AmadeusHotelOffer[]> {
    const token = await this.getAccessToken();
    if (!token) {
      return [];
    }

    try {
      const params = new URLSearchParams({
        cityCode,
        checkInDate,
        checkOutDate,
        adults: adults.toString(),
        radius: radius.toString(),
        radiusUnit,
        currency: 'USD'
      });

      const response = await this.withRateLimitHandling(() =>
        fetch(`${this.baseUrl}/shopping/hotel-offers?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      );

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error searching hotels:', error);
      return [];
    }
  }

  async getAirportInfo(keyword: string): Promise<AirportInfo[]> {
    const token = await this.getAccessToken();
    if (!token) {
      return [];
    }

    try {
      const response = await this.withRateLimitHandling(() =>
        fetch(
          `https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT&keyword=${encodeURIComponent(keyword)}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
      );

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error getting airport info:', error);
      return [];
    }
  }

  formatFlightOfferForDisplay(offer: AmadeusFlightOffer): SimplifiedFlight {
    const itinerary = offer.itineraries[0];
    if (!itinerary || !itinerary.segments || itinerary.segments.length === 0) {
      throw new Error('Invalid flight offer data');
    }
    const firstSegment = itinerary.segments[0];
    const lastSegment = itinerary.segments[itinerary.segments.length - 1];
    if (!firstSegment || !lastSegment) {
      throw new Error('Invalid flight segments data');
    }

    return {
      id: offer.id,
      price: parseFloat(offer.price.total),
      currency: offer.price.currency,
      duration: itinerary.duration,
      stops: itinerary.segments.length - 1,
      airline: firstSegment.carrierCode,
      departure: {
        airport: firstSegment.departure.iataCode,
        time: new Date(firstSegment.departure.at).toLocaleTimeString(),
        date: new Date(firstSegment.departure.at).toLocaleDateString(),
      },
      arrival: {
        airport: lastSegment.arrival.iataCode,
        time: new Date(lastSegment.arrival.at).toLocaleTimeString(),
        date: new Date(lastSegment.arrival.at).toLocaleDateString(),
      },
      segments: itinerary.segments,
    };
  }

  formatHotelOfferForDisplay(hotelOffer: AmadeusHotelOffer): SimplifiedHotel {
    const minPriceOffer = hotelOffer.offers.reduce((min, offer) => 
      parseFloat(offer.price.total) < parseFloat(min.price.total) ? offer : min
    );

    return {
      id: hotelOffer.hotel.hotelId,
      name: hotelOffer.hotel.name,
      ...(hotelOffer.hotel.rating && { rating: hotelOffer.hotel.rating }),
      address: `${hotelOffer.hotel.address.lines.join(', ')}, ${hotelOffer.hotel.address.cityName}`,
      coordinates: [hotelOffer.hotel.longitude, hotelOffer.hotel.latitude],
      minPrice: parseFloat(minPriceOffer.price.total),
      currency: minPriceOffer.price.currency,
      offers: hotelOffer.offers,
      ...(hotelOffer.hotel.amenities && { amenities: hotelOffer.hotel.amenities }),
    };
  }

  getPopularAirportCodes(): { [key: string]: string } {
    return {
      'NYC': 'New York Area',
      'LAX': 'Los Angeles',
      'LHR': 'London Heathrow',
      'CDG': 'Paris Charles de Gaulle',
      'DXB': 'Dubai',
      'NRT': 'Tokyo Narita',
      'SIN': 'Singapore',
      'HKG': 'Hong Kong',
      'FRA': 'Frankfurt',
      'AMS': 'Amsterdam',
    };
  }

  /**
   * Get IATA city codes for hotel searches
   */
  getCityCodeMapping(): { [key: string]: string } {
    return {
      // Major cities
      'paris': 'PAR',
      'london': 'LON',
      'rome': 'ROM',
      'madrid': 'MAD',
      'barcelona': 'BCN',
      'amsterdam': 'AMS',
      'berlin': 'BER',
      'vienna': 'VIE',
      'prague': 'PRG',
      'budapest': 'BUD',
      'lisbon': 'LIS',
      'dublin': 'DUB',
      'stockholm': 'STO',
      'copenhagen': 'CPH',
      'oslo': 'OSL',
      'helsinki': 'HEL',
      'warsaw': 'WAW',
      'moscow': 'MOW',
      'istanbul': 'IST',
      'athens': 'ATH',
      'cairo': 'CAI',
      'dubai': 'DXB',
      'doha': 'DOH',
      'mumbai': 'BOM',
      'delhi': 'DEL',
      'bangkok': 'BKK',
      'singapore': 'SIN',
      'hong kong': 'HKG',
      'beijing': 'BJS',
      'shanghai': 'SHA',
      'tokyo': 'TYO',
      'osaka': 'OSA',
      'seoul': 'SEL',
      'sydney': 'SYD',
      'melbourne': 'MEL',
      'auckland': 'AKL',
      // Americas
      'new york': 'NYC',
      'los angeles': 'LAX',
      'chicago': 'CHI',
      'miami': 'MIA',
      'san francisco': 'SFO',
      'toronto': 'YTO',
      'vancouver': 'YVR',
      'montreal': 'YMQ',
      'mexico city': 'MEX',
      'cancun': 'CUN',
      'buenos aires': 'BUE',
      'rio de janeiro': 'RIO',
      'sao paulo': 'SAO',
      'lima': 'LIM',
      'bogota': 'BOG',
      // Africa
      'johannesburg': 'JNB',
      'cape town': 'CPT',
      'casablanca': 'CAS',
      'marrakech': 'RAK',
      'nairobi': 'NBO',
      'addis ababa': 'ADD'
    };
  }

  /**
   * Resolve city name to IATA city code for hotel searches
   */
  resolveCityCode(cityName: string): string | null {
    const normalizedName = cityName.toLowerCase().trim();
    const cityMapping = this.getCityCodeMapping();
    
    console.log(`Resolving city code for: "${cityName}" (normalized: "${normalizedName}")`)
    
    // Direct match
    if (cityMapping[normalizedName]) {
      console.log(`Direct match found: ${cityMapping[normalizedName]}`)
      return cityMapping[normalizedName];
    }
    
    // Try to find partial matches
    for (const [city, code] of Object.entries(cityMapping)) {
      if (normalizedName.includes(city) || city.includes(normalizedName)) {
        console.log(`Partial match found: "${city}" -> ${code}`)
        return code;
      }
    }
    
    // If no match found, return null to indicate we should skip hotel search
    console.log(`No city code match found for: "${cityName}"`)
    return null;
  }
}

export const amadeusService = new AmadeusService();