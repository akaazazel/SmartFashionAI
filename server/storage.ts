import { 
  type User, type InsertUser, 
  type WardrobeItem, type InsertWardrobeItem,
  type Outfit, type InsertOutfit,
  type WeatherPreference, type InsertWeatherPreference
} from "@shared/schema";

// Storage interface for CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Wardrobe item operations
  getAllWardrobeItems(userId: number): Promise<WardrobeItem[]>;
  getWardrobeItem(id: number): Promise<WardrobeItem | undefined>;
  createWardrobeItem(item: InsertWardrobeItem): Promise<WardrobeItem>;
  updateWardrobeItem(id: number, item: Partial<InsertWardrobeItem>): Promise<WardrobeItem | undefined>;
  deleteWardrobeItem(id: number): Promise<void>;
  
  // Outfit operations
  getAllOutfits(userId: number): Promise<Outfit[]>;
  getOutfit(id: number): Promise<Outfit | undefined>;
  createOutfit(outfit: InsertOutfit): Promise<Outfit>;
  updateOutfit(id: number, outfit: Partial<InsertOutfit>): Promise<Outfit | undefined>;
  deleteOutfit(id: number): Promise<void>;
  
  // Weather preferences operations
  getWeatherPreferences(userId: number): Promise<WeatherPreference | undefined>;
  setWeatherPreferences(preferences: InsertWeatherPreference): Promise<WeatherPreference>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private wardrobeItems: Map<number, WardrobeItem>;
  private outfits: Map<number, Outfit>;
  private weatherPreferences: Map<number, WeatherPreference>;
  
  private userIdCounter: number;
  private wardrobeItemIdCounter: number;
  private outfitIdCounter: number;
  private weatherPrefIdCounter: number;

  constructor() {
    this.users = new Map();
    this.wardrobeItems = new Map();
    this.outfits = new Map();
    this.weatherPreferences = new Map();
    
    this.userIdCounter = 1;
    this.wardrobeItemIdCounter = 1;
    this.outfitIdCounter = 1;
    this.weatherPrefIdCounter = 1;
    
    // Initialize with a default user
    this.createUser({
      username: "emma",
      password: "password123",
      displayName: "Emma Wilson",
      email: "emma@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80"
    });
    
    // Initialize with sample wardrobe items
    this.createSampleWardrobeItems();
    this.createSampleOutfits();
    
    // Set default weather preferences
    this.setWeatherPreferences({
      userId: 1,
      location: "New York",
      unit: "metric",
      minTemperature: 15,
      maxTemperature: 25
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Wardrobe item operations
  async getAllWardrobeItems(userId: number): Promise<WardrobeItem[]> {
    return Array.from(this.wardrobeItems.values())
      .filter(item => item.userId === userId);
  }
  
  async getWardrobeItem(id: number): Promise<WardrobeItem | undefined> {
    return this.wardrobeItems.get(id);
  }
  
  async createWardrobeItem(item: InsertWardrobeItem): Promise<WardrobeItem> {
    const id = this.wardrobeItemIdCounter++;
    const now = new Date();
    const wardrobeItem: WardrobeItem = { 
      ...item, 
      id, 
      createdAt: now 
    };
    this.wardrobeItems.set(id, wardrobeItem);
    return wardrobeItem;
  }
  
  async updateWardrobeItem(id: number, item: Partial<InsertWardrobeItem>): Promise<WardrobeItem | undefined> {
    const existingItem = this.wardrobeItems.get(id);
    if (!existingItem) return undefined;
    
    const updatedItem: WardrobeItem = { ...existingItem, ...item };
    this.wardrobeItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async deleteWardrobeItem(id: number): Promise<void> {
    this.wardrobeItems.delete(id);
  }
  
  // Outfit operations
  async getAllOutfits(userId: number): Promise<Outfit[]> {
    return Array.from(this.outfits.values())
      .filter(outfit => outfit.userId === userId);
  }
  
  async getOutfit(id: number): Promise<Outfit | undefined> {
    return this.outfits.get(id);
  }
  
  async createOutfit(outfit: InsertOutfit): Promise<Outfit> {
    const id = this.outfitIdCounter++;
    const now = new Date();
    const newOutfit: Outfit = { 
      ...outfit, 
      id, 
      createdAt: now 
    };
    this.outfits.set(id, newOutfit);
    return newOutfit;
  }
  
  async updateOutfit(id: number, outfit: Partial<InsertOutfit>): Promise<Outfit | undefined> {
    const existingOutfit = this.outfits.get(id);
    if (!existingOutfit) return undefined;
    
    const updatedOutfit: Outfit = { ...existingOutfit, ...outfit };
    this.outfits.set(id, updatedOutfit);
    return updatedOutfit;
  }
  
  async deleteOutfit(id: number): Promise<void> {
    this.outfits.delete(id);
  }
  
  // Weather preferences operations
  async getWeatherPreferences(userId: number): Promise<WeatherPreference | undefined> {
    return Array.from(this.weatherPreferences.values())
      .find(pref => pref.userId === userId);
  }
  
  async setWeatherPreferences(preferences: InsertWeatherPreference): Promise<WeatherPreference> {
    // Check if preferences already exist for this user
    const existingPrefs = await this.getWeatherPreferences(preferences.userId);
    
    if (existingPrefs) {
      // Update existing preferences
      const updatedPrefs: WeatherPreference = { ...existingPrefs, ...preferences };
      this.weatherPreferences.set(existingPrefs.id, updatedPrefs);
      return updatedPrefs;
    } else {
      // Create new preferences
      const id = this.weatherPrefIdCounter++;
      const newPrefs: WeatherPreference = { ...preferences, id };
      this.weatherPreferences.set(id, newPrefs);
      return newPrefs;
    }
  }
  
  // Helper method to create sample wardrobe items for the default user
  private createSampleWardrobeItems() {
    const sampleItems: Partial<InsertWardrobeItem>[] = [
      {
        userId: 1,
        name: "White Basic T-shirt",
        category: "tops",
        type: "t-shirt",
        color: "white",
        material: "cotton",
        style: "casual",
        imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        sustainabilityScore: 85,
        season: "all-season",
        occasion: "casual"
      },
      {
        userId: 1,
        name: "Blue Denim Jeans",
        category: "bottoms",
        type: "jeans",
        color: "blue",
        material: "denim",
        style: "casual",
        imageUrl: "https://images.unsplash.com/photo-1598522325074-042db73aa4e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        sustainabilityScore: 72,
        season: "all-season",
        occasion: "casual"
      },
      {
        userId: 1,
        name: "Black Leather Jacket",
        category: "outerwear",
        type: "jacket",
        color: "black",
        material: "leather",
        style: "casual",
        imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        sustainabilityScore: 56,
        season: "fall",
        occasion: "casual"
      },
      {
        userId: 1,
        name: "Beige Knit Sweater",
        category: "tops",
        type: "sweater",
        color: "beige",
        material: "wool",
        style: "casual",
        imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        sustainabilityScore: 92,
        season: "winter",
        occasion: "casual"
      },
      {
        userId: 1,
        name: "White Button-Up Shirt",
        category: "tops",
        type: "shirt",
        color: "white",
        material: "cotton",
        style: "formal",
        imageUrl: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        sustainabilityScore: 88,
        season: "all-season",
        occasion: "formal"
      },
      {
        userId: 1,
        name: "Brown Ankle Boots",
        category: "shoes",
        type: "boots",
        color: "brown",
        material: "leather",
        style: "casual",
        imageUrl: "https://images.unsplash.com/photo-1551489186-cf8726f514f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        sustainabilityScore: 62,
        season: "fall",
        occasion: "casual"
      },
      {
        userId: 1,
        name: "Classic Sunglasses",
        category: "accessories",
        type: "sunglasses",
        color: "black",
        material: "plastic",
        style: "casual",
        imageUrl: "https://images.unsplash.com/photo-1538329972958-465d6d2144ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        sustainabilityScore: 78,
        season: "summer",
        occasion: "casual"
      },
      {
        userId: 1,
        name: "Floral Summer Dress",
        category: "dresses",
        type: "dress",
        color: "multi",
        material: "cotton",
        style: "casual",
        imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        sustainabilityScore: 84,
        season: "summer",
        occasion: "casual"
      },
      {
        userId: 1,
        name: "Navy Blue Blazer",
        category: "outerwear",
        type: "blazer",
        color: "navy",
        material: "polyester",
        style: "formal",
        imageUrl: "https://images.unsplash.com/photo-1519211975560-4ca611f5a72a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        sustainabilityScore: 65,
        season: "all-season",
        occasion: "formal"
      },
      {
        userId: 1,
        name: "White Sneakers",
        category: "shoes",
        type: "sneakers",
        color: "white",
        material: "canvas",
        style: "casual",
        imageUrl: "https://images.unsplash.com/photo-1608250894095-87d6da0b0805?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        sustainabilityScore: 91,
        season: "all-season",
        occasion: "casual"
      }
    ];
    
    sampleItems.forEach(item => {
      this.createWardrobeItem(item as InsertWardrobeItem);
    });
  }
  
  // Helper method to create sample outfits
  private createSampleOutfits() {
    const sampleOutfits: Partial<InsertOutfit>[] = [
      {
        userId: 1,
        name: "Casual Friday",
        items: [1, 2, 10], // T-shirt, jeans, sneakers
        occasion: "office",
        season: "all-season",
        sustainabilityScore: 86,
        isFavorite: false
      },
      {
        userId: 1,
        name: "Weekend Brunch",
        items: [8, 6, 7], // Dress, boots, sunglasses
        occasion: "social",
        season: "summer",
        sustainabilityScore: 92,
        isFavorite: true
      },
      {
        userId: 1,
        name: "Business Meeting",
        items: [5, 9, 2], // Button-up shirt, blazer, jeans
        occasion: "work",
        season: "all-season",
        sustainabilityScore: 76,
        isFavorite: false
      }
    ];
    
    sampleOutfits.forEach(outfit => {
      this.createOutfit(outfit as InsertOutfit);
    });
  }
}

export const storage = new MemStorage();
