/**
 * OpenWeatherMap API Service
 * Provides weather data for travel destinations
 * Free tier: 1000 calls/day
 */

import { apiUsageService } from './apiUsageService'

export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    visibility: number;
    uv_index: number;
    wind_speed: number;
    wind_direction: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    };
  };
  forecast?: {
    date: string;
    temp_min: number;
    temp_max: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    };
  }[];
}

export interface WeatherForecast {
  date: string;
  temp_min: number;
  temp_max: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  };
}

class OpenWeatherService {
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';
  private readonly apiKey = process.env.OPENWEATHER_API_KEY;

  constructor() {
    if (!this.apiKey) {
      console.warn('OpenWeatherMap API key not found. Weather data will not be available.');
    }
  }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const startTime = Date.now()
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`
      );
      const responseTime = Date.now() - startTime

      if (!response.ok) {
        apiUsageService.recordAPICall('openweather', responseTime, true)
        throw new Error(`OpenWeatherMap API error: ${response.status}`);
      }

      apiUsageService.recordAPICall('openweather', responseTime, false)
      const data = await response.json();

      return this.formatCurrentWeatherData(data);
    } catch (error) {
      console.error('Error fetching current weather:', error);
      return null;
    }
  }

  async getWeatherForecast(lat: number, lon: number, days: number = 5): Promise<WeatherForecast[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const startTime = Date.now()
      const response = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial&cnt=${days * 8}` // 8 forecasts per day (3-hour intervals)
      );
      const responseTime = Date.now() - startTime

      if (!response.ok) {
        apiUsageService.recordAPICall('openweather', responseTime, true)
        throw new Error(`OpenWeatherMap API error: ${response.status}`);
      }

      apiUsageService.recordAPICall('openweather', responseTime, false)
      const data = await response.json();

      return this.formatForecastData(data);
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      return [];
    }
  }

  async getWeatherByCity(cityName: string, countryCode?: string): Promise<WeatherData | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const location = countryCode ? `${cityName},${countryCode}` : cityName;
      const response = await fetch(
        `${this.baseUrl}/weather?q=${encodeURIComponent(location)}&appid=${this.apiKey}&units=imperial`
      );

      if (!response.ok) {
        throw new Error(`OpenWeatherMap API error: ${response.status}`);
      }

      const data = await response.json();

      return this.formatCurrentWeatherData(data);
    } catch (error) {
      console.error(`Error fetching weather for city "${cityName}":`, error);
      return null;
    }
  }

  private formatCurrentWeatherData(data: any): WeatherData {
    return {
      location: {
        name: data.name,
        country: data.sys.country,
        lat: data.coord.lat,
        lon: data.coord.lon,
      },
      current: {
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000, // Convert to km
        uv_index: 0, // Not available in current weather endpoint
        wind_speed: data.wind.speed,
        wind_direction: data.wind.deg,
        weather: {
          main: data.weather[0].main,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
        },
      },
    };
  }

  private formatForecastData(data: any): WeatherForecast[] {
    const dailyForecasts: { [key: string]: any[] } = {};
    
    // Group forecasts by date
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = [];
      }
      dailyForecasts[date].push(item);
    });

    // Create daily summaries
    return Object.entries(dailyForecasts).map(([date, forecasts]) => {
      const temps = forecasts.map(f => f.main.temp);
      const temp_min = Math.round(Math.min(...temps));
      const temp_max = Math.round(Math.max(...temps));
      
      // Use the most common weather condition for the day
      const weatherCounts: { [key: string]: number } = {};
      forecasts.forEach(f => {
        const weather = f.weather[0].main;
        weatherCounts[weather] = (weatherCounts[weather] || 0) + 1;
      });
      
      const mostCommonWeather = Object.entries(weatherCounts)
        .sort(([,a], [,b]) => b - a)[0][0];
      
      const representativeWeather = forecasts.find(f => f.weather[0].main === mostCommonWeather).weather[0];

      return {
        date,
        temp_min,
        temp_max,
        weather: {
          main: representativeWeather.main,
          description: representativeWeather.description,
          icon: representativeWeather.icon,
        },
      };
    });
  }

  getWeatherIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  formatTemperature(temp: number, unit: 'C' | 'F' = 'C'): string {
    if (unit === 'F') {
      const fahrenheit = (temp * 9/5) + 32;
      return `${Math.round(fahrenheit)}°F`;
    }
    return `${temp}°C`;
  }

  getWeatherDescription(weatherMain: string): string {
    const descriptions: { [key: string]: string } = {
      Clear: 'Clear skies',
      Clouds: 'Cloudy',
      Rain: 'Rainy',
      Drizzle: 'Light rain',
      Thunderstorm: 'Thunderstorms',
      Snow: 'Snowy',
      Mist: 'Misty',
      Fog: 'Foggy',
      Haze: 'Hazy',
      Dust: 'Dusty',
      Sand: 'Sandy',
      Ash: 'Volcanic ash',
      Squall: 'Squalls',
      Tornado: 'Tornado warning',
    };

    return descriptions[weatherMain] || weatherMain;
  }
}

export const openWeatherService = new OpenWeatherService();