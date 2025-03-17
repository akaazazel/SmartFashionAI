import { apiRequest } from './queryClient';

export interface ClothingAnalysisResult {
  category: string;
  type: string;
  color: string;
  material: string;
  style: string;
  occasion: string;
  season: string;
  sustainabilityScore: number;
  attributes: any;
}

export async function analyzeClothingImage(imageData: string): Promise<ClothingAnalysisResult> {
  // This function sends the image to our backend API which uses OpenAI
  try {
    const response = await apiRequest('POST', '/api/analyze-clothing', { imageData });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing clothing image:', error);
    throw error;
  }
}

export function getSustainabilityColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500'; // High sustainability
  if (score >= 60) return 'bg-yellow-500'; // Medium sustainability
  return 'bg-red-500'; // Low sustainability
}

export function getSustainabilityPercentage(score: number): string {
  return `${score}%`;
}
