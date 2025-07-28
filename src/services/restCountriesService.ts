/**
 * REST Countries API Service
 * Provides country information for travel destinations
 * API is completely free with no authentication required
 */

export interface Country {
  name: {
    common: string;
    official: string;
  };
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  area: number;
  flag: string;
  flags: {
    png: string;
    svg: string;
  };
  currencies?: Record<string, {
    name: string;
    symbol: string;
  }>;
  languages?: Record<string, string>;
  timezones: string[];
  continents: string[];
  latlng: [number, number];
}

class RestCountriesService {
  private readonly baseUrl = 'https://restcountries.com/v3.1';
  
  // Country name mappings for common variations
  private readonly countryNameMappings: Record<string, string> = {
    'england': 'united kingdom',
    'uk': 'united kingdom',
    'great britain': 'united kingdom',
    'britain': 'united kingdom',
    'scotland': 'united kingdom',
    'wales': 'united kingdom',
    'northern ireland': 'united kingdom',
    'holland': 'netherlands',
    'the netherlands': 'netherlands',
    'usa': 'united states',
    'us': 'united states',
    'america': 'united states',
    'burma': 'myanmar',
    'siam': 'thailand',
    'ceylon': 'sri lanka',
    'persia': 'iran',
    'czechoslovakia': 'czech republic',
    'yugoslavia': 'serbia',
    'ussr': 'russia',
    'soviet union': 'russia',
    'east germany': 'germany',
    'west germany': 'germany',
    'south korea': 'korea',
    'north korea': 'korea',
    'congo': 'democratic republic of the congo',
    'ivory coast': 'côte d\'ivoire',
    'macedonia': 'north macedonia',
    'swaziland': 'eswatini'
  };

  private normalizeCountryName(name: string): string {
    const normalized = name.toLowerCase().trim();
    return this.countryNameMappings[normalized] || normalized;
  }

  async getAllCountries(): Promise<Country[]> {
    try {
      const response = await fetch(`${this.baseUrl}/all?fields=name,capital,region,subregion,population,area,flag,flags,currencies,languages,timezones,continents,latlng`);
      
      if (!response.ok) {
        throw new Error(`REST Countries API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }

  async getCountryByName(name: string): Promise<Country[]> {
    try {
      // Normalize the country name to handle common variations
      const normalizedName = this.normalizeCountryName(name);
      
      const response = await fetch(`${this.baseUrl}/name/${encodeURIComponent(normalizedName)}?fields=name,capital,region,subregion,population,area,flag,flags,currencies,languages,timezones,continents,latlng`);
      
      if (!response.ok) {
        // If normalized name fails, try with original name as fallback
        if (normalizedName !== name.toLowerCase()) {
          console.warn(`Country "${normalizedName}" not found, trying original name "${name}"`);
          const fallbackResponse = await fetch(`${this.baseUrl}/name/${encodeURIComponent(name)}?fields=name,capital,region,subregion,population,area,flag,flags,currencies,languages,timezones,continents,latlng`);
          
          if (fallbackResponse.ok) {
            return await fallbackResponse.json();
          }
        }
        throw new Error(`REST Countries API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching country by name "${name}":`, error);
      throw error;
    }
  }

  async getCountriesByRegion(region: string): Promise<Country[]> {
    try {
      const response = await fetch(`${this.baseUrl}/region/${encodeURIComponent(region)}?fields=name,capital,region,subregion,population,area,flag,flags,currencies,languages,timezones,continents,latlng`);
      
      if (!response.ok) {
        throw new Error(`REST Countries API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching countries by region "${region}":`, error);
      throw error;
    }
  }

  async getCountryByCode(code: string): Promise<Country> {
    try {
      const response = await fetch(`${this.baseUrl}/alpha/${code}?fields=name,capital,region,subregion,population,area,flag,flags,currencies,languages,timezones,continents,latlng`);
      
      if (!response.ok) {
        throw new Error(`REST Countries API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching country by code "${code}":`, error);
      throw error;
    }
  }

  getPopularTravelRegions(): string[] {
    return [
      'Europe',
      'Asia',
      'Americas',
      'Africa',
      'Oceania'
    ];
  }

  formatCountryForDestination(country: Country | null | undefined): {
    name: string;
    capital: string;
    region: string;
    currency: string;
    languages: string[];
    timezone: string;
    coordinates: [number, number];
    flag: string;
  } | null {
    if (!country) {
      console.warn('formatCountryForDestination: country is null or undefined');
      return null;
    }
    
    const currencies = country.currencies ? Object.values(country.currencies) : [];
    const languages = country.languages ? Object.values(country.languages) : [];
    
    return {
      name: country.name?.common || 'Unknown',
      capital: country.capital?.[0] || 'N/A',
      region: country.region || 'Unknown',
      currency: currencies[0]?.name || 'N/A',
      languages,
      timezone: country.timezones?.[0] || 'N/A',
      coordinates: country.latlng || [0, 0],
      flag: country.flags?.svg || ''
    };
  }
}

export const restCountriesService = new RestCountriesService();