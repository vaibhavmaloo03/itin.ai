const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  dayNumber: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  activities: [{
    time: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    location: {
      name: String,
      address: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    category: {
      type: String,
      enum: ['attraction', 'restaurant', 'hotel', 'transport', 'activity'],
      default: 'activity'
    },
    estimatedCost: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number, // in minutes
      default: 60
    }
  }],
  totalCost: {
    type: Number,
    default: 0
  }
});

const itinerarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'My Travel Itinerary'
  },
  destination: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  preferences: {
    interests: [{
      type: String,
      enum: ['adventure', 'culture', 'food', 'nature', 'relaxation', 'shopping', 'history', 'art', 'music', 'sports']
    }],
    travelStyle: {
      type: String,
      enum: ['budget', 'mid-range', 'luxury'],
      default: 'mid-range'
    },
    pace: {
      type: String,
      enum: ['relaxed', 'moderate', 'fast-paced'],
      default: 'moderate'
    },
    groupSize: {
      type: Number,
      default: 1
    }
  },
  days: [daySchema],
  totalCost: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'generated', 'saved', 'completed'],
    default: 'draft'
  },
  aiGenerated: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
itinerarySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Calculate total cost
itinerarySchema.methods.calculateTotalCost = function() {
  this.totalCost = this.days.reduce((total, day) => total + day.totalCost, 0);
  return this.totalCost;
};

// Get itinerary summary
itinerarySchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title,
    destination: this.destination,
    startDate: this.startDate,
    endDate: this.endDate,
    totalDays: this.days.length,
    totalCost: this.totalCost,
    status: this.status
  };
};

module.exports = mongoose.model('Itinerary', itinerarySchema); 