# Itin.AI - AI-Driven Travel Planning Platform

An intelligent travel planning platform that generates personalized itineraries using AI, featuring interactive maps and comprehensive travel recommendations.

## Features

- 🤖 **AI-Powered Itinerary Generation**: Uses OpenAI GPT to create personalized travel plans
- 🗺️ **Interactive Maps**: Google Maps integration for route visualization
- 📱 **Responsive Design**: Modern, mobile-friendly interface
- 💰 **Budget Management**: Smart budget allocation and recommendations
- 🎯 **Personalized Preferences**: Customizable travel interests and goals
- 🔄 **Real-time Updates**: Dynamic itinerary adjustments

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express
- **AI**: OpenAI GPT API
- **Maps**: Google Maps API
- **Database**: MongoDB
- **Styling**: Tailwind CSS

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- OpenAI API key
- Google Maps API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd itin.ai
```

2. Install dependencies:
```bash
npm run install-all
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your API keys in `.env`:
```bash
OPENAI_API_KEY=your_openai_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
MONGODB_URI=your_mongodb_connection_string
```

5. Start the development servers:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
itin.ai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
├── server/                 # Node.js backend
│   ├── routes/            # API routes
│   ├── controllers/       # Business logic
│   ├── models/           # Database models
│   └── middleware/       # Custom middleware
└── docs/                  # Documentation
```

## API Endpoints

- `POST /api/itinerary/generate` - Generate AI itinerary
- `GET /api/itinerary/:id` - Get specific itinerary
- `POST /api/user/preferences` - Save user preferences
- `GET /api/destinations` - Get destination suggestions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details 