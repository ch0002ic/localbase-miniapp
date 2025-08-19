'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Business } from '../../types/localbase';
import { LocalBaseAPI } from '../../services/api';
import { SmartContractService } from '../../services/smartContract';
import { 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  MapPin, 
  Clock,
  Users
} from 'lucide-react';

interface MyBusinessesProps {
  onCreateBusiness: () => void;
  onViewBusiness: (businessId: string) => void;
  refreshKey?: number;
}

export function MyBusinesses({ onCreateBusiness, onViewBusiness, refreshKey }: MyBusinessesProps) {
  const [myBusinesses, setMyBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { address, isConnected } = useAccount();

  const loadMyBusinesses = useCallback(async () => {
    if (!isConnected || !address) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const allBusinesses = await LocalBaseAPI.getBusinesses();
      const userBusinesses = allBusinesses.filter(business => 
        business.owner?.toLowerCase() === address.toLowerCase()
      );
      setMyBusinesses(userBusinesses);
    } catch (error) {
      console.error('Error loading user businesses:', error);
    } finally {
      setLoading(false);
    }
  }, [address, isConnected]);

  useEffect(() => {
    loadMyBusinesses();
  }, [loadMyBusinesses]);

  // Refresh when refreshKey changes (when returning from business profile)
  useEffect(() => {
    if (refreshKey && refreshKey > 0) {
      loadMyBusinesses();
    }
  }, [refreshKey, loadMyBusinesses]);

  const handleToggleStatus = async (businessId: string, currentStatus: boolean) => {
    if (!SmartContractService.isEnabled()) {
      alert('Smart contract mode is not enabled');
      return;
    }

    setActionLoading(businessId);
    try {
      await SmartContractService.toggleBusinessStatus(businessId);
      
      // Update local state
      setMyBusinesses(prev => prev.map(business => 
        business.id === businessId 
          ? { ...business, isActive: !currentStatus }
          : business
      ));

      alert(`Business ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error toggling business status:', error);
      alert('Failed to update business status. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteBusiness = async (businessId: string, businessName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${businessName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setActionLoading(businessId);
    try {
      await LocalBaseAPI.deleteBusiness(businessId);
      setMyBusinesses(prev => prev.filter(business => business.id !== businessId));
      alert('Business deleted successfully!');
    } catch (error) {
      console.error('Error deleting business:', error);
      alert('Failed to delete business. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const formatOperatingHours = (business: Business) => {
    if (!business.hours?.monday) return 'Hours not set';
    const { open, close } = business.hours.monday;
    return `${open} - ${close}`;
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
        <p className="text-gray-600">Connect your wallet to manage your businesses</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your businesses...</p>
      </div>
    );
  }

  if (myBusinesses.length === 0) {
    return (
      <div className="text-center py-12">
        <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Businesses Yet</h3>
        <p className="text-gray-600 mb-6">Start by registering your first business on LocalBase</p>
        <button
          onClick={onCreateBusiness}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Register Your First Business
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Businesses</h2>
          <p className="text-gray-600">Manage your registered businesses</p>
        </div>
        <button
          onClick={onCreateBusiness}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Business
        </button>
      </div>

      {/* Business Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myBusinesses.map((business) => (
          <div key={business.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                  {business.avatarUrl || business.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{business.name}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    business.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {business.isActive ? (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Inactive
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Business Info */}
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600 line-clamp-2">{business.description}</p>
              
              {business.address && (
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  {business.address}
                </div>
              )}

              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {formatOperatingHours(business)}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 py-3 border-t border-gray-100">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{business.totalTransactions}</p>
                <p className="text-xs text-gray-600">Transactions</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">
                  {business.averageRating || 0}
                </p>
                <p className="text-xs text-gray-600">Rating</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{business.totalReviews || 0}</p>
                <p className="text-xs text-gray-600">Reviews</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onViewBusiness(business.id)}
                className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                View Details
              </button>
              
              <button
                onClick={() => handleToggleStatus(business.id, business.isActive)}
                disabled={actionLoading === business.id}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  business.isActive
                    ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {actionLoading === business.id ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                ) : business.isActive ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => handleDeleteBusiness(business.id, business.name)}
                disabled={actionLoading === business.id}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
