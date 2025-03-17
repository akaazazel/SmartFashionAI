import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy-key" });

// Clothing Image Analysis
export interface ClothingAnalysisResult {
  category: string;       // tops, bottoms, dresses, outerwear, shoes, accessories
  type: string;           // t-shirt, jeans, sweater, etc.
  color: string;          // main color
  material: string;       // cotton, denim, leather, etc.
  style: string;          // casual, formal, sporty, etc.
  occasion: string;       // work, casual, party, etc.
  season: string;         // summer, winter, spring, fall, all-season
  sustainabilityScore: number; // 0-100
  attributes: any;        // Additional details detected
}

export async function analyzeClothingImage(base64Image: string): Promise<ClothingAnalysisResult> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a fashion expert AI assistant analyzing clothing images. Provide detailed information about the garment in JSON format."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this clothing item in detail. Identify the category (tops, bottoms, dresses, outerwear, shoes, accessories), type (specific name like t-shirt, jeans, etc.), primary color, material, style (casual, formal, etc.), occasions it's suitable for, appropriate seasons, and provide a sustainability score from 0-100 based on the likely materials. Return your analysis as a JSON object with the fields: category, type, color, material, style, occasion, season, sustainabilityScore."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    const result = JSON.parse(response.choices[0].message.content);
    
    // Calculate sustainability score based on material if not already provided
    if (!result.sustainabilityScore) {
      const materialScores: Record<string, number> = {
        "cotton": 80,
        "organic cotton": 95,
        "wool": 85,
        "linen": 90,
        "hemp": 95,
        "polyester": 50,
        "nylon": 45,
        "acrylic": 40,
        "spandex": 30,
        "leather": 60,
        "faux leather": 50,
        "denim": 70
      };
      
      // Default score is 60
      result.sustainabilityScore = materialScores[result.material.toLowerCase()] || 60;
    }
    
    // Add more detailed attributes
    result.attributes = {
      ...result,
      detectedBy: "OpenAI Vision",
      confidenceLevel: "high"
    };
    
    return result as ClothingAnalysisResult;
  } catch (error) {
    console.error("Error analyzing clothing image:", error);
    // Return default values if AI analysis fails
    return {
      category: "unknown",
      type: "unknown",
      color: "unknown",
      material: "unknown",
      style: "casual",
      occasion: "casual",
      season: "all-season",
      sustainabilityScore: 60,
      attributes: { detectedBy: "default", confidenceLevel: "low" }
    };
  }
}

// Outfit Recommendation
export async function generateOutfitRecommendations(
  wardrobeItems: any[],
  weather: any,
  occasion: string = "casual"
): Promise<any[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a fashion stylist AI that creates outfit recommendations based on wardrobe items, weather conditions, and occasions."
        },
        {
          role: "user",
          content: `Create 3 outfit recommendations based on the following:
          
          Wardrobe items: ${JSON.stringify(wardrobeItems)}
          Weather: ${JSON.stringify(weather)}
          Occasion: ${occasion}
          
          For each outfit, include: a name, list of item IDs to wear together, sustainability score, suitable season, and rationale. Return as JSON array.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.outfits || [];
  } catch (error) {
    console.error("Error generating outfit recommendations:", error);
    return [];
  }
}

// Sustainability Analysis
export async function analyzeSustainability(material: string): Promise<{
  score: number,
  explanation: string,
  tips: string[]
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in sustainable fashion analyzing the environmental impact of clothing materials."
        },
        {
          role: "user",
          content: `Analyze the sustainability of clothing made from ${material}. Provide a sustainability score from 0-100, a brief explanation, and 3 tips for sustainable care or alternatives. Format as JSON with fields: score, explanation, tips (array).`
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error analyzing sustainability:", error);
    return {
      score: 60,
      explanation: "Could not analyze the sustainability of this material.",
      tips: ["Wash at lower temperatures", "Repair instead of replace", "Donate when no longer needed"]
    };
  }
}
