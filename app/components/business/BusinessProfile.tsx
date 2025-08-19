'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import { Business, Review, BusinessAnalytics } from '../../types/localbase';
import { LocalBaseAPI } from '../../services/api';
import { ReviewsSection } from './ReviewsSection';
import { BusinessAnalyticsDashboard } from './BusinessAnalyticsDashboard';
import { PaymentTransaction } from './PaymentTransaction';
import { WithdrawFunds } from './WithdrawFunds';
import { EditBusinessModal } from './EditBusinessModal';
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Globe, 
  Mail,
  CreditCard,
  Shield,
  TrendingUp,
  MessageCircle,
  ArrowLeft,
  Settings,
  Edit3
} from 'lucide-react';

interface BusinessProfileProps {
  businessId: string;
  onBack?: () => void;
}

export function BusinessProfile({ businessId, onBack }: BusinessProfileProps) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [analytics, setAnalytics] = useState<BusinessAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'analytics' | 'hours' | 'management'>('overview');
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const { address } = useAccount();

  const loadBusinessData = useCallback(async () => {
    try {
      setLoading(true);
      const [businessData, reviewsData, analyticsData] = await Promise.all([
        LocalBaseAPI.getBusinessById(businessId),
        LocalBaseAPI.getBusinessReviews(businessId),
        address === business?.owner ? LocalBaseAPI.getBusinessAnalytics(businessId) : null
      ]);

      setBusiness(businessData);
      setReviews(reviewsData || []);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading business data:', error);
    } finally {
      setLoading(false);
    }
  }, [businessId, address, business?.owner]);

  useEffect(() => {
    loadBusinessData();
  }, [loadBusinessData]);

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatBusinessHours = (day: string) => {
    if (!business?.hours?.[day]) return 'Closed';
    const hours = business.hours[day];
    if (hours.closed) return 'Closed';
    return `${hours.open} - ${hours.close}`;
  };

  const isCurrentlyOpen = () => {
    if (!business?.hours) return false;
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.toTimeString().slice(0, 5);
    
    const todayHours = business.hours[currentDay];
    if (!todayHours || todayHours.closed) return false;
    
    return currentTime >= todayHours.open && currentTime <= todayHours.close;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Business not found</p>
        {onBack && (
          <button 
            onClick={onBack}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            ← Back to directory
          </button>
        )}
      </div>
    );
  }

  const isOwner = address === business.owner;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to directory
          </button>
        )}

        {/* Cover Image */}
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg overflow-hidden mb-4">
          {business.coverUrl && (
            <Image 
              src={business.coverUrl} 
              alt={`${business.name} cover`}
              className="w-full h-full object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          
          {/* Business Avatar */}
          <div className="absolute bottom-4 left-4 flex items-end space-x-4">
            <div className="w-20 h-20 bg-white rounded-full p-1">
              {business.avatarUrl ? (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                  {business.avatarUrl.startsWith('http') ? (
                    <Image 
                      src={business.avatarUrl} 
                      alt={business.name}
                      className="w-full h-full rounded-full object-cover"
                      width={80}
                      height={80}
                    />
                  ) : (
                    <span className="text-2xl">{business.avatarUrl}</span>
                  )}
                </div>
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 text-xl font-bold">
                    {business.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            
          <div className="text-white">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">{business.name}</h1>
              {business.verified && (
                <Shield className="w-6 h-6 text-blue-400" />
              )}
            </div>
            <p className="text-sm opacity-90">{business.category}</p>
          </div>
        </div>
      </div>

      {/* Edit Button for Owner - Positioned above business info */}
      {isOwner && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 shadow-sm"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Business</span>
          </button>
        </div>
      )}        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              {renderStars(business.averageRating || 0)}
            </div>
            <p className="text-sm text-gray-600">
              {(business.averageRating || 0).toFixed(1)} ({business.totalReviews || 0} reviews)
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-xl font-bold text-blue-600">{business.totalTransactions}</p>
            <p className="text-sm text-gray-600">Transactions</p>
          </div>
          
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">{business.reputationScore}%</p>
            <p className="text-sm text-gray-600">Reputation</p>
          </div>
          
          <div className="text-center">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
              isCurrentlyOpen() 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isCurrentlyOpen() ? 'Open' : 'Closed'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: MapPin },
            { id: 'reviews', label: 'Reviews', icon: MessageCircle },
            ...(isOwner ? [
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'management', label: 'Management', icon: Settings }
            ] : []),
            { id: 'hours', label: 'Hours', icon: Clock }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as 'overview' | 'reviews' | 'analytics' | 'hours' | 'management')}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-gray-700">{business.description}</p>
            </div>

            {/* Photos */}
            {business.photos && business.photos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Photos</h3>
                <div className="grid grid-cols-3 gap-4">
                  {business.photos.slice(0, 6).map((photo, index) => (
                    <div 
                      key={index}
                      className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                    >
                      <Image 
                        src={photo} 
                        alt={`${business.name} photo ${index + 1}`}
                        className="w-full h-full object-cover"
                        width={200}
                        height={200}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{business.address}</span>
                </div>
                
                {business.phoneNumber && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{business.phoneNumber}</span>
                  </div>
                )}
                
                {business.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{business.email}</span>
                  </div>
                )}
                
                {business.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a 
                      href={business.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {business.socialLinks && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-6">
                  {business.socialLinks.instagram && (
                    <a 
                      href={business.socialLinks.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title="Follow us on Instagram"
                      className="text-pink-500 hover:text-pink-600 transition-all duration-200 transform hover:scale-110"
                    >
                      <i className="bi bi-instagram text-3xl"></i>
                    </a>
                  )}
                  {business.socialLinks.twitter && (
                    <a 
                      href={business.socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      title="Follow us on X (formerly Twitter)"
                      className="text-gray-900 hover:text-gray-700 transition-all duration-200 transform hover:scale-110"
                    >
                      <i className="bi bi-twitter-x text-3xl"></i>
                    </a>
                  )}
                  {business.socialLinks.facebook && (
                    <a 
                      href={business.socialLinks.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title="Follow us on Facebook"
                      className="text-blue-600 hover:text-blue-700 transition-all duration-200 transform hover:scale-110"
                    >
                      <i className="bi bi-facebook text-3xl"></i>
                    </a>
                  )}
                  {business.socialLinks.linkedin && (
                    <a 
                      href={business.socialLinks.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title="Connect with us on LinkedIn"
                      className="text-blue-700 hover:text-blue-800 transition-all duration-200 transform hover:scale-110"
                    >
                      <i className="bi bi-linkedin text-3xl"></i>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Payment Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Make a Payment
              </h3>
              <PaymentTransaction 
                business={business} 
                amount="0.01"
                onSuccess={() => loadBusinessData()} 
              />
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <ReviewsSection 
            businessId={businessId}
            reviews={reviews}
            onReviewSubmitted={() => loadBusinessData()}
          />
        )}

        {activeTab === 'analytics' && isOwner && analytics && (
          <BusinessAnalyticsDashboard analytics={analytics} />
        )}

        {activeTab === 'management' && isOwner && business && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Business Management</h3>
            
            {/* Fund Withdrawal Section */}
            <WithdrawFunds 
              business={business} 
              onSuccess={() => loadBusinessData()} 
            />
            
            {/* Business Status Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-md font-semibold mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                Business Status
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Business Active</div>
                    <div className="text-sm text-gray-500">
                      Controls whether your business can receive payments
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    business.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {business.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  💡 Business status can be toggled through the smart contract interface
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hours' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
            <div className="space-y-2">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                <div key={day} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium capitalize">{day}</span>
                  <span className="text-gray-600">{formatBusinessHours(day)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Edit Business Modal */}
      {showEditModal && (
        <EditBusinessModal
          business={business}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            console.log('Business updated successfully');
            setShowEditModal(false);
            // Refresh business data to reflect changes immediately
            loadBusinessData();
          }}
        />
      )}
    </div>
  );
}
