import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ItineraryGenerator from './pages/ItineraryGenerator';
import ItineraryView from './pages/ItineraryView';
import DestinationsPage from './pages/DestinationsPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/generate" element={<ItineraryGenerator />} />
          <Route path="/itinerary/:id" element={<ItineraryView />} />
          <Route path="/destinations" element={<DestinationsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 