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
      const response = await fetch(`${this.baseUrl}/name/${encodeURIComponent(name)}?fields=name,capital,region,subregion,population,area,flag,flags,currencies,languages,timezones,continents,latlng`);
      
      if (!response.ok) {
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

  formatCountryForDestination(country: Country): {
    name: string;
    capital: string;
    region: string;
    currency: string;
    languages: string[];
    timezone: string;
    coordinates: [number, number];
    flag: string;
  } {
    const currencies = country.currencies ? Object.values(country.currencies) : [];
    const languages = country.languages ? Object.values(country.languages) : [];
    
    return {
      name: country.name.common,
      capital: country.capital?.[0] || 'N/A',
      region: country.region,
      currency: currencies[0]?.name || 'N/A',
      languages,
      timezone: country.timezones[0] || 'N/A',
      coordinates: country.latlng,
      flag: country.flags.svg
    };
  }
}

export const restCountriesService = new RestCountriesService();