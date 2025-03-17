import { useState } from 'react';
import TabNavigation from '@/components/TabNavigation';
import SustainabilityScore from '@/components/SustainabilityScore';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { WardrobeItem } from '@shared/schema';
import { getSustainabilityColor } from '@/lib/openai';

const Sustainability = () => {
  const { data: wardrobeItems, isLoading } = useQuery<WardrobeItem[]>({
    queryKey: ['/api/wardrobe'],
  });

  // Calculate material stats
  const getMaterialStats = () => {
    if (!wardrobeItems?.length) return [];
    
    const materialCount: Record<string, number> = {};
    
    wardrobeItems.forEach(item => {
      if (item.material) {
        materialCount[item.material] = (materialCount[item.material] || 0) + 1;
      }
    });
    
    return Object.entries(materialCount)
      .map(([material, count]) => ({
        material,
        count,
        percentage: Math.round((count / wardrobeItems.length) * 100),
        sustainabilityScore: getSustainabilityScoreForMaterial(material)
      }))
      .sort((a, b) => b.count - a.count);
  };

  // Helper function to get sustainability score by material
  const getSustainabilityScoreForMaterial = (material: string): number => {
    const materialScores: Record<string, number> = {
      'cotton': 80,
      'organic cotton': 95,
      'wool': 85,
      'linen': 90,
      'hemp': 95,
      'polyester': 50,
      'nylon': 45,
      'acrylic': 40,
      'spandex': 30,
      'leather': 60,
      'faux leather': 50,
      'denim': 70,
      'canvas': 85
    };
    
    const lowerCaseMaterial = material.toLowerCase();
    
    for (const [key, score] of Object.entries(materialScores)) {
      if (lowerCaseMaterial.includes(key)) {
        return score;
      }
    }
    
    return 60; // Default score
  };

  // Get the tips based on material stats
  const getSustainabilityTips = (materialStats: any[]) => {
    const tips = [];
    
    // Find the least sustainable materials
    const leastSustainable = materialStats
      .filter(stat => stat.percentage > 5) // Only consider materials that make up more than 5% of wardrobe
      .sort((a, b) => a.sustainabilityScore - b.sustainabilityScore)
      .slice(0, 2);
    
    if (leastSustainable.length > 0) {
      leastSustainable.forEach(material => {
        tips.push(`Consider alternatives to ${material.material.toLowerCase()} which has a lower sustainability score.`);
      });
    }
    
    // Add some general tips
    tips.push(
      "Wash clothes at lower temperatures to reduce energy consumption.",
      "Repair items instead of replacing them to extend their lifecycle.",
      "Donate or recycle clothing you no longer wear.",
      "Choose quality over quantity for new purchases.",
      "Look for certifications like GOTS, Oeko-Tex, or Fair Trade when shopping."
    );
    
    return tips;
  };

  const materialStats = getMaterialStats();
  const sustainabilityTips = getSustainabilityTips(materialStats);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Sustainability</h1>
      <TabNavigation />
      
      <SustainabilityScore />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Material Breakdown</h2>
            <div className="space-y-4">
              {materialStats.length === 0 ? (
                <p className="text-gray-500">No wardrobe data available</p>
              ) : (
                materialStats.map(stat => (
                  <div key={stat.material}>
                    <div className="flex justify-between mb-1">
                      <Label className="text-sm font-medium">{stat.material}</Label>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{stat.percentage}% of wardrobe</span>
                        <span className={`${getSustainabilityColor(stat.sustainabilityScore)} text-white text-xs px-2 py-0.5 rounded-full`}>
                          {stat.sustainabilityScore}%
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={stat.percentage} 
                      className="h-2"
                      indicatorClassName={getSustainabilityColor(stat.sustainabilityScore)}
                    />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Sustainability Tips</h2>
            <ul className="space-y-3">
              {sustainabilityTips.map((tip, index) => (
                <li key={index} className="flex items-start text-sm">
                  <i className="fas fa-check-circle text-emerald-500 mt-1 mr-2"></i>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-10">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Sustainable Fashion Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-2">Eco-Friendly Materials</h3>
              <p className="text-sm text-gray-600 mb-3">
                Choose these materials for a more sustainable wardrobe.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <i className="fas fa-leaf text-emerald-500 mt-1 mr-2"></i>
                  <span>Organic Cotton - No harmful pesticides</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-leaf text-emerald-500 mt-1 mr-2"></i>
                  <span>Hemp - Requires minimal water and no pesticides</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-leaf text-emerald-500 mt-1 mr-2"></i>
                  <span>Linen - Biodegradable and low-impact production</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-leaf text-emerald-500 mt-1 mr-2"></i>
                  <span>Recycled Polyester - Reduces landfill waste</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">Clothing Care</h3>
              <p className="text-sm text-gray-600 mb-3">
                Extend the life of your clothes with proper care.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <i className="fas fa-tint text-blue-500 mt-1 mr-2"></i>
                  <span>Wash less frequently and at lower temperatures</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-tint text-blue-500 mt-1 mr-2"></i>
                  <span>Air dry instead of using the dryer</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-tint text-blue-500 mt-1 mr-2"></i>
                  <span>Use eco-friendly detergents</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-tint text-blue-500 mt-1 mr-2"></i>
                  <span>Repair rather than replace damaged items</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">Sustainable Brands</h3>
              <p className="text-sm text-gray-600 mb-3">
                Support these brands that prioritize sustainability.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <i className="fas fa-store text-purple-500 mt-1 mr-2"></i>
                  <span>Patagonia - Recycled materials and repair program</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-store text-purple-500 mt-1 mr-2"></i>
                  <span>Reformation - Carbon-neutral clothing production</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-store text-purple-500 mt-1 mr-2"></i>
                  <span>Everlane - Transparent pricing and ethical factories</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-store text-purple-500 mt-1 mr-2"></i>
                  <span>Veja - Eco-friendly sneakers using sustainable materials</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sustainability;
