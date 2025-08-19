'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { BusinessCard } from './BusinessCard';
import { BusinessProfile } from './BusinessProfile';
import { RegisterBusinessModal } from './RegisterBusinessModal';
import { MyBusinesses } from './MyBusinesses';
import { SearchWithAutocomplete } from './SearchWithAutocomplete';
import { LoadingGrid, BusinessCardSkeleton } from '../ui/Skeleton';
import { Business, BusinessCategory } from '../../types/localbase';
import { LocalBaseAPI } from '../../services/api';
import { MockModeBanner } from '../MockModeBanner';
import { MapPin, Plus, Store, User } from 'lucide-react';

export function BusinessDirectory() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'discover' | 'my-businesses'>('discover');
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchMode, setSearchMode] = useState(false); // Track if we're showing search results
  const { isConnected } = useAccount();
  
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
      setSearchMode(false); // Reset search mode when fetching by category
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);
  
  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  // Handler for search results from autocomplete
  const handleSearchResults = (searchResults: Business[]) => {
    setBusinesses(searchResults);
    setSearchMode(true); // Set search mode to show different UI
  };

  // Handler for business selection from autocomplete
  const handleBusinessSelect = (businessId: string) => {
    setSelectedBusinessId(businessId);
  };

  // Reset to category view
  const handleResetToCategory = () => {
    setSearchMode(false);
    fetchBusinesses();
  };  const handleViewProfile = (businessId: string) => {
    setSelectedBusinessId(businessId);
  };

  const handleBackToDirectory = () => {
    setSelectedBusinessId(null);
    // Refresh businesses list to reflect any changes made while viewing profile
    setRefreshKey(prev => prev + 1);
    fetchBusinesses();
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
      <div className="p-6">
        {/* Mock Mode Banner */}
        <MockModeBanner />
        
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-2">
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Tab Navigation Skeleton */}
          {isConnected && (
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 mb-4">
              <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          )}
        </div>

        {/* Search Bar Skeleton */}
        <div className="mb-6">
          <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse"></div>
        </div>

        {/* Category Filter Skeleton */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-12 w-24 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
          ))}
        </div>

        {/* Results Info Skeleton */}
        <div className="mb-4">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Business Cards Skeleton */}
        <LoadingGrid count={6} SkeletonComponent={BusinessCardSkeleton} />
      </div>
    );
  }
  
  return (
    <div className="p-6">
      {/* Mock Mode Banner */}
      <MockModeBanner />
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
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

        {/* Tab Navigation */}
        {isConnected && (
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 mb-4">
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'discover'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Store className="w-4 h-4 mr-2 inline" />
              Discover
            </button>
            <button
              onClick={() => setActiveTab('my-businesses')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'my-businesses'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4 mr-2 inline" />
              My Businesses
            </button>
          </div>
        )}

        <p className="text-gray-600">
          {activeTab === 'discover' 
            ? 'Find crypto-friendly businesses in your area'
            : 'Manage your registered businesses'
          }
        </p>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'my-businesses' ? (
        <MyBusinesses
          onCreateBusiness={() => setShowRegisterModal(true)}
          onViewBusiness={(businessId) => setSelectedBusinessId(businessId)}
          refreshKey={refreshKey}
        />
      ) : (
        <>
          {/* Enhanced Search Bar */}
          <div className="mb-6">
            <SearchWithAutocomplete
              onBusinessSelect={handleBusinessSelect}
              onSearchResults={handleSearchResults}
              selectedCategory={selectedCategory}
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  handleResetToCategory(); // Reset search when changing category
                }}
                className={`flex items-center gap-2 px-4 py-3 rounded-full whitespace-nowrap transition-all min-w-fit touch-manipulation ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white shadow-md scale-105'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <span className="text-base">{category.icon}</span>
                <span className="font-medium text-sm">{category.label}</span>
              </button>
            ))}
          </div>
          
          {/* Results Info */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {searchMode ? 'Search results: ' : ''}
              {businesses.length} business{businesses.length !== 1 ? 'es' : ''} found
              {searchMode && selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.label}`}
            </p>
            {searchMode && (
              <button
                onClick={handleResetToCategory}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                View all {selectedCategory !== 'all' ? categories.find(c => c.id === selectedCategory)?.label.toLowerCase() : ''} businesses
              </button>
            )}
          </div>
          
          {/* Business Grid */}
          {businesses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchMode ? 'No search results' : 'No businesses found'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchMode 
                  ? 'Try adjusting your search terms or browse by category'
                  : `No businesses registered in this category yet`
                }
              </p>
              <button
                onClick={searchMode ? handleResetToCategory : () => setSelectedCategory('all')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {searchMode ? 'Browse all categories' : 'View all businesses'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <BusinessCard 
                  key={business.id} 
                  business={business} 
                  onBusinessUpdate={fetchBusinesses}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </div>
          )}
        </>
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
