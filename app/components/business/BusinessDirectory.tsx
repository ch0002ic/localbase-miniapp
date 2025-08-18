'use client';

import { useState, useEffect, useCallback } from 'react';
import { BusinessCard } from './BusinessCard';
import { BusinessProfile } from './BusinessProfile';
import { RegisterBusinessModal } from './RegisterBusinessModal';
import { Business, BusinessCategory } from '../../types/localbase';
import { LocalBaseAPI } from '../../services/api';
import { MockModeBanner } from '../MockModeBanner';
import { MapPin, Search, Plus } from 'lucide-react';

export function BusinessDirectory() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  
  const categories: Array<{ id: BusinessCategory | 'all'; label: string; icon: string }> = [
    { id: 'all', label: 'All', icon: '🏢' },
    { id: 'food', label: 'Food', icon: '🍽️' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️' },
    { id: 'services', label: 'Services', icon: '🔧' },
    { id: 'fun', label: 'Fun', icon: '🎬' },
    { id: 'health', label: 'Health', icon: '🏥' },
    { id: 'beauty', label: 'Beauty', icon: '💄' },
  ];
  
  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await LocalBaseAPI.getBusinesses(selectedCategory);
      setBusinesses(data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);
  
  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);
  
  // Remove the problematic event listener - we'll use a different approach

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setLoading(true);
      try {
        const data = await LocalBaseAPI.searchBusinesses(searchTerm);
        setBusinesses(data);
      } catch (error) {
        console.error('Error searching businesses:', error);
      } finally {
        setLoading(false);
      }
    } else {
      fetchBusinesses();
    }
  };
  
  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || business.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewProfile = (businessId: string) => {
    setSelectedBusinessId(businessId);
  };

  const handleBackToDirectory = () => {
    setSelectedBusinessId(null);
  };

  // If a business is selected, show its profile
  if (selectedBusinessId) {
    return (
      <BusinessProfile 
        businessId={selectedBusinessId}
        onBack={handleBackToDirectory}
      />
    );
  }
  
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Finding local businesses...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      {/* Mock Mode Banner */}
      <MockModeBanner />
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">
            <MapPin className="inline-block w-6 h-6 mr-2 text-blue-600" />
            Discover Local Businesses
          </h1>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Register Business
          </button>
        </div>
        <p className="text-gray-600">Find crypto-friendly businesses in your area</p>
      </div>
      
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search businesses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
      
      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>{category.icon}</span>
            <span className="font-medium">{category.label}</span>
          </button>
        ))}
      </div>
      
      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {filteredBusinesses.length} business{filteredBusinesses.length !== 1 ? 'es' : ''} found
        </p>
      </div>
      
      {/* Business Grid */}
      {filteredBusinesses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No businesses found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or category filter</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <BusinessCard 
              key={business.id} 
              business={business} 
              onBusinessUpdate={fetchBusinesses}
              onViewProfile={handleViewProfile}
            />
          ))}
        </div>
      )}
      
      {/* Register Business Modal */}
      <RegisterBusinessModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={() => {
          console.log('Business registered successfully, refreshing list...');
          fetchBusinesses(); // Refresh the business list when registration succeeds
        }}
      />
    </div>
  );
}
