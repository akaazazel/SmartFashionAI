import { useState } from 'react';
import WeatherSummary from '@/components/WeatherSummary';
import TabNavigation from '@/components/TabNavigation';
import CategoryFilter from '@/components/CategoryFilter';
import WardrobeGrid from '@/components/WardrobeGrid';
import OutfitRecommendations from '@/components/OutfitRecommendations';
import SustainabilityScore from '@/components/SustainabilityScore';
import { Button } from '@/components/ui/button';
import { Plus, Camera, Upload } from 'lucide-react';
import AddItemModal from '@/components/AddItemModal';
import ClothingAnalysisModal from '@/components/ClothingAnalysisModal';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { ClothingAnalysisResult } from '@/lib/gemini';
import type { InsertWardrobeItem } from '@shared/schema';

const Wardrobe = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSaveAnalyzedItem = async (result: ClothingAnalysisResult & { imageData: string }) => {
    try {
      // Create wardrobe item from analysis result
      const newItem: InsertWardrobeItem = {
        userId: 0, // Will be overwritten by the server with authenticated user's ID
        name: result.type ? `${result.color || 'Unknown'} ${result.type}` : 'New Item',
        category: result.category || 'other', // Make sure category is not empty
        type: result.type || 'clothing', // Make sure type is not empty
        // Optional fields
        color: result.color || null,
        material: result.material || null,
        style: result.style || null,
        occasion: result.occasion || null,
        season: result.season || null,
        imageData: result.imageData || null,
        sustainabilityScore: typeof result.sustainabilityScore === 'number' ? result.sustainabilityScore : null,
        attributes: result.attributes || {},
        imageUrl: null,
        lastWorn: null
      };

      console.log('Sending wardrobe item:', newItem);
      const response = await apiRequest('POST', '/api/wardrobe', newItem);
      
      if (response.ok) {
        toast({
          title: "Item added successfully",
          description: "Your wardrobe item has been added with AI analysis",
        });
        
        // Invalidate wardrobe query to refresh the list
        queryClient.invalidateQueries({ queryKey: ['/api/wardrobe'] });
      } else {
        const errorData = await response.json();
        console.error('API error:', errorData);
        throw new Error(errorData.message || 'Failed to add item');
      }
    } catch (error) {
      console.error('Error saving analyzed item:', error);
      toast({
        title: "Error saving item",
        description: error instanceof Error ? error.message : "There was a problem adding this item to your wardrobe",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <WeatherSummary />
      <TabNavigation />
      
      {/* Action buttons */}
      <div className="flex justify-between items-center mb-6">
        <CategoryFilter 
          onCategoryChange={setSelectedCategory} 
          selectedCategory={selectedCategory} 
        />
        <div className="hidden md:flex space-x-3">
          <Button 
            variant="outline"
            onClick={() => setIsAnalysisModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Camera className="h-4 w-4" />
            AI Analysis
          </Button>
          <Button 
            onClick={() => setIsAddItemModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>
      
      <WardrobeGrid category={selectedCategory} />
      <OutfitRecommendations />
      <SustainabilityScore />
      
      {/* Mobile Action Buttons (Fixed) */}
      <div className="md:hidden fixed bottom-6 right-6 flex flex-col space-y-4">
        <Button 
          className="bg-secondary hover:bg-secondary/80 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
          onClick={() => setIsAnalysisModalOpen(true)}
        >
          <Camera className="h-6 w-6" />
        </Button>
        <Button 
          className="bg-primary hover:bg-primary/80 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
          onClick={() => setIsAddItemModalOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Modals */}
      <AddItemModal 
        isOpen={isAddItemModalOpen} 
        onClose={() => setIsAddItemModalOpen(false)} 
      />
      
      <ClothingAnalysisModal 
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        onSaveItem={handleSaveAnalyzedItem}
      />
    </div>
  );
};

export default Wardrobe;
