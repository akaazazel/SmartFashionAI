import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddItemModal from './AddItemModal';

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void;
  selectedCategory: string;
}

const CategoryFilter = ({ onCategoryChange, selectedCategory }: CategoryFilterProps) => {
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  const categories = [
    'All Items',
    'Tops',
    'Bottoms',
    'Dresses',
    'Outerwear',
    'Shoes',
    'Accessories'
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">My Wardrobe</h2>
        <Button 
          onClick={() => setIsAddItemModalOpen(true)}
          className="bg-primary hover:bg-indigo-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          <span>Add Item</span>
        </Button>
      </div>
      
      <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className={`
              ${selectedCategory === category 
                ? "bg-primary text-white" 
                : "bg-white border border-gray-200 hover:bg-gray-50"}
              px-4 py-2 rounded-full text-sm font-medium
            `}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      
      <AddItemModal isOpen={isAddItemModalOpen} onClose={() => setIsAddItemModalOpen(false)} />
    </div>
  );
};

export default CategoryFilter;
