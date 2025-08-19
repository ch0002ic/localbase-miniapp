'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Star, Clock, X } from 'lucide-react';
import { Business, BusinessCategory } from '../../types/localbase';
import { LocalBaseAPI } from '../../services/api';
import { SearchSuggestionsSkeleton } from '../ui/Skeleton';

interface SearchWithAutocompleteProps {
  onBusinessSelect: (businessId: string) => void;
  onSearchResults: (businesses: Business[]) => void;
  selectedCategory: BusinessCategory | 'all';
}

interface SearchSuggestion {
  type: 'business' | 'category' | 'recent';
  id: string;
  title: string;
  subtitle?: string;
  business?: Business;
  category?: BusinessCategory;
  icon?: string;
}

export function SearchWithAutocomplete({ 
  onBusinessSelect, 
  onSearchResults, 
  selectedCategory 
}: SearchWithAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('localbase-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Generate suggestions based on search term
  useEffect(() => {
    const generateSuggestions = async () => {
      if (!searchTerm.trim()) {
        // Show recent searches when no search term
        const recent: SearchSuggestion[] = recentSearches.slice(0, 3).map(term => ({
          type: 'recent',
          id: `recent-${term}`,
          title: term,
          icon: '🕒'
        }));
        
        setSuggestions(recent);
        return;
      }

      setIsLoading(true);
      try {
        // Get all businesses for suggestions
        const allBusinesses = await LocalBaseAPI.getBusinesses();
        const filteredBusinesses = allBusinesses.filter(business => {
          const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               business.address.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesCategory = selectedCategory === 'all' || business.category === selectedCategory;
          return matchesSearch && matchesCategory;
        });

        const businessSuggestions: SearchSuggestion[] = filteredBusinesses.slice(0, 5).map(business => ({
          type: 'business',
          id: business.id,
          title: business.name,
          subtitle: business.address,
          business,
          icon: getCategoryIcon(business.category)
        }));

        // Add category suggestions if search matches category names
        const categories = [
          { id: 'food', label: 'Food', icon: '🍽️' },
          { id: 'shopping', label: 'Shopping', icon: '🛍️' },
          { id: 'services', label: 'Services', icon: '🔧' },
          { id: 'fun', label: 'Fun', icon: '🎬' },
          { id: 'health', label: 'Health', icon: '🏥' },
          { id: 'beauty', label: 'Beauty', icon: '💄' },
        ];

        const categorySuggestions: SearchSuggestion[] = categories
          .filter(cat => cat.label.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(cat => ({
            type: 'category',
            id: cat.id,
            title: `Browse ${cat.label}`,
            category: cat.id as BusinessCategory,
            icon: cat.icon
          }));

        setSuggestions([...businessSuggestions, ...categorySuggestions]);
      } catch (error) {
        console.error('Error generating suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(generateSuggestions, 200); // Debounce
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, recentSearches]);

  const getCategoryIcon = (category: BusinessCategory): string => {
    const iconMap: Record<BusinessCategory, string> = {
      food: '🍽️',
      shopping: '🛍️',
      services: '🔧',
      fun: '🎬',
      health: '🏥',
      beauty: '💄'
    };
    return iconMap[category] || '🏢';
  };

  const handleSearch = async (term: string = searchTerm) => {
    if (!term.trim()) return;

    // Add to recent searches
    const newRecentSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('localbase-recent-searches', JSON.stringify(newRecentSearches));

    setIsLoading(true);
    try {
      const results = await LocalBaseAPI.searchBusinesses(term);
      const filteredResults = results.filter(business => 
        selectedCategory === 'all' || business.category === selectedCategory
      );
      onSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsLoading(false);
    }
    
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'business' && suggestion.business) {
      onBusinessSelect(suggestion.business.id);
      setSearchTerm(suggestion.title);
    } else if (suggestion.type === 'category') {
      setSearchTerm(`Browse ${suggestion.title.replace('Browse ', '')}`);
      handleSearch(`Browse ${suggestion.title.replace('Browse ', '')}`);
    } else if (suggestion.type === 'recent') {
      setSearchTerm(suggestion.title);
      handleSearch(suggestion.title);
    }
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onSearchResults([]);
  };

  const removeRecentSearch = (searchToRemove: string) => {
    const updated = recentSearches.filter(s => s !== searchToRemove);
    setRecentSearches(updated);
    localStorage.setItem('localbase-recent-searches', JSON.stringify(updated));
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search businesses, categories, or locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {isLoading ? (
            <SearchSuggestionsSkeleton />
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between group ${
                    index === selectedIndex ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="text-lg flex-shrink-0">
                      {suggestion.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 truncate">
                        {suggestion.title}
                      </div>
                      {suggestion.subtitle && (
                        <div className="text-sm text-gray-500 truncate flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {suggestion.subtitle}
                        </div>
                      )}
                      {suggestion.business && (
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                          {suggestion.business.averageRating && (
                            <div className="flex items-center">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                              {suggestion.business.averageRating.toFixed(1)}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Open
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {suggestion.type === 'recent' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(suggestion.title);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : searchTerm.trim() ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No suggestions found</p>
              <p className="text-xs">Try a different search term</p>
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-gray-500">
              <div className="text-2xl mb-2">🔍</div>
              <p className="text-sm">Start typing to search businesses</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
