import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import { Plane, Calendar, DollarSign, Users, MapPin, Brain } from 'lucide-react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';

interface ItineraryFormData {
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  interests: string[];
  travelStyle: string;
  pace: string;
  groupSize: number;
}

const ItineraryGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<ItineraryFormData>({
    defaultValues: {
      interests: [],
      travelStyle: 'mid-range',
      pace: 'moderate',
      groupSize: 1
    }
  });

  const interests = [
    { value: 'adventure', label: 'Adventure', icon: '🏔️' },
    { value: 'culture', label: 'Culture & History', icon: '🏛️' },
    { value: 'food', label: 'Food & Dining', icon: '🍽️' },
    { value: 'nature', label: 'Nature & Outdoors', icon: '🌲' },
    { value: 'relaxation', label: 'Relaxation', icon: '🧘' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'history', label: 'History', icon: '📚' },
    { value: 'art', label: 'Art & Museums', icon: '🎨' },
    { value: 'music', label: 'Music & Entertainment', icon: '🎵' },
    { value: 'sports', label: 'Sports & Activities', icon: '⚽' }
  ];

  const travelStyles = [
    { value: 'budget', label: 'Budget-Friendly' },
    { value: 'mid-range', label: 'Mid-Range' },
    { value: 'luxury', label: 'Luxury' }
  ];

  const paces = [
    { value: 'relaxed', label: 'Relaxed' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'fast-paced', label: 'Fast-Paced' }
  ];

  const handleInterestChange = (interest: string) => {
    const currentInterests = watch('interests');
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    setValue('interests', newInterests);
  };

  const onSubmit = async (data: ItineraryFormData) => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (data.interests.length === 0) {
      toast.error('Please select at least one interest');
      return;
    }

    setIsGenerating(true);
    toast.loading('Generating your personalized itinerary...', { id: 'generating' });

    try {
      const response = await axios.post('/api/itinerary/generate', {
        ...data,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        userId: 'demo-user' // For demo purposes
      });

      toast.success('Itinerary generated successfully!', { id: 'generating' });
      navigate(`/itinerary/${response.data.itinerary._id}`);
    } catch (error: any) {
      console.error('Error generating itinerary:', error);
      toast.error(error.response?.data?.error || 'Failed to generate itinerary', { id: 'generating' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create Your AI-Powered Itinerary
        </h1>
        <p className="text-gray-600">
          Tell us about your dream trip and our AI will craft the perfect itinerary for you.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Destination */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Destination</h2>
          </div>
          <input
            type="text"
            placeholder="Where do you want to go? (e.g., Paris, France)"
            className="input-field"
            {...register('destination', { required: 'Destination is required' })}
          />
          {errors.destination && (
            <p className="text-red-500 text-sm mt-1">{errors.destination.message}</p>
          )}
        </div>

        {/* Travel Dates */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Travel Dates</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                className="input-field"
                placeholderText="Select start date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="input-field"
                placeholderText="Select end date"
              />
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Budget</h2>
          </div>
          <input
            type="number"
            placeholder="Total budget for your trip (USD)"
            className="input-field"
            {...register('budget', { 
              required: 'Budget is required',
              min: { value: 100, message: 'Budget must be at least $100' }
            })}
          />
          {errors.budget && (
            <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
          )}
        </div>

        {/* Interests */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">What interests you?</h2>
          <p className="text-gray-600 mb-4">Select all that apply to help us personalize your experience.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {interests.map((interest) => (
              <label
                key={interest.value}
                className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  watch('interests').includes(interest.value)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={watch('interests').includes(interest.value)}
                  onChange={() => handleInterestChange(interest.value)}
                />
                <span className="text-lg">{interest.icon}</span>
                <span className="text-sm font-medium">{interest.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Travel Style & Pace */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Travel Style</h2>
            <div className="space-y-3">
              {travelStyles.map((style) => (
                <label key={style.value} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    value={style.value}
                    {...register('travelStyle')}
                    className="text-blue-600"
                  />
                  <span>{style.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Travel Pace</h2>
            <div className="space-y-3">
              {paces.map((pace) => (
                <label key={pace.value} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    value={pace.value}
                    {...register('pace')}
                    className="text-blue-600"
                  />
                  <span>{pace.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Group Size */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Group Size</h2>
          </div>
          <input
            type="number"
            min="1"
            max="20"
            className="input-field"
            {...register('groupSize', { 
              required: 'Group size is required',
              min: { value: 1, message: 'Group size must be at least 1' },
              max: { value: 20, message: 'Group size cannot exceed 20' }
            })}
          />
          {errors.groupSize && (
            <p className="text-red-500 text-sm mt-1">{errors.groupSize.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isGenerating}
            className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Plane className="w-5 h-5" />
                <span>Generate Itinerary</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItineraryGenerator; 