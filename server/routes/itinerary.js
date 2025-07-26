const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');

// Generate new itinerary
router.post('/generate', itineraryController.generateItinerary);

// Get specific itinerary
router.get('/:id', itineraryController.getItinerary);

// Get user's itineraries
router.get('/user/:userId', itineraryController.getUserItineraries);

// Update itinerary
router.put('/:id', itineraryController.updateItinerary);

// Delete itinerary
router.delete('/:id', itineraryController.deleteItinerary);

module.exports = router; 