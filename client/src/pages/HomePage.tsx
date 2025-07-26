import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, MapPin, Brain, Sparkles, Globe, Clock } from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Planning',
      description: 'Our advanced AI creates personalized itineraries based on your preferences and travel style.'
    },
    {
      icon: MapPin,
      title: 'Interactive Maps',
      description: 'Visualize your journey with Google Maps integration showing routes and locations.'
    },
    {
      icon: Clock,
      title: 'Smart Scheduling',
      description: 'Optimized daily schedules that balance activities, rest, and travel time.'
    },
    {
      icon: Globe,
      title: 'Global Destinations',
      description: 'Explore thousands of destinations with detailed information and recommendations.'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Plan Your Perfect Trip with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the future of travel planning. Our AI creates personalized itineraries 
            that match your interests, budget, and travel style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/generate"
              className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
            >
              <Plane className="w-5 h-5" />
              <span>Start Planning</span>
            </Link>
            <Link
              to="/destinations"
              className="btn-secondary text-lg px-8 py-3 flex items-center justify-center space-x-2"
            >
              <MapPin className="w-5 h-5" />
              <span>Explore Destinations</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Itin.AI?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine cutting-edge AI technology with travel expertise to create 
              unforgettable journeys tailored just for you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg rounded-2xl p-8 md:p-12 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <Sparkles className="w-12 h-12 mx-auto mb-6 text-yellow-300" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Travel Experience?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of travelers who have discovered their perfect destinations 
            with AI-powered planning.
          </p>
          <Link
            to="/generate"
            className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <Plane className="w-5 h-5" />
            <span>Create Your Itinerary</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 