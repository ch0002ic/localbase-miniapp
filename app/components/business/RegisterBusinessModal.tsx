'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { SmartContractService } from '../../services/smartContract';
import { LocalBaseAPI } from '../../services/api';
import { BusinessCategory } from '../../types/localbase';
import { X, Loader2, CheckCircle } from 'lucide-react';

interface RegisterBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Add callback for when registration succeeds
}

export function RegisterBusinessModal({ isOpen, onClose, onSuccess }: RegisterBusinessModalProps) {
  const [businessId, setBusinessId] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessCategory, setBusinessCategory] = useState<BusinessCategory>('services'); // Default to services
  const [businessAddress, setBusinessAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [priceRange, setPriceRange] = useState('$$');
  const [openTime, setOpenTime] = useState('09:00');
  const [closeTime, setCloseTime] = useState('18:00');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const { address, isConnected } = useAccount();

  // Auto-generate business ID when name changes
  const generateBusinessId = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      + '-' + Math.random().toString(36).substr(2, 4); // Add random suffix
  };

  // Auto-fill business details based on category
  const categoryDefaults = {
    food: {
      description: 'Delicious food and great service in a welcoming atmosphere.',
      openTime: '08:00',
      closeTime: '22:00',
      priceRange: '$$'
    },
    shopping: {
      description: 'Quality products with excellent customer service.',
      openTime: '10:00',
      closeTime: '20:00',
      priceRange: '$$$'
    },
    services: {
      description: 'Professional services tailored to your needs.',
      openTime: '09:00',
      closeTime: '18:00',
      priceRange: '$$'
    },
    health: {
      description: 'Professional healthcare services in a comfortable environment.',
      openTime: '08:00',
      closeTime: '17:00',
      priceRange: '$$$'
    },
    beauty: {
      description: 'Premium beauty services to help you look and feel your best.',
      openTime: '09:00',
      closeTime: '19:00',
      priceRange: '$$'
    },
    fun: {
      description: 'Entertainment and activities for an unforgettable experience.',
      openTime: '10:00',
      closeTime: '23:00',
      priceRange: '$$'
    }
  };

  // Validation functions
  const validateField = (field: string, value: string) => {
    const errors: {[key: string]: string} = {};

    switch (field) {
      case 'businessName':
        if (!value.trim()) errors.businessName = 'Business name is required';
        else if (value.length < 3) errors.businessName = 'Business name must be at least 3 characters';
        else if (value.length > 50) errors.businessName = 'Business name must be less than 50 characters';
        break;

      case 'businessAddress':
        if (!value.trim()) errors.businessAddress = 'Business address is required';
        else if (value.length < 10) errors.businessAddress = 'Please enter a complete address';
        break;

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        }
        break;

      case 'website':
        if (value && !/^https?:\/\/.+\..+/.test(value)) {
          errors.website = 'Please enter a valid website URL (e.g., https://example.com)';
        }
        break;

      case 'phoneNumber':
        if (value && !/^[\+]?[0-9\s\-\(\)]{8,}$/.test(value)) {
          errors.phoneNumber = 'Please enter a valid phone number';
        }
        break;
    }

    return errors;
  };

  // Handle category change with auto-fill
  const handleCategoryChange = (category: BusinessCategory) => {
    setBusinessCategory(category);
    
    // Auto-fill default values for the category if fields are empty
    const defaults = categoryDefaults[category];
    if (!businessDescription.trim()) {
      setBusinessDescription(defaults.description);
    }
    if (openTime === '09:00') { // Only change if it's the default
      setOpenTime(defaults.openTime);
    }
    if (closeTime === '18:00') { // Only change if it's the default
      setCloseTime(defaults.closeTime);
    }
    if (priceRange === '$$') { // Only change if it's the default
      setPriceRange(defaults.priceRange);
    }
  };

  // Handle business name change with auto-generated ID
  const handleBusinessNameChange = (name: string) => {
    setBusinessName(name);
    
    // Auto-generate business ID
    if (name.trim().length >= 3) {
      const generatedId = generateBusinessId(name);
      setBusinessId(generatedId);
    }

    // Validate
    const errors = validateField('businessName', name);
    setValidationErrors(prev => ({
      ...prev,
      businessName: errors.businessName || ''
    }));
  };

  const categories: Array<{ id: BusinessCategory; label: string; icon: string }> = [
    { id: 'food', label: 'Food', icon: '🍽️' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️' },
    { id: 'services', label: 'Services', icon: '🔧' },
    { id: 'fun', label: 'Fun', icon: '🎬' },
    { id: 'health', label: 'Health', icon: '🏥' },
    { id: 'beauty', label: 'Beauty', icon: '💄' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    // Comprehensive validation
    const allErrors = {
      ...validateField('businessName', businessName),
      ...validateField('businessAddress', businessAddress),
      ...validateField('email', email),
      ...validateField('website', website),
      ...validateField('phoneNumber', phoneNumber),
    };

    // Check required fields
    if (!businessId.trim() || !businessName.trim() || !businessDescription.trim() || !businessAddress.trim()) {
      allErrors.general = 'Please fill in all required fields (marked with *)';
    }

    setValidationErrors(allErrors);

    // If there are any errors, don't submit
    if (Object.values(allErrors).some(error => error)) {
      return;
    }

    setLoading(true);
    try {
      console.log('Registering business:', { businessId: businessId.trim(), businessName: businessName.trim() });
      
      let receipt = null;
      
      // Register on-chain if smart contract mode is enabled
      if (SmartContractService.isEnabled()) {
        try {
          receipt = await SmartContractService.registerBusiness(
            businessId.trim(),
            businessName.trim()
          );
          console.log('✅ Business registered on-chain:', receipt);
        } catch (contractError) {
          console.warn('⚠️ On-chain registration failed, continuing with local storage:', contractError);
          // Continue with local storage even if on-chain fails
        }
      }
      
      // Always save to localStorage for demo/backup purposes
      await LocalBaseAPI.addBusiness({
        id: businessId.trim(),
        name: businessName.trim(),
        description: businessDescription.trim(),
        category: businessCategory,
        address: businessAddress.trim(),
        latitude: 0,
        longitude: 0,
        owner: address,
        isActive: true,
        totalTransactions: 0,
        reputationScore: 0,
        acceptsBasePay: true,
        phoneNumber: phoneNumber.trim() || undefined,
        email: email.trim() || undefined,
        website: website.trim() || undefined,
        priceRange: priceRange as '$' | '$$' | '$$$' | '$$$$',
        hours: {
          monday: { open: openTime, close: closeTime },
          tuesday: { open: openTime, close: closeTime },
          wednesday: { open: openTime, close: closeTime },
          thursday: { open: openTime, close: closeTime },
          friday: { open: openTime, close: closeTime },
          saturday: { open: openTime, close: closeTime },
          sunday: { open: openTime, close: closeTime },
        },
        verified: false,
        averageRating: 0,
        totalReviews: 0,
      });
      
      setSuccess(true);
      
      // Show success message
      const successMsg = receipt 
        ? `✅ Business registered on-chain: ${receipt}` 
        : '✅ Business registered locally!';
      console.log(successMsg);
      
      // Reset form after 2 seconds and close modal
      setTimeout(() => {
        setBusinessId('');
        setBusinessName('');
        setBusinessDescription('');
        setBusinessCategory('services');
        setBusinessAddress('');
        setPhoneNumber('');
        setEmail('');
        setWebsite('');
        setPriceRange('$$');
        setOpenTime('09:00');
        setCloseTime('18:00');
        setSuccess(false);
        onClose();
        // Call the success callback to refresh the business list
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
      
    } catch (error) {
      console.error('Business registration failed:', error);
      alert(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Register Your Business</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Registration Successful!</h3>
            <p className="text-gray-600">Your business has been registered on-chain.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business ID
                </label>
                <input
                  type="text"
                  value={businessId}
                  onChange={(e) => setBusinessId(e.target.value)}
                  placeholder="Auto-generated from business name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  disabled={loading}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Unique identifier (auto-generated, but you can customize)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => handleBusinessNameChange(e.target.value)}
                  placeholder="e.g., LocalCafe NTU"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.businessName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={loading}
                  required
                />
                {validationErrors.businessName && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.businessName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  placeholder="Auto-filled based on category, but feel free to customize..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={loading}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Description is auto-suggested based on your category
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={businessCategory}
                  onChange={(e) => handleCategoryChange(e.target.value as BusinessCategory)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                  required
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Changing category will suggest default values for hours and pricing
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Address *
                </label>
                <input
                  type="text"
                  value={businessAddress}
                  onChange={(e) => {
                    setBusinessAddress(e.target.value);
                    const errors = validateField('businessAddress', e.target.value);
                    setValidationErrors(prev => ({
                      ...prev,
                      businessAddress: errors.businessAddress || ''
                    }));
                  }}
                  placeholder="e.g., 50 Nanyang Ave, Singapore"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.businessAddress ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={loading}
                  required
                />
                {validationErrors.businessAddress && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.businessAddress}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      const errors = validateField('phoneNumber', e.target.value);
                      setValidationErrors(prev => ({
                        ...prev,
                        phoneNumber: errors.phoneNumber || ''
                      }));
                    }}
                    placeholder="+65 6XXX XXXX"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  {validationErrors.phoneNumber && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.phoneNumber}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  >
                    <option value="$">$ - Budget (Under $15)</option>
                    <option value="$$">$$ - Moderate ($15-30)</option>
                    <option value="$$$">$$$ - Expensive ($30-50)</option>
                    <option value="$$$$">$$$$ - Very Expensive ($50+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    const errors = validateField('email', e.target.value);
                    setValidationErrors(prev => ({
                      ...prev,
                      email: errors.email || ''
                    }));
                  }}
                  placeholder="hello@yourbusiness.com"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {validationErrors.email && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => {
                    setWebsite(e.target.value);
                    const errors = validateField('website', e.target.value);
                    setValidationErrors(prev => ({
                      ...prev,
                      website: errors.website || ''
                    }));
                  }}
                  placeholder="https://yourbusiness.com"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.website ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {validationErrors.website && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.website}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operating Hours
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Opening Time</label>
                    <input
                      type="time"
                      value={openTime}
                      onChange={(e) => setOpenTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Closing Time</label>
                    <input
                      type="time"
                      value={closeTime}
                      onChange={(e) => setCloseTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Hours are auto-suggested based on your business category and will apply to all days
                </p>
              </div>

              {!isConnected && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-sm text-orange-700">
                    Please connect your wallet to register a business.
                  </p>
                </div>
              )}

              {validationErrors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{validationErrors.general}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !isConnected}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  loading || !isConnected
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register Business'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
