const express = require('express');
const router = express.Router();

// Popular destinations data
const popularDestinations = [
  {
    id: 1,
    name: 'Paris, France',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898534-47d3c0c8705b?w=800',
    description: 'The City of Light offers iconic landmarks, world-class museums, and exquisite cuisine.',
    category: 'culture',
    averageCost: 2000,
    bestTime: 'April to October'
  },
  {
    id: 2,
    name: 'Tokyo, Japan',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    description: 'A fascinating blend of ultramodern and traditional, offering unique experiences.',
    category: 'culture',
    averageCost: 2500,
    bestTime: 'March to May, September to November'
  },
  {
    id: 3,
    name: 'New York City, USA',
    country: 'United States',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    description: 'The Big Apple offers endless entertainment, dining, and cultural experiences.',
    category: 'culture',
    averageCost: 3000,
    bestTime: 'April to June, September to November'
  },
  {
    id: 4,
    name: 'Bali, Indonesia',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800',
    description: 'Tropical paradise with beautiful beaches, temples, and vibrant culture.',
    category: 'nature',
    averageCost: 1500,
    bestTime: 'April to October'
  },
  {
    id: 5,
    name: 'Barcelona, Spain',
    country: 'Spain',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
    description: 'Stunning architecture, beautiful beaches, and vibrant Mediterranean culture.',
    category: 'culture',
    averageCost: 1800,
    bestTime: 'May to June, September to October'
  },
  {
    id: 6,
    name: 'Queenstown, New Zealand',
    country: 'New Zealand',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    description: 'Adventure capital of the world with stunning landscapes and outdoor activities.',
    category: 'adventure',
    averageCost: 2200,
    bestTime: 'December to February'
  }
];

// Get all destinations
router.get('/', (req, res) => {
  try {
    const { category, budget, search } = req.query;
    let filteredDestinations = [...popularDestinations];

    // Filter by category
    if (category) {
      filteredDestinations = filteredDestinations.filter(
        dest => dest.category === category
      );
    }

    // Filter by budget
    if (budget) {
      const budgetNum = parseInt(budget);
      filteredDestinations = filteredDestinations.filter(
        dest => dest.averageCost <= budgetNum
      );
    }

    // Search by name or country
    if (search) {
      const searchLower = search.toLowerCase();
      filteredDestinations = filteredDestinations.filter(
        dest => 
          dest.name.toLowerCase().includes(searchLower) ||
          dest.country.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      destinations: filteredDestinations
    });

  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({
      error: 'Failed to fetch destinations',
      details: error.message
    });
  }
});

// Get destination by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const destination = popularDestinations.find(dest => dest.id === parseInt(id));

    if (!destination) {
      return res.status(404).json({
        error: 'Destination not found'
      });
    }

    res.json({
      success: true,
      destination
    });

  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({
      error: 'Failed to fetch destination',
      details: error.message
    });
  }
});

// Get destination categories
router.get('/categories/list', (req, res) => {
  try {
    const categories = [
      { id: 'culture', name: 'Culture & History', icon: '🏛️' },
      { id: 'nature', name: 'Nature & Outdoors', icon: '🌲' },
      { id: 'adventure', name: 'Adventure & Sports', icon: '🏔️' },
      { id: 'food', name: 'Food & Dining', icon: '🍽️' },
      { id: 'relaxation', name: 'Relaxation & Wellness', icon: '🧘' },
      { id: 'shopping', name: 'Shopping & Entertainment', icon: '🛍️' }
    ];

    res.json({
      success: true,
      categories
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      error: 'Failed to fetch categories',
      details: error.message
    });
  }
});

// Search destinations
router.get('/search/:query', (req, res) => {
  try {
    const { query } = req.params;
    const searchLower = query.toLowerCase();

    const results = popularDestinations.filter(
      dest => 
        dest.name.toLowerCase().includes(searchLower) ||
        dest.country.toLowerCase().includes(searchLower) ||
        dest.description.toLowerCase().includes(searchLower)
    );

    res.json({
      success: true,
      query,
      results
    });

  } catch (error) {
    console.error('Error searching destinations:', error);
    res.status(500).json({
      error: 'Failed to search destinations',
      details: error.message
    });
  }
});

module.exports = router; 