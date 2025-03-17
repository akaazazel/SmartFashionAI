import { apiRequest } from './queryClient';

export interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  main: string;
  timeOfDay: 'day' | 'night';
  dateTime: string;
}

export interface ForecastDay {
  date: string;
  avgTemperature: number;
  main: string;
  description: string;
  icon: string;
}

/**
 * Get current weather data from OpenWeatherAPI
 * @param location Location name (city)
 * @returns Weather data object
 */
export async function getWeatherData(location: string = 'New York'): Promise<WeatherData> {
  try {
    const response = await apiRequest('GET', `/api/weather?location=${encodeURIComponent(location)}`, undefined);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

/**
 * Get 5-day weather forecast
 * @param location Location name (city)
 * @returns Array of forecast days
 */
export async function getFiveDayForecast(location: string = 'New York'): Promise<ForecastDay[]> {
  try {
    const response = await apiRequest('GET', `/api/forecast?location=${encodeURIComponent(location)}`, undefined);
    return await response.json();
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
}

/**
 * Get Font Awesome icon class based on weather condition
 * @param main Weather condition (Clear, Clouds, Rain, etc.)
 * @param timeOfDay 'day' or 'night'
 * @returns Font Awesome icon class
 */
export function getWeatherIcon(main: string, timeOfDay: 'day' | 'night'): string {
  const iconMap: Record<string, string> = {
    'Clear_day': 'fa-sun',
    'Clear_night': 'fa-moon',
    'Clouds_day': 'fa-cloud-sun',
    'Clouds_night': 'fa-cloud-moon',
    'Rain_day': 'fa-cloud-rain',
    'Rain_night': 'fa-cloud-rain',
    'Drizzle_day': 'fa-cloud-rain',
    'Drizzle_night': 'fa-cloud-rain',
    'Thunderstorm_day': 'fa-bolt',
    'Thunderstorm_night': 'fa-bolt',
    'Snow_day': 'fa-snowflake',
    'Snow_night': 'fa-snowflake',
    'Mist_day': 'fa-smog',
    'Mist_night': 'fa-smog',
    'Fog_day': 'fa-smog',
    'Fog_night': 'fa-smog'
  };

  const key = `${main}_${timeOfDay}`;
  return iconMap[key] || 'fa-cloud';
}

/**
 * Format the current date
 * @returns Formatted date string
 */
export function getDateFormatted(): string {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  };
  return new Date().toLocaleDateString('en-US', options);
}

/**
 * Get appropriate greeting based on time of day
 * @param name User name
 * @returns Greeting message
 */
export function getGreeting(name: string = 'User'): string {
  const hour = new Date().getHours();
  
  if (hour < 12) return `Good Morning, ${name}!`;
  if (hour < 18) return `Good Afternoon, ${name}!`;
  return `Good Evening, ${name}!`;
}

/**
 * Get clothing suggestion based on temperature
 * @param temperature Temperature in celsius
 * @returns Clothing suggestion string
 */
export function getOutfitSuggestionByTemperature(temperature: number): string {
  if (temperature >= 30) return "Light t-shirt + shorts + sun hat";
  if (temperature >= 25) return "T-shirt + light pants + sun protection";
  if (temperature >= 20) return "Light sweater + jeans + sneakers";
  if (temperature >= 15) return "Sweater + jeans + light jacket";
  if (temperature >= 10) return "Long sleeve + jeans + jacket";
  if (temperature >= 5) return "Sweater + heavy jacket + scarf";
  if (temperature >= 0) return "Sweater + heavy coat + scarf + gloves";
  return "Heavy layers + winter coat + hat + gloves + scarf";
}

/**
 * Determine season based on temperature and month
 * @param temperature Temperature in celsius
 * @returns Season name (spring, summer, fall, winter)
 */
export function getSeasonFromTemperature(temperature: number): string {
  const month = new Date().getMonth(); // 0-11 (Jan-Dec)
  
  // Northern hemisphere seasons
  if (month >= 2 && month <= 4) { // Mar-May
    return temperature < 10 ? 'winter' : 'spring';
  } else if (month >= 5 && month <= 7) { // Jun-Aug
    return temperature < 15 ? 'spring' : 'summer';
  } else if (month >= 8 && month <= 10) { // Sep-Nov
    return temperature < 15 ? 'fall' : 'summer';
  } else { // Dec-Feb
    return temperature < 5 ? 'winter' : 'fall';
  }
}

/**
 * Get appropriate clothing layers based on temperature
 * @param temperature Temperature in celsius
 * @returns Number of recommended layers
 */
export function getRecommendedLayers(temperature: number): number {
  if (temperature >= 25) return 1; // Single layer
  if (temperature >= 15) return 2; // Two layers
  if (temperature >= 5) return 3; // Three layers
  return 4; // Four+ layers for very cold
}
