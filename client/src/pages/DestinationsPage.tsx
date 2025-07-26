import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, DollarSign, Calendar } from 'lucide-react';
import axios from 'axios';

interface Destination {
  id: number;
  name: string;
  country: string;
  image: string;
  description: string;
  category: string;
  averageCost: number;
  bestTime: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

const DestinationsPage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');

  useEffect(() => {
    fetchDestinations();
    fetchCategories();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await axios.get('/api/destination');
      setDestinations(response.data.destinations);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/destination/categories/list');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || destination.category === selectedCategory;
    const matchesBudget = !selectedBudget || destination.averageCost <= parseInt(selectedBudget);
    
    return matchesSearch && matchesCategory && matchesBudget;
  });

  const budgetRanges = [
    { value: '', label: 'Any Budget' },
    { value: '1000', label: 'Under $1,000' },
    { value: '2000', label: 'Under $2,000' },
    { value: '3000', label: 'Under $3,000' },
    { value: '5000', label: 'Under $5,000' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Explore Amazing Destinations
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover incredible places around the world and get inspired for your next adventure.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field pl-10"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Filter */}
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="input-field pl-10"
            >
              {budgetRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Destinations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map((destination) => (
          <div key={destination.id} className="card p-0 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                  {destination.country}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {destination.name}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {destination.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span>${destination.averageCost.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{destination.bestTime}</span>
                </div>
              </div>
              
              <Link
                to="/generate"
                state={{ destination: destination.name }}
                className="btn-primary w-full text-center"
              >
                Plan Trip to {destination.name.split(',')[0]}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredDestinations.length === 0 && (
        <div className="text-center py-16">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No destinations found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria or filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSelectedBudget('');
            }}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default DestinationsPage; 