const OpenAI = require('openai');
const Itinerary = require('../models/Itinerary');
const User = require('../models/User');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate AI itinerary
const generateItinerary = async (req, res) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      budget,
      interests,
      travelStyle,
      pace,
      groupSize,
      userId
    } = req.body;

    // Validate required fields
    if (!destination || !startDate || !endDate || !budget) {
      return res.status(400).json({
        error: 'Missing required fields: destination, startDate, endDate, budget'
      });
    }

    // Calculate trip duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (duration <= 0) {
      return res.status(400).json({
        error: 'End date must be after start date'
      });
    }

    // Create AI prompt for itinerary generation
    const prompt = createItineraryPrompt({
      destination,
      duration,
      budget,
      interests,
      travelStyle,
      pace,
      groupSize
    });

    // Generate itinerary using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert travel planner. Generate detailed, personalized travel itineraries in JSON format. Include specific locations, times, descriptions, and estimated costs for each activity."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });

    const aiResponse = completion.choices[0].message.content;
    let itineraryData;

    try {
      // Extract JSON from AI response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        itineraryData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in AI response');
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      return res.status(500).json({
        error: 'Failed to parse AI-generated itinerary',
        details: parseError.message
      });
    }

    // Create itinerary document
    const itinerary = new Itinerary({
      userId: userId || 'demo-user', // For demo purposes
      destination,
      startDate: start,
      endDate: end,
      budget,
      preferences: {
        interests: interests || [],
        travelStyle: travelStyle || 'mid-range',
        pace: pace || 'moderate',
        groupSize: groupSize || 1
      },
      days: itineraryData.days || [],
      status: 'generated',
      aiGenerated: true
    });

    // Calculate total cost
    itinerary.calculateTotalCost();

    await itinerary.save();

    res.status(201).json({
      success: true,
      itinerary: itinerary,
      message: 'Itinerary generated successfully'
    });

  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({
      error: 'Failed to generate itinerary',
      details: error.message
    });
  }
};

// Get itinerary by ID
const getItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const itinerary = await Itinerary.findById(id);

    if (!itinerary) {
      return res.status(404).json({
        error: 'Itinerary not found'
      });
    }

    res.json({
      success: true,
      itinerary
    });

  } catch (error) {
    console.error('Error fetching itinerary:', error);
    res.status(500).json({
      error: 'Failed to fetch itinerary',
      details: error.message
    });
  }
};

// Get user itineraries
const getUserItineraries = async (req, res) => {
  try {
    const { userId } = req.params;
    const itineraries = await Itinerary.find({ userId })
      .sort({ createdAt: -1 })
      .select('title destination startDate endDate totalCost status createdAt');

    res.json({
      success: true,
      itineraries
    });

  } catch (error) {
    console.error('Error fetching user itineraries:', error);
    res.status(500).json({
      error: 'Failed to fetch itineraries',
      details: error.message
    });
  }
};

// Update itinerary
const updateItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const itinerary = await Itinerary.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!itinerary) {
      return res.status(404).json({
        error: 'Itinerary not found'
      });
    }

    res.json({
      success: true,
      itinerary
    });

  } catch (error) {
    console.error('Error updating itinerary:', error);
    res.status(500).json({
      error: 'Failed to update itinerary',
      details: error.message
    });
  }
};

// Delete itinerary
const deleteItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const itinerary = await Itinerary.findByIdAndDelete(id);

    if (!itinerary) {
      return res.status(404).json({
        error: 'Itinerary not found'
      });
    }

    res.json({
      success: true,
      message: 'Itinerary deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting itinerary:', error);
    res.status(500).json({
      error: 'Failed to delete itinerary',
      details: error.message
    });
  }
};

// Helper function to create AI prompt
const createItineraryPrompt = (params) => {
  const {
    destination,
    duration,
    budget,
    interests,
    travelStyle,
    pace,
    groupSize
  } = params;

  return `
Create a detailed ${duration}-day travel itinerary for ${destination} with the following specifications:

Budget: $${budget} total
Travel Style: ${travelStyle}
Pace: ${pace}
Group Size: ${groupSize} people
Interests: ${interests.join(', ')}

Please provide the response in the following JSON format:
{
  "days": [
    {
      "dayNumber": 1,
      "date": "2024-01-01",
      "activities": [
        {
          "time": "09:00",
          "title": "Activity Title",
          "description": "Detailed description of the activity",
          "location": {
            "name": "Location Name",
            "address": "Full address",
            "coordinates": {
              "lat": 40.7128,
              "lng": -74.0060
            }
          },
          "category": "attraction",
          "estimatedCost": 25,
          "duration": 120
        }
      ],
      "totalCost": 150
    }
  ]
}

Guidelines:
- Include a mix of activities based on the interests
- Consider the travel style for accommodation and dining recommendations
- Adjust pace based on the specified preference
- Provide realistic cost estimates
- Include specific locations with addresses when possible
- Make activities suitable for the group size
- Ensure the total cost stays within budget
- Include transportation between activities
- Add meal times and restaurant recommendations
- Consider opening hours and seasonal availability
`;
};

module.exports = {
  generateItinerary,
  getItinerary,
  getUserItineraries,
  updateItinerary,
  deleteItinerary
}; 