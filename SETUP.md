# Itin.AI Setup Guide

This guide will help you set up the Itin.AI travel planning platform on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** for version control

## API Keys Required

You'll need to obtain the following API keys:

### 1. OpenAI API Key
- Visit [OpenAI Platform](https://platform.openai.com/)
- Create an account and navigate to API Keys
- Generate a new API key
- **Cost**: Pay-per-use (very affordable for development)

### 2. Google Maps API Key
- Visit [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select existing one
- Enable the following APIs:
  - Maps JavaScript API
  - Places API
  - Geocoding API
- Create credentials (API Key)
- **Cost**: Free tier includes $200 monthly credit (sufficient for development)

## Installation Steps

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd itin.ai
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Return to root
cd ..
```

### 3. Environment Configuration

#### Server Environment
```bash
# Copy the example environment file
cp env.example .env

# Edit the .env file with your API keys
nano .env
```

Update the following variables in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/itin-ai
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
JWT_SECRET=your_random_secret_key_here
```

#### Client Environment
```bash
# Copy the example environment file
cp client/env.example client/.env

# Edit the client environment file
nano client/.env
```

Update the following variables in `client/.env`:
```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 4. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB locally (macOS with Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community
```

#### Option B: MongoDB Atlas (Cloud)
1. Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `MONGODB_URI` in your `.env` file

### 5. Start the Application

#### Development Mode (Recommended)
```bash
# Start both server and client simultaneously
npm run dev
```

This will start:
- Backend server on: http://localhost:5000
- Frontend client on: http://localhost:3000

#### Alternative: Start Separately
```bash
# Terminal 1 - Start backend
npm run server

# Terminal 2 - Start frontend
npm run client
```

## Testing the Setup

### 1. Health Check
Visit http://localhost:5000/api/health to verify the server is running.

### 2. Frontend Check
Visit http://localhost:3000 to see the application homepage.

### 3. Test Itinerary Generation
1. Navigate to "Plan Trip" in the application
2. Fill out the form with test data:
   - Destination: "Paris, France"
   - Dates: Select future dates
   - Budget: $2000
   - Interests: Select a few options
3. Click "Generate Itinerary"
4. Verify the AI generates a personalized itinerary

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: MongoDB connection error
```
**Solution**: Ensure MongoDB is running and the connection string is correct.

#### 2. OpenAI API Error
```
Error: Failed to generate itinerary
```
**Solution**: Check your OpenAI API key and ensure you have credits in your account.

#### 3. Google Maps Not Loading
```
Error: Failed to load map
```
**Solution**: Verify your Google Maps API key and ensure the required APIs are enabled.

#### 4. Port Already in Use
```
Error: EADDRINUSE
```
**Solution**: Change the port in `.env` file or kill the process using the port.

### Performance Optimization

#### For Production
1. Set `NODE_ENV=production` in `.env`
2. Use MongoDB Atlas for database
3. Set up proper CORS configuration
4. Implement rate limiting
5. Add SSL certificates

#### For Development
1. Use MongoDB Compass for database visualization
2. Enable hot reloading
3. Use browser developer tools for debugging

## API Endpoints

### Itinerary Endpoints
- `POST /api/itinerary/generate` - Generate AI itinerary
- `GET /api/itinerary/:id` - Get specific itinerary
- `PUT /api/itinerary/:id` - Update itinerary
- `DELETE /api/itinerary/:id` - Delete itinerary

### User Endpoints
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - User login
- `GET /api/user/profile/:userId` - Get user profile
- `PUT /api/user/preferences/:userId` - Update preferences

### Destination Endpoints
- `GET /api/destination` - Get all destinations
- `GET /api/destination/:id` - Get specific destination
- `GET /api/destination/categories/list` - Get categories

## Next Steps

### Adding Flight/Hotel APIs
For production use, consider integrating:
- **Skyscanner API** for flight search
- **Booking.com API** for hotel search
- **Amadeus API** for comprehensive travel data

### Deployment
1. **Backend**: Deploy to Heroku, Railway, or AWS
2. **Frontend**: Deploy to Vercel, Netlify, or AWS S3
3. **Database**: Use MongoDB Atlas
4. **Environment**: Set production environment variables

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Ensure all API keys are correctly configured
4. Verify all dependencies are installed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Happy Travel Planning! 🗺️✈️** 