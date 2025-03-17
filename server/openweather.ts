interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  main: string;
  timeOfDay: "day" | "night";
  dateTime: string;
}

export async function getWeatherData(location: string): Promise<WeatherData> {
  try {
    const apiKey = "d7d197a14e3e3aa94e0cad25e61ef31e";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `OpenWeather API error: ${response.statusText} (${response.status})`,
      );
    }

    const data = await response.json();

    // Determine if it's day or night based on current time and sunrise/sunset
    const now = Date.now() / 1000; // Convert to seconds
    const isDaytime =
      now > data.sys.sunrise && now < data.sys.sunset ? "day" : "night";

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
      dateTime: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Failed to fetch weather data from OpenWeather API:", error);
    throw new Error(
      "Weather data unavailable. Please check your API key or try again later.",
    );
  }
}

export function getWeatherIconClass(
  main: string,
  timeOfDay: "day" | "night",
): string {
  const iconMap: Record<string, string> = {
    Clear_day: "fa-sun",
    Clear_night: "fa-moon",
    Clouds_day: "fa-cloud-sun",
    Clouds_night: "fa-cloud-moon",
    Rain_day: "fa-cloud-rain",
    Rain_night: "fa-cloud-rain",
    Drizzle_day: "fa-cloud-rain",
    Drizzle_night: "fa-cloud-rain",
    Thunderstorm_day: "fa-bolt",
    Thunderstorm_night: "fa-bolt",
    Snow_day: "fa-snowflake",
    Snow_night: "fa-snowflake",
    Mist_day: "fa-smog",
    Mist_night: "fa-smog",
    Fog_day: "fa-smog",
    Fog_night: "fa-smog",
  };

  const key = `${main}_${timeOfDay}`;
  return iconMap[key] || "fa-cloud";
}

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

export function getFiveDayForecast(location: string): Promise<any[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const apiKey = "YOUR-OPENWEATHER-API-KEY-HERE";
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `OpenWeather API error: ${response.statusText} (${response.status})`,
        );
      }

      const data = await response.json();

      // Process the forecast data to get daily forecasts (OpenWeather returns 3-hour forecasts)
      const dailyForecasts: any = {};

      data.list.forEach((forecast: any) => {
        const date = new Date(forecast.dt * 1000).toISOString().split("T")[0];

        if (!dailyForecasts[date]) {
          dailyForecasts[date] = {
            date,
            temperatures: [],
            descriptions: [],
            icons: [],
            main: [],
          };
        }

        dailyForecasts[date].temperatures.push(forecast.main.temp);
        dailyForecasts[date].descriptions.push(forecast.weather[0].description);
        dailyForecasts[date].icons.push(forecast.weather[0].icon);
        dailyForecasts[date].main.push(forecast.weather[0].main);
      });

      // Calculate average temperature and most common weather condition for each day
      const results = Object.values(dailyForecasts).map((day: any) => {
        const avgTemp =
          day.temperatures.reduce(
            (sum: number, temp: number) => sum + temp,
            0,
          ) / day.temperatures.length;

        // Find most frequent description
        const countMap: Record<string, number> = {};
        let maxCount = 0;
        let mostFrequent = day.main[0];

        day.main.forEach((condition: string) => {
          countMap[condition] = (countMap[condition] || 0) + 1;
          if (countMap[condition] > maxCount) {
            maxCount = countMap[condition];
            mostFrequent = condition;
          }
        });

        // Format the date
        const dateObj = new Date(day.date);
        const formattedDate = dateObj.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        return {
          date: formattedDate,
          avgTemperature: Math.round(avgTemp),
          main: mostFrequent,
          description:
            day.descriptions.find((desc: string) =>
              desc.includes(mostFrequent.toLowerCase()),
            ) || day.descriptions[0],
          icon:
            day.icons.find((icon: string) =>
              icon.includes(mostFrequent.toLowerCase().charAt(0)),
            ) || day.icons[0],
        };
      });

      resolve(results.slice(0, 5)); // Return 5-day forecast
    } catch (error) {
      console.error(
        "Failed to fetch forecast data from OpenWeather API:",
        error,
      );
      reject(error);
    }
  });
}
