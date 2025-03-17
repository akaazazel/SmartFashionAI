import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeClothingImage, generateOutfitRecommendations, analyzeSustainability } from "./gemini";
import { getWeatherData, getFiveDayForecast } from "./openweather";
import { z } from "zod";
import { 
  insertWardrobeItemSchema, 
  insertOutfitSchema, 
  insertWeatherPreferencesSchema
} from "@shared/schema";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  // API routes
  const apiRouter = app.route("/api");

  // Wardrobe items endpoints
  app.get("/api/wardrobe", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.user!.id;
      const items = await storage.getAllWardrobeItems(userId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wardrobe items", error: (error as Error).message });
    }
  });

  app.get("/api/wardrobe/:id", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const itemId = parseInt(req.params.id);
      const item = await storage.getWardrobeItem(itemId);
      
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      // Verify that the item belongs to the authenticated user
      if (item.userId !== req.user!.id) {
        return res.status(403).json({ message: "Forbidden: You don't have permission to access this item" });
      }
      
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wardrobe item", error: (error as Error).message });
    }
  });

  app.post("/api/wardrobe", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const validatedData = insertWardrobeItemSchema.parse(req.body);
      
      // Set the user ID from the authenticated user
      validatedData.userId = req.user!.id;
      
      // Process image with AI if imageData is provided
      if (validatedData.imageData) {
        try {
          const analysisResult = await analyzeClothingImage(validatedData.imageData);
          
          // Update item with AI analysis results
          validatedData.attributes = analysisResult.attributes;
          
          // If certain fields are not provided, use AI detected values
          if (!validatedData.color) validatedData.color = analysisResult.color;
          if (!validatedData.material) validatedData.material = analysisResult.material;
          if (!validatedData.type) validatedData.type = analysisResult.type;
          if (!validatedData.style) validatedData.style = analysisResult.style;
          
          // Calculate sustainability score based on material
          validatedData.sustainabilityScore = analysisResult.sustainabilityScore;
        } catch (error) {
          console.error("AI analysis failed:", error);
          // Continue without AI analysis if it fails
        }
      }
      
      const newItem = await storage.createWardrobeItem(validatedData);
      res.status(201).json(newItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create wardrobe item", error: (error as Error).message });
    }
  });

  app.delete("/api/wardrobe/:id", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const itemId = parseInt(req.params.id);
      
      // Get the item first to check ownership
      const item = await storage.getWardrobeItem(itemId);
      
      // Check if item exists
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      // Verify that the item belongs to the authenticated user
      if (item.userId !== req.user!.id) {
        return res.status(403).json({ message: "Forbidden: You don't have permission to delete this item" });
      }
      
      await storage.deleteWardrobeItem(itemId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete wardrobe item", error: (error as Error).message });
    }
  });

  // Outfit endpoints
  app.get("/api/outfits", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.user!.id;
      const outfits = await storage.getAllOutfits(userId);
      res.json(outfits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch outfits", error: (error as Error).message });
    }
  });

  app.post("/api/outfits", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const validatedData = insertOutfitSchema.parse(req.body);
      
      // Set the user ID from the authenticated user
      validatedData.userId = req.user!.id;
      
      const newOutfit = await storage.createOutfit(validatedData);
      res.status(201).json(newOutfit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create outfit", error: (error as Error).message });
    }
  });

  // Weather endpoint
  app.get("/api/weather", async (req, res) => {
    try {
      const location = req.query.location as string || "New York";
      const weatherData = await getWeatherData(location);
      res.json(weatherData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weather data", error: (error as Error).message });
    }
  });
  
  // Weather forecast endpoint
  app.get("/api/forecast", async (req, res) => {
    try {
      const location = req.query.location as string || "New York";
      const forecastData = await getFiveDayForecast(location);
      res.json(forecastData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch forecast data", error: (error as Error).message });
    }
  });
  
  // Analyze clothing endpoint (using Gemini)
  app.post("/api/analyze-clothing", async (req, res) => {
    try {
      const { imageData } = req.body;
      
      if (!imageData) {
        return res.status(400).json({ message: "Image data is required" });
      }
      
      const analysisResult = await analyzeClothingImage(imageData);
      res.json(analysisResult);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze clothing image", error: (error as Error).message });
    }
  });

  // Recommendations endpoint
  app.get("/api/recommendations", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.user!.id;
      const occasion = req.query.occasion as string || 'casual';
      const season = req.query.season as string;
      
      // Get weather data
      const userPrefs = await storage.getWeatherPreferences(userId);
      const location = userPrefs?.location || "New York";
      const weatherData = await getWeatherData(location);
      
      // Get all wardrobe items
      const wardrobeItems = await storage.getAllWardrobeItems(userId);
      
      if (wardrobeItems.length === 0) {
        return res.json([]);
      }
      
      // Use Google Gemini to generate intelligent outfit recommendations
      try {
        const aiOutfits = await generateOutfitRecommendations(
          wardrobeItems,
          weatherData,
          occasion
        );
        
        if (aiOutfits.length > 0) {
          return res.json(aiOutfits);
        }
      } catch (aiError) {
        console.error("AI recommendation failed, falling back to basic logic:", aiError);
      }
      
      // Fallback to basic recommendation logic if AI fails
      const recommendedOutfits = [];
      
      // Basic logic based on weather temperature
      if (weatherData.temperature > 25) {
        // Summer outfits - focus on lightweight clothing
        const relevantItems = wardrobeItems.filter(item => 
          item.season === 'summer' || item.season === 'all-season'
        );
        
        // Group items by category
        const tops = relevantItems.filter(item => item.category === 'tops' || item.category?.toLowerCase() === 'tops');
        const bottoms = relevantItems.filter(item => item.category === 'bottoms' || item.category?.toLowerCase() === 'bottoms');
        
        // Create outfit combinations
        for (let i = 0; i < Math.min(tops.length, 3); i++) {
          if (i < bottoms.length) {
            const top = tops[i];
            const bottom = bottoms[i];
            
            recommendedOutfits.push({
              name: `Summer ${occasion} Outfit ${i+1}`,
              items: [top.id, bottom.id],
              sustainabilityScore: Math.round((
                (top.sustainabilityScore || 60) + 
                (bottom.sustainabilityScore || 60)
              ) / 2),
              occasion: occasion,
              season: 'summer',
              rationale: `Light outfit suitable for hot weather (${weatherData.temperature}°C)`
            });
          }
        }
      } else if (weatherData.temperature < 10) {
        // Winter outfits - focus on layers and warmth
        const relevantItems = wardrobeItems.filter(item => 
          item.season === 'winter' || item.season === 'all-season'
        );
        
        const tops = relevantItems.filter(item => item.category === 'tops' || item.category?.toLowerCase() === 'tops');
        const bottoms = relevantItems.filter(item => item.category === 'bottoms' || item.category?.toLowerCase() === 'bottoms');
        const outerwear = relevantItems.filter(item => item.category === 'outerwear' || item.category?.toLowerCase() === 'outerwear');
        
        for (let i = 0; i < 3; i++) {
          const outfitItems = [];
          let totalScore = 0;
          let itemCount = 0;
          
          if (i < tops.length) {
            outfitItems.push(tops[i].id);
            totalScore += tops[i].sustainabilityScore || 60;
            itemCount++;
          }
          
          if (i < bottoms.length) {
            outfitItems.push(bottoms[i].id);
            totalScore += bottoms[i].sustainabilityScore || 60;
            itemCount++;
          }
          
          if (outerwear.length > 0 && i < outerwear.length) {
            outfitItems.push(outerwear[i].id);
            totalScore += outerwear[i].sustainabilityScore || 60;
            itemCount++;
          }
          
          if (outfitItems.length >= 2) {
            recommendedOutfits.push({
              name: `Winter ${occasion} Outfit ${i+1}`,
              items: outfitItems,
              sustainabilityScore: Math.round(totalScore / itemCount),
              occasion: occasion,
              season: 'winter',
              rationale: `Warm layered outfit for cold weather (${weatherData.temperature}°C)`
            });
          }
        }
      } else {
        // Mild weather outfits (spring/fall)
        const seasonName = weatherData.temperature >= 15 ? 'Spring' : 'Fall';
        const relevantItems = wardrobeItems.filter(item => 
          item.season === seasonName.toLowerCase() || 
          item.season === 'all-season'
        );
        
        const tops = relevantItems.filter(item => item.category === 'tops' || item.category?.toLowerCase() === 'tops');
        const bottoms = relevantItems.filter(item => item.category === 'bottoms' || item.category?.toLowerCase() === 'bottoms');
        const accessories = relevantItems.filter(item => item.category === 'accessories' || item.category?.toLowerCase() === 'accessories');
        
        for (let i = 0; i < 3; i++) {
          const outfitItems = [];
          let totalScore = 0;
          let itemCount = 0;
          
          if (i < tops.length) {
            outfitItems.push(tops[i].id);
            totalScore += tops[i].sustainabilityScore || 60;
            itemCount++;
          }
          
          if (i < bottoms.length) {
            outfitItems.push(bottoms[i].id);
            totalScore += bottoms[i].sustainabilityScore || 60;
            itemCount++;
          }
          
          // Add an accessory if available
          if (accessories.length > 0 && i < accessories.length) {
            outfitItems.push(accessories[i].id);
            totalScore += accessories[i].sustainabilityScore || 60;
            itemCount++;
          }
          
          if (outfitItems.length >= 2) {
            recommendedOutfits.push({
              name: `${seasonName} ${occasion} Outfit ${i+1}`,
              items: outfitItems,
              sustainabilityScore: Math.round(totalScore / itemCount),
              occasion: occasion,
              season: seasonName.toLowerCase(),
              rationale: `Comfortable outfit for mild ${seasonName.toLowerCase()} weather (${weatherData.temperature}°C)`
            });
          }
        }
      }
      
      res.json(recommendedOutfits);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate recommendations", error: (error as Error).message });
    }
  });

  // Weather preferences endpoint
  app.post("/api/weather-preferences", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const validatedData = insertWeatherPreferencesSchema.parse(req.body);
      
      // Set the user ID from the authenticated user
      validatedData.userId = req.user!.id;
      
      const preferences = await storage.setWeatherPreferences(validatedData);
      res.status(201).json(preferences);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save weather preferences", error: (error as Error).message });
    }
  });
  
  // Material sustainability analysis endpoint
  app.get("/api/sustainability/material", async (req, res) => {
    try {
      const material = req.query.name as string;
      
      if (!material) {
        return res.status(400).json({ message: "Material name is required" });
      }
      
      const sustainabilityInfo = await analyzeSustainability(material);
      res.json(sustainabilityInfo);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze material sustainability", error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
