import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { WardrobeItem } from '@shared/schema';
import { Check } from 'lucide-react';

const SustainabilityScore = () => {
  const { data: wardrobeItems, isLoading } = useQuery<WardrobeItem[]>({
    queryKey: ['/api/wardrobe'],
  });

  // Calculate overall sustainability score
  const calculateOverallScore = (): number => {
    if (!wardrobeItems?.length) return 0;
    
    const total = wardrobeItems.reduce((sum, item) => sum + (item.sustainabilityScore || 0), 0);
    return Math.round(total / wardrobeItems.length);
  };

  // Calculate material percentages
  const calculateMaterialPercentages = (): Record<string, number> => {
    if (!wardrobeItems?.length) return {};
    
    const materials: Record<string, number> = {};
    
    wardrobeItems.forEach(item => {
      if (item.material) {
        materials[item.material] = (materials[item.material] || 0) + 1;
      }
    });
    
    // Convert counts to percentages
    Object.keys(materials).forEach(material => {
      materials[material] = Math.round((materials[material] / wardrobeItems.length) * 100);
    });
    
    return materials;
  };

  const sustainabilityScore = calculateOverallScore();
  const materialPercentages = calculateMaterialPercentages();
  
  // Sort materials by percentage (descending)
  const sortedMaterials = Object.entries(materialPercentages)
    .sort(([, percentA], [, percentB]) => percentB - percentA)
    .slice(0, 4); // Take top 4 materials

  return (
    <Card className="bg-white rounded-xl shadow-sm mb-10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Sustainability Impact</h2>
          <Button variant="link" className="text-primary hover:text-indigo-700 font-medium text-sm">
            Learn More <i className="fas fa-external-link-alt ml-1 text-xs"></i>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#e6e6e6" strokeWidth="2"></circle>
                <circle 
                  cx="18" 
                  cy="18" 
                  r="16" 
                  fill="none" 
                  stroke={sustainabilityScore >= 80 ? "#10B981" : sustainabilityScore >= 60 ? "#FBBF24" : "#EF4444"} 
                  strokeWidth="2" 
                  strokeDasharray="100, 100" 
                  strokeDashoffset={100 - sustainabilityScore}
                ></circle>
                <text 
                  x="18" 
                  y="18" 
                  textAnchor="middle" 
                  dy=".3em" 
                  fontSize="10" 
                  fill={sustainabilityScore >= 80 ? "#10B981" : sustainabilityScore >= 60 ? "#FBBF24" : "#EF4444"} 
                  fontWeight="bold"
                >
                  {sustainabilityScore}%
                </text>
              </svg>
            </div>
            <p className="text-center mt-2 font-medium">Wardrobe Score</p>
            <p className="text-center text-xs text-gray-500 mt-1">Your wardrobe is more sustainable than {sustainabilityScore}% of users</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium mb-3">Eco-Friendly Materials</h3>
            <div className="space-y-2">
              {sortedMaterials.length > 0 ? (
                sortedMaterials.map(([material, percentage]) => (
                  <div key={material}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{material}</span>
                      <span>{percentage}%</span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-2 bg-gray-200"
                      indicatorClassName={
                        material.toLowerCase().includes('organic') || 
                        material.toLowerCase().includes('cotton') ||
                        material.toLowerCase().includes('wool') ||
                        material.toLowerCase().includes('linen') ? 
                        'bg-emerald-500' : 'bg-yellow-500'
                      }
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No wardrobe data available</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Sustainability Tips</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Check className="text-emerald-500 mt-1 mr-2 h-4 w-4" />
                <span>Consider replacing your synthetic items with organic alternatives</span>
              </li>
              <li className="flex items-start">
                <Check className="text-emerald-500 mt-1 mr-2 h-4 w-4" />
                <span>Your cotton t-shirts could last longer with proper care</span>
              </li>
              <li className="flex items-start">
                <Check className="text-emerald-500 mt-1 mr-2 h-4 w-4" />
                <span>Explore brands with eco-friendly leather alternatives</span>
              </li>
              <li className="flex items-start mt-4">
                <Button variant="link" className="text-primary hover:text-indigo-700 font-medium text-sm p-0">
                  View All Recommendations
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SustainabilityScore;
