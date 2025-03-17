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
1. Go to the Tools panel in your Repl
2. Click on "Secrets"
3. Add the following secrets:
   - Key: `GEMINI_API_KEY`, Value: Your Google Gemini API key
   - Key: `OPENWEATHER_API_KEY`, Value: Your OpenWeather API key

The application will automatically load these secrets as environment variables.

**Important**: Never commit API keys directly in your code or .env files for security reasons.


3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the application:**
   ```bash
   npm start
