import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, Calendar, DollarSign, Clock, ArrowLeft, Download, Share2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Activity {
  time: string;
  title: string;
  description: string;
  location: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  category: string;
  estimatedCost: number;
  duration: number;
}

interface Day {
  dayNumber: number;
  date: string;
  activities: Activity[];
  totalCost: number;
}

interface Itinerary {
  _id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  totalCost: number;
  days: Day[];
  preferences: {
    interests: string[];
    travelStyle: string;
    pace: string;
    groupSize: number;
  };
}

const ItineraryView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  useEffect(() => {
    fetchItinerary();
  }, [id]);

  useEffect(() => {
    if (itinerary && itinerary.days.length > 0) {
      initializeMap();
    }
  }, [itinerary]);

  const fetchItinerary = async () => {
    try {
      const response = await axios.get(`/api/itinerary/${id}`);
      setItinerary(response.data.itinerary);
    } catch (error: any) {
      console.error('Error fetching itinerary:', error);
      toast.error('Failed to load itinerary');
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = async () => {
    if (!itinerary) return;

    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'your-google-maps-api-key',
      version: 'weekly',
    });

    try {
      const google = await loader.load();
      
      const mapElement = document.getElementById('map');
      if (!mapElement) return;

      const mapInstance = new google.maps.Map(mapElement, {
        center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
        zoom: 12,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      setMap(mapInstance);
      updateMapMarkers(mapInstance, selectedDay);
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      toast.error('Failed to load map');
    }
  };

  const updateMapMarkers = (mapInstance: google.maps.Map, dayNumber: number) => {
    if (!itinerary) return;

    const day = itinerary.days.find(d => d.dayNumber === dayNumber);
    if (!day) return;

    // Clear existing markers
    mapInstance.setZoom(12);

    const bounds = new google.maps.LatLngBounds();
    const markers: google.maps.Marker[] = [];

    day.activities.forEach((activity, index) => {
      if (activity.location.coordinates) {
        const position = {
          lat: activity.location.coordinates.lat,
          lng: activity.location.coordinates.lng
        };

        const marker = new google.maps.Marker({
          position,
          map: mapInstance,
          title: activity.title,
          label: {
            text: (index + 1).toString(),
            color: 'white'
          },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#3B82F6',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2
          }
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold">${activity.title}</h3>
              <p class="text-sm text-gray-600">${activity.time}</p>
              <p class="text-sm">${activity.location.name}</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstance, marker);
        });

        markers.push(marker);
        bounds.extend(position);
      }
    });

    if (markers.length > 0) {
      mapInstance.fitBounds(bounds);
    }
  };

  const handleDayChange = (dayNumber: number) => {
    setSelectedDay(dayNumber);
    if (map) {
      updateMapMarkers(map, dayNumber);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      attraction: '🏛️',
      restaurant: '🍽️',
      hotel: '🏨',
      transport: '🚗',
      activity: '🎯'
    };
    return icons[category] || '📍';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Itinerary Not Found</h2>
        <p className="text-gray-600 mb-8">The itinerary you're looking for doesn't exist.</p>
        <Link to="/generate" className="btn-primary">
          Create New Itinerary
        </Link>
      </div>
    );
  }

  const selectedDayData = itinerary.days.find(d => d.dayNumber === selectedDay);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link to="/generate" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Generator</span>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{itinerary.title}</h1>
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{itinerary.destination}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>${itinerary.totalCost} / ${itinerary.budget}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="card p-0 overflow-hidden">
            <div id="map" className="w-full h-96"></div>
          </div>
        </div>

        {/* Day Selector */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Itinerary Days</h2>
            <div className="space-y-2">
              {itinerary.days.map((day) => (
                <button
                  key={day.dayNumber}
                  onClick={() => handleDayChange(day.dayNumber)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedDay === day.dayNumber
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">Day {day.dayNumber}</div>
                  <div className="text-sm text-gray-600">
                    {formatDate(day.date)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {day.activities.length} activities • ${day.totalCost}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Day Details */}
      {selectedDayData && (
        <div className="mt-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">
              Day {selectedDayData.dayNumber} - {formatDate(selectedDayData.date)}
            </h2>
            
            <div className="space-y-6">
              {selectedDayData.activities.map((activity, index) => (
                <div key={index} className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">{getCategoryIcon(activity.category)}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                        <p className="text-gray-600 mt-1">{activity.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{activity.time}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>${activity.estimatedCost}</span>
                          </span>
                          <span>{activity.duration} min</span>
                        </div>
                      </div>
                    </div>
                    
                    {activity.location.name && (
                      <div className="mt-3 p-3 bg-white rounded border">
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="font-medium">{activity.location.name}</div>
                            {activity.location.address && (
                              <div className="text-gray-500">{activity.location.address}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Day Total:</span>
                <span className="font-semibold text-lg">${selectedDayData.totalCost}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryView; 