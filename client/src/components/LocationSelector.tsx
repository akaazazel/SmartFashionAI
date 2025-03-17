import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface LocationSelectorProps {
  currentLocation: string;
  onLocationChange: (location: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  currentLocation,
  onLocationChange
}) => {
  const [location, setLocation] = useState(currentLocation);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location.trim()) {
      toast({
        title: "Location Required",
        description: "Please enter a city name",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Save weather preferences to the backend
      await apiRequest('POST', '/api/weather-preferences', {
        userId: 1, // Hardcoded for now
        location: location.trim(),
        unit: 'metric' // Default to metric
      });
      
      // Invalidate weather queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/weather'] });
      queryClient.invalidateQueries({ queryKey: ['/api/forecast'] });
      
      // Update parent component
      onLocationChange(location);
      
      toast({
        title: "Location Updated",
        description: `Weather data will now show for ${location}`,
      });
    } catch (error) {
      console.error('Failed to update location:', error);
      toast({
        title: "Update Failed",
        description: "Could not update your location. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <Input
        type="text"
        placeholder="Enter your city"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full"
      />
      <Button 
        type="submit" 
        size="sm"
        disabled={isLoading}
      >
        {isLoading ? 'Updating...' : 'Update'}
      </Button>
    </form>
  );
};

export default LocationSelector;