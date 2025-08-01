/**
 * Geoapify Places API Service
 * Provides points of interest and tourist attraction data
 * Free tier: 3000 credits/day (1 credit per request, 20 places = 1 credit)
 */

import { apiUsageService } from './apiUsageService'

export interface GeoapifyPlace {
  type: 'Feature';
  properties: {
    name: string;
    country: string;
    country_code: string;
    state: string;
    city: string;
    postcode?: string;
    district?: string;
    street?: string;
    housenumber?: string;
    lon: number;
    lat: number;
    formatted: string;
    address_line1: string;
    address_line2: string;
    categories: string[];
    details?: string[];
    datasource: {
      sourcename: string;
      attribution: string;
      license: string;
      url: string;
    };
    place_id: string;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface GeoapifyResponse {
  type: 'FeatureCollection';
  features: GeoapifyPlace[];
  query: {
    text?: string;
    parsed?: Record<string, unknown>;
  };
}

export interface GeoapifyPlaceDetails {
  type: 'Feature';
  properties: {
    name: string;
    country: string;
    country_code: string;
    state: string;
    city: string;
    postcode?: string;
    district?: string;
    street?: string;
    housenumber?: string;
    lon: number;
    lat: number;
    formatted: string;
    address_line1: string;
    address_line2: string;
    categories: string[];
    details?: string[];
    opening_hours?: string;
    phone?: string;
    website?: string;
    email?: string;
    datasource: {
      sourcename: string;
      attribution: string;
      license: string;
      url: string;
      raw?: Record<string, unknown>;
    };
    place_id: string;
    rank?: {
      popularity?: number;
      confidence?: number;
    };
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

class GeoapifyService {
  private readonly baseUrl = 'https://api.geoapify.com/v2/places';
  private readonly apiKey = process.env.GEOAPIFY_API_KEY;

  constructor() {
    console.log('🔑 Geoapify API key status:', {
      hasKey: !!this.apiKey,
      keyLength: this.apiKey?.length,
      keyPreview: this.apiKey ? `${this.apiKey.substring(0, 8)}...` : 'undefined'
    });
    
    if (!this.apiKey) {
      console.warn('Geoapify API key not found. POI data will not be available.');
    }
  }

  async getPlacesByRadius(
    lat: number, 
    lon: number, 
    radius: number = 10000, 
    limit: number = 20,
    categories: string[] = ['tourism.sights']
  ): Promise<GeoapifyPlace[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const categoriesParam = categories.join(',');
      const startTime = Date.now();
      const response = await fetch(
        `${this.baseUrl}?categories=${categoriesParam}&filter=circle:${lon},${lat},${radius}&limit=${limit}&apikey=${this.apiKey}`
      );

      if (!response.ok) {
        const responseTime = Date.now() - startTime;
        apiUsageService.recordAPICall('geoapify', responseTime, true);
        const errorText = await response.text();
        console.error('🚨 Geoapify API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText,
          requestUrl: `${this.baseUrl}?categories=${categoriesParam}&filter=circle:${lon},${lat},${radius}&limit=${limit}&apikey=${this.apiKey?.substring(0, 8)}...`
        });
        throw new Error(`Geoapify API error: ${response.status} - ${errorText}`);
      }

      const responseTime = Date.now() - startTime;
      apiUsageService.recordAPICall('geoapify', responseTime, false);
      const data: GeoapifyResponse = await response.json();
      return data.features || [];
    } catch (error) {
      console.error('Error fetching places by radius:', error);
      // API call tracking is handled in the response check above
      return [];
    }
  }

  async getPlacesByBbox(
    lonMin: number,
    latMin: number,
    lonMax: number,
    latMax: number,
    limit: number = 20,
    categories: string[] = ['tourism.sights']
  ): Promise<GeoapifyPlace[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const categoriesParam = categories.join(',');
      const startTime = Date.now();
      const response = await fetch(
        `${this.baseUrl}?categories=${categoriesParam}&filter=rect:${lonMin},${latMin},${lonMax},${latMax}&limit=${limit}&apikey=${this.apiKey}`
      );

      if (!response.ok) {
        const responseTime = Date.now() - startTime;
        apiUsageService.recordAPICall('geoapify', responseTime, true);
        throw new Error(`Geoapify API error: ${response.status}`);
      }

      const responseTime = Date.now() - startTime;
      apiUsageService.recordAPICall('geoapify', responseTime, false);
      const data: GeoapifyResponse = await response.json();
      return data.features || [];
    } catch (error) {
      console.error('Error fetching places by bbox:', error);
      return [];
    }
  }

  async getPlaceDetails(placeId: string): Promise<GeoapifyPlaceDetails | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const startTime = Date.now();
      const response = await fetch(
        `https://api.geoapify.com/v2/place-details?id=${placeId}&apikey=${this.apiKey}`
      );

      if (!response.ok) {
        const responseTime = Date.now() - startTime;
        apiUsageService.recordAPICall('geoapify', responseTime, true);
        throw new Error(`Geoapify API error: ${response.status}`);
      }

      const responseTime = Date.now() - startTime;
      apiUsageService.recordAPICall('geoapify', responseTime, false);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching place details for id "${placeId}":`, error);
      return null;
    }
  }

  async searchPlacesByText(
    text: string,
    lat?: number,
    lon?: number,
    radius: number = 50000,
    limit: number = 20,
    categories: string[] = ['tourism.sights']
  ): Promise<GeoapifyPlace[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const categoriesParam = categories.join(',');
      let url = `${this.baseUrl}?categories=${categoriesParam}&text=${encodeURIComponent(text)}&limit=${limit}&apikey=${this.apiKey}`;
      
      if (lat && lon) {
        url += `&filter=circle:${lon},${lat},${radius}`;
      }

      const startTime = Date.now();
      const response = await fetch(url);

      if (!response.ok) {
        const responseTime = Date.now() - startTime;
        apiUsageService.recordAPICall('geoapify', responseTime, true);
        throw new Error(`Geoapify API error: ${response.status}`);
      }

      const responseTime = Date.now() - startTime;
      apiUsageService.recordAPICall('geoapify', responseTime, false);
      const data: GeoapifyResponse = await response.json();
      return data.features || [];
    } catch (error) {
      console.error(`Error searching places by text "${text}":`, error);
      return [];
    }
  }

  getPlaceCategories(): { [key: string]: string } {
    return {
      'tourism': 'Tourism & Travel',
      'tourism.sights': 'Tourist Attractions',
      'tourism.attraction': 'Tourist Attractions',
      'tourism.museum': 'Museums',
      'tourism.monument': 'Monuments',
      'tourism.castle': 'Castles',
      'tourism.ruins': 'Historical Ruins',
      'tourism.archaeological_site': 'Archaeological Sites',
      'tourism.battlefield': 'Battlefields',
      'entertainment': 'Entertainment',
      'entertainment.theme_park': 'Theme Parks',
      'entertainment.zoo': 'Zoos',
      'entertainment.aquarium': 'Aquariums',
      'natural': 'Natural Attractions',
      'natural.beach': 'Beaches',
      'natural.mountain_peak': 'Mountain Peaks',
      'natural.national_park': 'National Parks',
      'natural.waterfall': 'Waterfalls',
      'leisure': 'Leisure Activities',
      'leisure.park': 'Parks',
      'leisure.garden': 'Gardens',
      'leisure.marina': 'Marinas',
      'religion': 'Religious Sites',
      'religion.place_of_worship': 'Places of Worship',
      'building': 'Buildings & Architecture',
      'building.historic': 'Historic Buildings'
    };
  }

  formatPlaceForDisplay(place: GeoapifyPlace, details?: GeoapifyPlaceDetails): {
    id: string;
    name: string;
    coordinates: [number, number];
    rating: number;
    categories: string[];
    address?: string;
    description?: string;
    image?: string;
    url?: string;
    phone?: string;
    website?: string;
    openingHours?: string;
  } {
    const categoryMap = this.getPlaceCategories();
    const categories = place.properties.categories.map(cat => 
      categoryMap[cat] || cat.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    );

    // Build address from available components
    const addressParts = [
      place.properties.street,
      place.properties.city,
      place.properties.state,
      place.properties.country
    ].filter(Boolean);
    
    const address = addressParts.length > 0 ? addressParts.join(', ') : place.properties.formatted;

    // Generate a rating based on data source and popularity (mock for now)
    let rating = 2; // Default rating
    if (details?.properties.rank?.popularity) {
      rating = Math.min(3, Math.max(1, Math.round(details.properties.rank.popularity * 3)));
    } else if (place.properties.categories.includes('tourism.sights')) {
      rating = 3; // High rating for tourist sights
    } else if (place.properties.categories.includes('tourism.museum')) {
      rating = 3; // High rating for museums
    }

    const attraction = {
      id: place.properties.place_id,
      name: place.properties.name || 'Unnamed Location',
      coordinates: place.geometry.coordinates as [number, number],
      rating,
      categories,
      ...(address && { address }),
    };

    // Add optional properties only if they exist
    if (details?.properties.details) {
      Object.assign(attraction, { description: details.properties.details.join('. ') });
    }
    if (details?.properties.phone) {
      Object.assign(attraction, { phone: details.properties.phone });
    }
    if (details?.properties.website) {
      Object.assign(attraction, { website: details.properties.website });
      Object.assign(attraction, { url: details.properties.website });
    }
    if (details?.properties.opening_hours) {
      Object.assign(attraction, { openingHours: details.properties.opening_hours });
    }

    return attraction;
  }

  getPopularCategories(): string[] {
    return [
      'tourism.sights',
      'tourism.museum',
      'tourism.monument',
      'tourism.castle',
      'entertainment.theme_park',
      'natural.beach',
      'natural.national_park',
      'leisure.park'
    ];
  }

  getTouristAttractionCategories(): string[] {
    return [
      'tourism.sights',
      'tourism.attraction',
      'tourism.museum',
      'tourism.monument',
      'tourism.castle',
      'tourism.ruins',
      'tourism.archaeological_site',
      'entertainment.theme_park',
      'entertainment.zoo',
      'entertainment.aquarium',
      'natural.beach',
      'natural.mountain_peak',
      'natural.national_park',
      'natural.waterfall',
      'leisure.park',
      'leisure.garden',
      'building.historic'
    ];
  }

  getRatingDescription(rating: number): string {
    switch (rating) {
      case 3:
        return 'Must-see attraction';
      case 2:
        return 'Worth visiting';
      case 1:
        return 'Minor attraction';
      default:
        return 'Unrated';
    }
  }

  async getTopAttractionsForCity(cityName: string, limit: number = 20): Promise<GeoapifyPlace[]> {
    try {
      // Search for tourist attractions in the city
      const attractions = await this.searchPlacesByText(
        cityName,
        undefined,
        undefined,
        50000, // 50km radius
        limit,
        this.getTouristAttractionCategories()
      );
      
      // Sort by categories priority (tourist sights first, then museums, etc.)
      const categoryPriority: { [key: string]: number } = {
        'tourism.sights': 10,
        'tourism.attraction': 9,
        'tourism.museum': 8,
        'tourism.monument': 7,
        'tourism.castle': 6,
        'entertainment.theme_park': 5,
        'natural.beach': 4,
        'natural.national_park': 3,
        'leisure.park': 2
      };

      return attractions.sort((a, b) => {
        const aPriority = Math.max(...a.properties.categories.map(cat => categoryPriority[cat] || 1));
        const bPriority = Math.max(...b.properties.categories.map(cat => categoryPriority[cat] || 1));
        return bPriority - aPriority;
      }).slice(0, limit);
    } catch (error) {
      console.error(`Error getting top attractions for "${cityName}":`, error);
      return [];
    }
  }

  // Utility method to estimate API credits usage
  estimateCreditsUsage(numberOfRequests: number, averagePlacesPerRequest: number = 20): number {
    // Geoapify charges 1 credit per request, with up to 20 places per credit
    return Math.ceil(numberOfRequests * (averagePlacesPerRequest / 20));
  }

  // Method to check if we're likely to stay within free tier
  isWithinFreeDaily(requestsToday: number, averagePlacesPerRequest: number = 20): boolean {
    const estimatedCredits = this.estimateCreditsUsage(requestsToday, averagePlacesPerRequest);
    return estimatedCredits <= 3000; // 3000 credits per day free tier
  }
}

export const geoapifyService = new GeoapifyService();