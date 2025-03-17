import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getDateFormatted, getGreeting, getOutfitSuggestionByTemperature, getWeatherData, getWeatherIcon } from "@/lib/weather";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface WeatherSummaryProps {
  username?: string;
  location?: string;
}

const WeatherSummary = ({ username = 'User', location = 'New York' }: WeatherSummaryProps) => {
  const { toast } = useToast();
  
  const { data: weatherData, isLoading, isError, refetch } = useQuery({ 
    queryKey: ['/api/weather', location],
    queryFn: async () => {
      try {
        return await getWeatherData(location);
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
        throw error;
      }
    }
  });

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Weather Refreshed",
      description: "Latest weather data has been fetched.",
    });
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">{getGreeting(username)}</CardTitle>
            <p className="text-sm opacity-90">{getDateFormatted()}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="bg-white/20 border-white/40 text-white hover:bg-white/30">
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-36" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
        ) : isError ? (
          <div className="text-center py-4">
            <p className="text-red-500 mb-2">Unable to fetch weather data</p>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">{weatherData.location}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{weatherData.main}</Badge>
                  <span className="text-sm text-muted-foreground">{weatherData.description}</span>
                </div>
              </div>
              <div className="text-center">
                <i className={`fas ${getWeatherIcon(weatherData.main, weatherData.timeOfDay)} text-3xl text-blue-500`}></i>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                <p className="text-sm text-muted-foreground mb-1">Temperature</p>
                <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
                <p className="text-xs text-muted-foreground">Feels like: {weatherData.feelsLike}°C</p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                <p className="text-sm text-muted-foreground mb-1">Conditions</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm">💧 {weatherData.humidity}%</p>
                  <p className="text-sm">💨 {weatherData.windSpeed} m/s</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 border-t pt-4">
              <h3 className="text-md font-medium mb-2">Outfit Suggestion</h3>
              <p className="text-sm px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                {getOutfitSuggestionByTemperature(weatherData.temperature)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherSummary;