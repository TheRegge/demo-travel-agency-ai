/**
 * Amadeus API Service
 * Provides flight and hotel data through Amadeus Self-Service APIs
 * Free tier: 200-10,000 requests/month depending on API
 */

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

      const response = await fetch(
        `${this.baseUrl}/shopping/flight-offers?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Amadeus flights API error: ${response.status}`);
      }

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

      const response = await fetch(
        `${this.baseUrl}/shopping/hotel-offers?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Amadeus hotels API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error searching hotels:', error);
      return [];
    }
  }

  async getAirportInfo(keyword: string): Promise<any[]> {
    const token = await this.getAccessToken();
    if (!token) {
      return [];
    }

    try {
      const response = await fetch(
        `https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT&keyword=${encodeURIComponent(keyword)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Amadeus airports API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error getting airport info:', error);
      return [];
    }
  }

  formatFlightOfferForDisplay(offer: AmadeusFlightOffer): {
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
    segments: any[];
  } {
    const itinerary = offer.itineraries[0];
    const firstSegment = itinerary.segments[0];
    const lastSegment = itinerary.segments[itinerary.segments.length - 1];

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

  formatHotelOfferForDisplay(hotelOffer: AmadeusHotelOffer): {
    id: string;
    name: string;
    rating?: string;
    address: string;
    coordinates: [number, number];
    minPrice: number;
    currency: string;
    offers: any[];
    amenities?: string[];
  } {
    const minPriceOffer = hotelOffer.offers.reduce((min, offer) => 
      parseFloat(offer.price.total) < parseFloat(min.price.total) ? offer : min
    );

    return {
      id: hotelOffer.hotel.hotelId,
      name: hotelOffer.hotel.name,
      rating: hotelOffer.hotel.rating,
      address: `${hotelOffer.hotel.address.lines.join(', ')}, ${hotelOffer.hotel.address.cityName}`,
      coordinates: [hotelOffer.hotel.longitude, hotelOffer.hotel.latitude],
      minPrice: parseFloat(minPriceOffer.price.total),
      currency: minPriceOffer.price.currency,
      offers: hotelOffer.offers,
      amenities: hotelOffer.hotel.amenities,
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
}

export const amadeusService = new AmadeusService();