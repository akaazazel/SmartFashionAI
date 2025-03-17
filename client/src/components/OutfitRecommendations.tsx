import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Outfit, WardrobeItem } from '@shared/schema';
import { getSustainabilityColor } from '@/lib/openai';

const OutfitRecommendations = () => {
  const { data: outfits, isLoading: outfitsLoading } = useQuery<Outfit[]>({
    queryKey: ['/api/outfits'],
  });

  const { data: wardrobeItems, isLoading: itemsLoading } = useQuery<WardrobeItem[]>({
    queryKey: ['/api/wardrobe'],
  });

  const isLoading = outfitsLoading || itemsLoading;

  // Helper function to find item by ID
  const findItemById = (id: number): WardrobeItem | undefined => {
    return wardrobeItems?.find(item => item.id === id);
  };

  // Get top 3 outfits to display
  const displayOutfits = outfits?.slice(0, 3);

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recommended Outfits</h2>
        <a href="/outfits" className="text-primary hover:text-indigo-700 font-medium text-sm flex items-center">
          View All <i className="fas fa-chevron-right ml-1 text-xs"></i>
        </a>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      ) : !displayOutfits?.length ? (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p>No outfit recommendations available</p>
          <p className="text-sm text-gray-500 mt-1">Add more items to your wardrobe for recommendations</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayOutfits.map((outfit) => (
            <Card key={outfit.id} className="rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{outfit.name}</h3>
                  <div className={`${getSustainabilityColor(outfit.sustainabilityScore || 0)} text-white text-xs rounded-full px-2 py-1 flex items-center`}>
                    <i className="fas fa-leaf mr-1"></i>
                    <span>{outfit.sustainabilityScore}%</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 mb-4">
                  {outfit.occasion && (
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      {outfit.occasion}
                    </span>
                  )}
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    {outfit.season || 'All Seasons'}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  {Array.isArray(outfit.items) && outfit.items.slice(0, 3).map((itemId) => {
                    const item = findItemById(Number(itemId));
                    return (
                      <div key={itemId} className="flex-1 bg-gray-100 rounded-lg p-1">
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
                  variant="outline"
                  className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                >
                  Save Outfit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OutfitRecommendations;
