#!/bin/bash

echo "🚀 Setting up Itin.AI Travel Planning Platform"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Create environment files
echo "🔧 Setting up environment files..."

# Server environment
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ Created .env file for server"
    echo "⚠️  Please update .env with your API keys:"
    echo "   - OPENAI_API_KEY"
    echo "   - GOOGLE_MAPS_API_KEY"
    echo "   - MONGODB_URI"
    echo "   - JWT_SECRET"
else
    echo "✅ .env file already exists"
fi

# Client environment
if [ ! -f client/.env ]; then
    cp client/env.example client/.env
    echo "✅ Created client/.env file"
    echo "⚠️  Please update client/.env with your Google Maps API key:"
    echo "   - REACT_APP_GOOGLE_MAPS_API_KEY"
else
    echo "✅ client/.env file already exists"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update the .env files with your API keys"
echo "2. Start MongoDB (local or Atlas)"
echo "3. Run 'npm run dev' to start the application"
echo ""
echo "📚 For detailed instructions, see SETUP.md"
echo ""
echo "Happy Travel Planning! 🗺️✈️" 