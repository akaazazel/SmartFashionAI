import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  email: text("email"),
  avatarUrl: text("avatar_url"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
  avatarUrl: true,
});

// Wardrobe item schema
export const wardrobeItems = pgTable("wardrobe_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(), // tops, bottoms, dresses, outerwear, shoes, accessories
  type: text("type").notNull(), // t-shirt, jeans, sneakers, etc.
  color: text("color"),
  material: text("material"),
  style: text("style"), // casual, formal, sporty, etc.
  imageUrl: text("image_url"),
  imageData: text("image_data"), // base64 encoded image data
  sustainabilityScore: integer("sustainability_score"), // 0-100
  attributes: jsonb("attributes"), // Additional AI-detected attributes
  occasion: text("occasion"), // work, casual, party, etc.
  season: text("season"), // summer, winter, all-season, etc.
  lastWorn: timestamp("last_worn"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWardrobeItemSchema = createInsertSchema(wardrobeItems).omit({
  id: true,
  createdAt: true,
});

// Outfit schema
export const outfits = pgTable("outfits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  items: jsonb("items").notNull(), // Array of wardrobe item IDs
  occasion: text("occasion"), // work, casual, party, etc.
  season: text("season"), // summer, winter, all-season, etc.
  sustainabilityScore: integer("sustainability_score"), // 0-100
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOutfitSchema = createInsertSchema(outfits).omit({
  id: true,
  createdAt: true,
});

// Weather preferences schema
export const weatherPreferences = pgTable("weather_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  location: text("location").notNull(),
  unit: text("unit").default("metric"), // metric or imperial
  minTemperature: integer("min_temperature"), // Minimum comfortable temperature
  maxTemperature: integer("max_temperature"), // Maximum comfortable temperature
});

export const insertWeatherPreferencesSchema = createInsertSchema(weatherPreferences).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type WardrobeItem = typeof wardrobeItems.$inferSelect;
export type InsertWardrobeItem = z.infer<typeof insertWardrobeItemSchema>;

export type Outfit = typeof outfits.$inferSelect;
export type InsertOutfit = z.infer<typeof insertOutfitSchema>;

export type WeatherPreference = typeof weatherPreferences.$inferSelect;
export type InsertWeatherPreference = z.infer<typeof insertWeatherPreferencesSchema>;
