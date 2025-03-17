import { useState } from 'react';
import WeatherSummary from '@/components/WeatherSummary';
import TabNavigation from '@/components/TabNavigation';
import CategoryFilter from '@/components/CategoryFilter';
import WardrobeGrid from '@/components/WardrobeGrid';
import OutfitRecommendations from '@/components/OutfitRecommendations';
import SustainabilityScore from '@/components/SustainabilityScore';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddItemModal from '@/components/AddItemModal';

const Wardrobe = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <WeatherSummary />
      <TabNavigation />
      <CategoryFilter 
        onCategoryChange={setSelectedCategory} 
        selectedCategory={selectedCategory} 
      />
      <WardrobeGrid category={selectedCategory} />
      <OutfitRecommendations />
      <SustainabilityScore />
      
      {/* Mobile Add Item Button (Fixed) */}
      <div className="md:hidden fixed bottom-6 right-6">
        <Button 
          className="bg-primary hover:bg-indigo-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
          onClick={() => setIsAddItemModalOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      
      <AddItemModal 
        isOpen={isAddItemModalOpen} 
        onClose={() => setIsAddItemModalOpen(false)} 
      />
    </div>
  );
};

export default Wardrobe;
