import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Upload } from "lucide-react";
import { analyzeClothingImage, ClothingAnalysisResult, getSustainabilityColor, getSustainabilityPercentage } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";

interface ClothingAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveItem?: (result: ClothingAnalysisResult & { imageData: string }) => void;
}

const ClothingAnalysisModal = ({ isOpen, onClose, onSaveItem }: ClothingAnalysisModalProps) => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ClothingAnalysisResult | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        // Extract the base64 data (remove the data:image/jpeg;base64, part)
        const base64Data = result.split(",")[1];
        setSelectedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    try {
      setAnalyzing(true);
      // Extract the base64 data (remove the data:image/jpeg;base64, part)
      const base64Data = selectedImage.split(",")[1];
      const result = await analyzeClothingImage(base64Data);
      setAnalysisResult(result);
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Could not analyze the image. Please try again.",
        variant: "destructive",
      });
      console.error("Analysis error:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveToWardrobe = () => {
    if (onSaveItem && analysisResult && selectedImage) {
      onSaveItem({
        ...analysisResult,
        imageData: selectedImage.split(",")[1], // Just the base64 data
      });
      onClose();
    }
  };

  const resetModal = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">AI Clothing Analysis</DialogTitle>
          <DialogDescription>
            Upload a clothing image to analyze its style, material, and sustainability score
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Image upload section */}
          <div className="flex flex-col items-center justify-center">
            {selectedImage ? (
              <>
                <img 
                  src={selectedImage} 
                  alt="Selected clothing" 
                  className="w-full h-auto max-h-[300px] object-contain rounded-md mb-4" 
                />
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedImage(null)}
                  className="w-full"
                >
                  Change Image
                </Button>
              </>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-8 h-[300px] w-full flex flex-col items-center justify-center text-center">
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-500 mb-4">Upload a clothing image to analyze</p>
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Button 
                  variant="secondary" 
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  Select Image
                </Button>
              </div>
            )}
          </div>

          {/* Analysis result section */}
          <div className="flex flex-col">
            {analyzing ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-sm text-gray-500 mb-2">Analyzing your clothing item...</p>
                <Progress value={60} className="w-full" />
              </div>
            ) : analysisResult ? (
              <div className="space-y-4">
                <h3 className="font-bold text-lg">{analysisResult.type}</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-100 p-2 rounded">
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{analysisResult.category}</p>
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <p className="text-sm text-gray-500">Color</p>
                    <p className="font-medium">{analysisResult.color}</p>
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <p className="text-sm text-gray-500">Material</p>
                    <p className="font-medium">{analysisResult.material}</p>
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <p className="text-sm text-gray-500">Style</p>
                    <p className="font-medium">{analysisResult.style}</p>
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <p className="text-sm text-gray-500">Occasion</p>
                    <p className="font-medium">{analysisResult.occasion}</p>
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <p className="text-sm text-gray-500">Season</p>
                    <p className="font-medium">{analysisResult.season}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-1">Sustainability Score</p>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getSustainabilityColor(analysisResult.sustainabilityScore)}`}
                      style={{ width: getSustainabilityPercentage(analysisResult.sustainabilityScore) }}
                    ></div>
                  </div>
                  <p className="text-sm text-right mt-1">
                    {getSustainabilityPercentage(analysisResult.sustainabilityScore)}
                  </p>
                </div>

                {onSaveItem && (
                  <Button 
                    className="w-full mt-4" 
                    onClick={handleSaveToWardrobe}
                  >
                    Add to My Wardrobe
                  </Button>
                )}
              </div>
            ) : selectedImage ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Button onClick={analyzeImage} className="w-full">
                  Analyze Image
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <p>Select an image to see AI-powered analysis</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClothingAnalysisModal;