# Project Setup

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

5. **Run the application:**
   ```bash
   npm run dev
   ```
