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

/**
 * Analyze clothing image using Google Gemini API
 * @param imageData Base64 encoded image data
 * @returns Analysis results including category, type, material, etc.
 */
export async function analyzeClothingImage(imageData: string): Promise<ClothingAnalysisResult> {
  try {
    const response = await apiRequest('POST', '/api/analyze-clothing', { imageData });
    return await response.json();
  } catch (error) {
    console.error('Error analyzing clothing with Gemini:', error);
    throw new Error('Failed to analyze image. Please try again.');
  }
}

/**
 * Get a color class based on sustainability score for UI display
 * @param score Sustainability score (0-100)
 * @returns CSS class name for color
 */
export function getSustainabilityColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 65) return 'bg-green-500';
  if (score >= 50) return 'bg-yellow-500';
  if (score >= 35) return 'bg-orange-500';
  return 'bg-red-500';
}

/**
 * Format sustainability score as percentage
 * @param score Sustainability score (0-100)
 * @returns Formatted percentage string
 */
export function getSustainabilityPercentage(score: number): string {
  return `${Math.round(score)}%`;
}

/**
 * Generate outfit recommendations based on occasion and weather
 * @param occasion Occasion type (casual, formal, work, etc.)
 * @returns Array of recommended outfits
 */
export async function getOutfitRecommendations(occasion: string = 'casual'): Promise<any[]> {
  try {
    const response = await apiRequest('GET', `/api/recommendations?occasion=${occasion}`);
    return await response.json();
  } catch (error) {
    console.error('Error getting outfit recommendations:', error);
    throw new Error('Failed to get outfit recommendations. Please try again.');
  }
}

/**
 * Get sustainability analysis for a material
 * @param material Material name
 * @returns Analysis with score, explanation and tips
 */
export async function getMaterialSustainabilityAnalysis(material: string): Promise<{
  score: number,
  explanation: string,
  tips: string[]
}> {
  try {
    const response = await apiRequest('GET', `/api/sustainability/material?name=${encodeURIComponent(material)}`);
    return await response.json();
  } catch (error) {
    console.error('Error analyzing material sustainability:', error);
    return {
      score: 60,
      explanation: 'Could not analyze material sustainability.',
      tips: [
        'Wash at lower temperatures to save energy', 
        'Repair items instead of replacing them', 
        'Donate or recycle when no longer needed'
      ]
    };
  }
}