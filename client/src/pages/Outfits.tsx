import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TabNavigation from '@/components/TabNavigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getSustainabilityColor } from '@/lib/openai';
import { Outfit, WardrobeItem } from '@shared/schema';

const Outfits = () => {
  const [filter, setFilter] = useState('all');
  
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

  // Filter outfits based on selection
  const filteredOutfits = outfits?.filter(outfit => {
    if (filter === 'all') return true;
    if (filter === 'favorites') return outfit.isFavorite;
    return outfit.occasion === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">My Outfits</h1>
      <TabNavigation />
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Saved Outfits</h2>
          <Button className="bg-primary hover:bg-indigo-700 text-white">
            Create New Outfit
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide pb-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            className={`${filter === 'all' ? 'bg-primary text-white' : 'bg-white'} px-4 py-2 rounded-full text-sm font-medium`}
            onClick={() => setFilter('all')}
          >
            All Outfits
          </Button>
          <Button 
            variant={filter === 'favorites' ? 'default' : 'outline'}
            className={`${filter === 'favorites' ? 'bg-primary text-white' : 'bg-white'} px-4 py-2 rounded-full text-sm font-medium`}
            onClick={() => setFilter('favorites')}
          >
            Favorites
          </Button>
          <Button 
            variant={filter === 'casual' ? 'default' : 'outline'}
            className={`${filter === 'casual' ? 'bg-primary text-white' : 'bg-white'} px-4 py-2 rounded-full text-sm font-medium`}
            onClick={() => setFilter('casual')}
          >
            Casual
          </Button>
          <Button 
            variant={filter === 'formal' ? 'default' : 'outline'}
            className={`${filter === 'formal' ? 'bg-primary text-white' : 'bg-white'} px-4 py-2 rounded-full text-sm font-medium`}
            onClick={() => setFilter('formal')}
          >
            Formal
          </Button>
          <Button 
            variant={filter === 'work' ? 'default' : 'outline'}
            className={`${filter === 'work' ? 'bg-primary text-white' : 'bg-white'} px-4 py-2 rounded-full text-sm font-medium`}
            onClick={() => setFilter('work')}
          >
            Work
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
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
                
                <div className="flex space-x-2 mt-4">
                  <Skeleton className="h-8 w-full rounded" />
                  <Skeleton className="h-8 w-full rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !filteredOutfits?.length ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-lg font-medium">No outfits found</p>
          <p className="text-gray-500 mt-1">
            {filter === 'all' 
              ? "You haven't created any outfits yet" 
              : filter === 'favorites'
                ? "You don't have any favorite outfits"
                : `You don't have any ${filter} outfits`}
          </p>
          <Button className="mt-4 bg-primary hover:bg-indigo-700 text-white">
            Create Your First Outfit
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredOutfits.map((outfit) => (
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
                  {outfit.isFavorite && (
                    <span className="bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded flex items-center">
                      <i className="fas fa-heart mr-1"></i> Favorite
                    </span>
                  )}
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
                
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200"
                  >
                    Edit
                  </Button>
                  <Button
                    className="flex-1 py-2 bg-primary hover:bg-indigo-700 text-white"
                  >
                    Wear Today
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Outfits;
