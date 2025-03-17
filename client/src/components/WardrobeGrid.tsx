import { useQuery } from '@tanstack/react-query';
import { getSustainabilityColor } from '@/lib/openai';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { WardrobeItem } from '@shared/schema';

interface WardrobeGridProps {
  category: string;
}

const WardrobeGrid = ({ category }: WardrobeGridProps) => {
  const { data: items, isLoading, error } = useQuery<WardrobeItem[]>({
    queryKey: ['/api/wardrobe'],
  });
  
  // Filter items by category if not 'All Items'
  const filteredItems = items?.filter(item => 
    category === 'All Items' || item.category.toLowerCase() === category.toLowerCase()
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="relative pb-[100%]">
              <Skeleton className="absolute h-full w-full" />
            </div>
            <div className="p-3">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Failed to load wardrobe items</p>
        <p className="text-sm text-gray-500 mt-2">Please try again later</p>
      </div>
    );
  }

  if (!filteredItems?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No items found in this category</p>
        <p className="text-sm text-gray-400 mt-2">Add some items to see them here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
      {filteredItems.map((item) => (
        <Card key={item.id} className="rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative pb-[100%]">
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="absolute h-full w-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <div className={`${getSustainabilityColor(item.sustainabilityScore || 0)} text-white text-xs rounded-full px-2 py-1 flex items-center`}>
                <i className="fas fa-leaf mr-1"></i>
                <span>{item.sustainabilityScore}%</span>
              </div>
            </div>
          </div>
          <CardContent className="p-3">
            <h3 className="font-medium text-sm">{item.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{item.material} • {item.style}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WardrobeGrid;
