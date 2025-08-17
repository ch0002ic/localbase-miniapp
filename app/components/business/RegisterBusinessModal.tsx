'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { localBaseContract } from '../../services/contract';
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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { address, isConnected } = useAccount();

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

    if (!businessId.trim() || !businessName.trim() || !businessDescription.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      console.log('Registering business:', { businessId: businessId.trim(), businessName: businessName.trim() });
      
      const receipt = await localBaseContract.registerBusiness(
        businessId.trim(),
        businessName.trim(),
        address
      );
      
      console.log('Business registration successful:', receipt);
      
      // Also save to localStorage for demo mode
      await LocalBaseAPI.addBusiness({
        id: businessId.trim(),
        name: businessName.trim(),
        description: businessDescription.trim(),
        category: businessCategory,
        address: 'LocalBase Community',
        latitude: 0,
        longitude: 0,
        owner: address,
        isActive: true,
        totalTransactions: 0,
        reputationScore: 0,
        acceptsBasePay: true
      });
      
      setSuccess(true);
      
      // Show success message
      console.log('✅ Business registration and storage successful!', receipt);
      
      // Reset form after 2 seconds and close modal
      setTimeout(() => {
        setBusinessId('');
        setBusinessName('');
        setBusinessDescription('');
        setBusinessCategory('services');
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
      <div className="bg-white rounded-lg max-w-md w-full p-6">
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
                  placeholder="e.g., cafe-ntu-001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Unique identifier for your business (lowercase, no spaces)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g., LocalCafe NTU"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  placeholder="Describe your business..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value as BusinessCategory)}
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
              </div>

              {!isConnected && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-sm text-orange-700">
                    Please connect your wallet to register a business.
                  </p>
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
