import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize the Gemini API with the provided API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy-key");

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
    // Use Gemini Pro Vision model for image analysis
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    // Configure safety settings
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    // Generate content with the model
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: "Analyze this clothing item in detail. Identify the category (tops, bottoms, dresses, outerwear, shoes, accessories), type (specific name like t-shirt, jeans, etc.), primary color, material, style (casual, formal, etc.), occasions it's suitable for, appropriate seasons, and provide a sustainability score from 0-100 based on the likely materials. Return your analysis as a JSON object with the fields: category, type, color, material, style, occasion, season, sustainabilityScore." },
            { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 32,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings,
    });

    // Extract and parse the response
    const responseText = result.response.text();
    // Extract JSON from the response (handles cases where the model might add text before/after JSON)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : "{}";
    const parsedResult = JSON.parse(jsonStr);
    
    // Calculate sustainability score based on material if not already provided
    if (!parsedResult.sustainabilityScore) {
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
      parsedResult.sustainabilityScore = materialScores[parsedResult.material?.toLowerCase()] || 60;
    }
    
    // Add more detailed attributes
    parsedResult.attributes = {
      ...parsedResult,
      detectedBy: "Google Gemini Vision",
      confidenceLevel: "high"
    };
    
    return parsedResult as ClothingAnalysisResult;
  } catch (error) {
    console.error("Error analyzing clothing image with Gemini:", error);
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
    // Use Gemini Pro for text generation
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Create 3 outfit recommendations based on the following:
    
    Wardrobe items: ${JSON.stringify(wardrobeItems)}
    Weather: ${JSON.stringify(weather)}
    Occasion: ${occasion}
    
    For each outfit, include: a name, list of item IDs to wear together, sustainability score, suitable season, and rationale. Return as JSON array with the format: 
    {
      "outfits": [
        {
          "name": "Outfit Name",
          "items": [1, 2, 3],
          "sustainabilityScore": 85,
          "season": "fall",
          "rationale": "Explanation for why these items work together"
        }
      ]
    }`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    // Extract and parse the response
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : '{"outfits":[]}';
    const parsedResult = JSON.parse(jsonStr);
    
    return parsedResult.outfits || [];
  } catch (error) {
    console.error("Error generating outfit recommendations with Gemini:", error);
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
    // Use Gemini Pro for text generation
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Analyze the sustainability of clothing made from ${material}. Provide a sustainability score from 0-100, a brief explanation, and 3 tips for sustainable care or alternatives. Format as JSON with fields: score, explanation, tips (array).`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        topK: 32,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // Extract and parse the response
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : "{}";
    const parsedResult = JSON.parse(jsonStr);
    
    return {
      score: parsedResult.score || 60,
      explanation: parsedResult.explanation || "Could not analyze the sustainability of this material.",
      tips: parsedResult.tips || ["Wash at lower temperatures", "Repair instead of replace", "Donate when no longer needed"]
    };
  } catch (error) {
    console.error("Error analyzing sustainability with Gemini:", error);
    return {
      score: 60,
      explanation: "Could not analyze the sustainability of this material.",
      tips: ["Wash at lower temperatures", "Repair instead of replace", "Donate when no longer needed"]
    };
  }
}