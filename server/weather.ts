import { apiRequest } from '../client/src/lib/queryClient';

interface WeatherData {
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

export async function getWeatherData(location: string): Promise<WeatherData> {
  try {
    const apiKey = process.env.WEATHER_API_KEY || "4d8fb5b93d4af21d66a2948710284366"; // Fallback to a free test API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Determine if it's day or night based on current time and sunrise/sunset
    const now = Date.now() / 1000; // Convert to seconds
    const isDaytime = now > data.sys.sunrise && now < data.sys.sunset ? 'day' : 'night';
    
    return {
      location: data.name,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      feelsLike: Math.round(data.main.feels_like),
      main: data.weather[0].main,
      timeOfDay: isDaytime,
      dateTime: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    
    // Return fallback weather data
    return {
      location: location,
      temperature: 22,
      description: 'broken clouds',
      icon: '04d',
      humidity: 60,
      windSpeed: 3.5,
      feelsLike: 23,
      main: 'Clouds',
      timeOfDay: 'day',
      dateTime: new Date().toISOString()
    };
  }
}
