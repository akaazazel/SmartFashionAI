import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TabNavigation from '@/components/TabNavigation';
import WeatherSummary from '@/components/WeatherSummary';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getSustainabilityColor } from '@/lib/openai';

const Recommendations = () => {
  const { toast } = useToast();
  const [occasion, setOccasion] = useState('casual');
  
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['/api/recommendations', { occasion }],
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to load recommendations. Please try again later.',
        variant: 'destructive',
      });
    },
  });
  
  const { data: wardrobeItems } = useQuery({
    queryKey: ['/api/wardrobe'],
  });

  // Helper function to find item by ID
  const findItemById = (id: number) => {
    return wardrobeItems?.find(item => item.id === id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <WeatherSummary />
      <TabNavigation />
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Outfit Recommendations</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center mb-6">
          <p className="mr-4 mb-2 sm:mb-0">What's the occasion?</p>
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide pb-2">
            <Button 
              variant={occasion === 'casual' ? 'default' : 'outline'}
              className={`${occasion === 'casual' ? 'bg-primary text-white' : 'bg-white'} px-4 py-2 rounded-full text-sm font-medium`}
              onClick={() => setOccasion('casual')}
            >
              Casual
            </Button>
            <Button 
              variant={occasion === 'work' ? 'default' : 'outline'}
              className={`${occasion === 'work' ? 'bg-primary text-white' : 'bg-white'} px-4 py-2 rounded-full text-sm font-medium`}
              onClick={() => setOccasion('work')}
            >
              Work
            </Button>
            <Button 
              variant={occasion === 'formal' ? 'default' : 'outline'}
              className={`${occasion === 'formal' ? 'bg-primary text-white' : 'bg-white'} px-4 py-2 rounded-full text-sm font-medium`}
              onClick={() => setOccasion('formal')}
            >
              Formal
            </Button>
            <Button 
              variant={occasion === 'party' ? 'default' : 'outline'}
              className={`${occasion === 'party' ? 'bg-primary text-white' : 'bg-white'} px-4 py-2 rounded-full text-sm font-medium`}
              onClick={() => setOccasion('party')}
            >
              Party
            </Button>
            <Button 
              variant={occasion === 'travel' ? 'default' : 'outline'}
              className={`${occasion === 'travel' ? 'bg-primary text-white' : 'bg-white'} px-4 py-2 rounded-full text-sm font-medium`}
              onClick={() => setOccasion('travel')}
            >
              Travel
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="rounded-xl shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                  
                  <div className="flex space-x-2 mb-4">
                    <Skeleton className="h-6 w-16 rounded" />
                    <Skeleton className="h-6 w-16 rounded" />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Skeleton className="h-24 w-full rounded" />
                    <Skeleton className="h-24 w-full rounded" />
                    <Skeleton className="h-24 w-full rounded" />
                  </div>
                  
                  <Skeleton className="h-8 w-full mt-4 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !recommendations?.length ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-lg font-medium">No recommendations available</p>
            <p className="text-gray-500 mt-1">
              We need more items in your wardrobe to make recommendations for {occasion} occasions
            </p>
            <Button className="mt-4 bg-primary hover:bg-indigo-700 text-white">
              Add Items to Wardrobe
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((outfit, index) => (
              <Card key={index} className="rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{outfit.name}</h3>
                    <div className={`${getSustainabilityColor(outfit.sustainabilityScore || 0)} text-white text-xs rounded-full px-2 py-1 flex items-center`}>
                      <i className="fas fa-leaf mr-1"></i>
                      <span>{outfit.sustainabilityScore}%</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mb-4">
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      {occasion}
                    </span>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      {outfit.season || 'All Seasons'}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    {Array.isArray(outfit.items) && outfit.items.slice(0, 3).map((itemId, idx) => {
                      const item = findItemById(Number(itemId));
                      return (
                        <div key={idx} className="flex-1 bg-gray-100 rounded-lg p-1">
                          {item ? (
                            <img 
                              src={item.imageUrl} 
                              alt={item.name} 
                              className="w-full h-24 object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-500">Item not found</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <Button
                    className="mt-4 w-full py-2 bg-primary hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
                  >
                    Save as Outfit
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
