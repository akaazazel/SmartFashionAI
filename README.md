## Project Overview

**SmartWardrobe AI** simplifies wardrobe management with intelligent features. Users can log in to add their outfits, which the AI automatically categorizes. The app, made with **Replit AI**, provides weather-sensitive outfit recommendations based on the user's location and calculates a sustainability score to promote eco-conscious choices.

### Features

- **User Authentication:** Users can log in and create accounts to manage their wardrobes.
- **Location-Based Outfit Recommendations:** Users can change their location to receive weather-based outfit suggestions.
- **Wardrobe Input:** Users can easily add their own outfits to the application.
- **AI-Powered Categorization:** The application uses AI to scan and automatically categorize outfits.
- **Automatic Outfit Recommendations:** SmartWardrobe AI provides automatic outfit recommendations using AI algorithms.
- **Sustainability Scoring:** The application calculates a sustainability score for clothing items and provides insights into your wardrobe's environmental impact.

![screenshots_of_the_project](https://imgur.com/gVfM8QJ)

## Project Setup

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   ```

2. Set up API keys:

This project requires two API keys:

- Google Gemini API key for clothing analysis
- OpenWeather API key for weather data

To set up these keys:

1. Go to the root folder
2. Create a .env file
3. Add the following keys:

   ```env
   GEMINI_API_KEY=your_api_key
   OPENWEATHER_API_KEY=your_api_key
   ```

The application will automatically load these keys.

**Important**: Never commit API keys directly in your code or .env files for security reasons.

3. **Install dependencies:**

   ```bash
   npm install dotenv
   ```

   ```bash
   npm install --save-dev @types/dotenv
   ```

4. **Run the application:**

   ```bash
   npm run dev
   ```

5. **Open the application:**

   The app will be available on `http://localhost:5000/`
