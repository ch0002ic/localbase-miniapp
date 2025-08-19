'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useMiniKit, useComposeCast, useOpenUrl } from '@coinbase/onchainkit/minikit';
import { Business } from '../../types/localbase';
import { LocalBaseAPI } from '../../services/api';
import { PaymentTransaction } from './PaymentTransaction';
import { VerificationBadge } from '../VerificationBadge';
import { Star, MapPin, Clock, ExternalLink, CreditCard, Share2 } from 'lucide-react';

interface BusinessCardProps {
  business: Business;
  onBusinessUpdate?: () => void; // Callback to refresh parent component
  onViewProfile?: (businessId: string) => void; // Navigate to profile
}

export function BusinessCard({ business, onBusinessUpdate, onViewProfile }: BusinessCardProps) {
  const [paymentAmount, setPaymentAmount] = useState('0.001'); // Smaller default for testing
  const [shownDialogs, setShownDialogs] = useState<Set<string>>(new Set()); // Track shown dialogs
  const [processedPayments, setProcessedPayments] = useState<Set<string>>(new Set()); // Track processed payments
  const { isConnected } = useAccount();
  const { context } = useMiniKit();
  const { composeCast } = useComposeCast();
  const openUrl = useOpenUrl();
  
  const getCategoryColor = (category: string) => {
    const colors = {
      Food: 'bg-orange-100 text-orange-800',
      Shopping: 'bg-purple-100 text-purple-800',
      Services: 'bg-blue-100 text-blue-800',
      Fun: 'bg-pink-100 text-pink-800',
      Health: 'bg-green-100 text-green-800',
      Beauty: 'bg-yellow-100 text-yellow-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatBusinessHours = (hours: Business['hours']) => {
    if (!hours) return 'Hours not available';
    
    const today = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayKey = days[today.getDay()];
    const todayHours = hours[todayKey];
    
    if (!todayHours) return 'Hours not available';
    if (todayHours.closed) return 'Closed today';
    
    // Check if currently open
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const isCurrentlyOpen = currentTime >= todayHours.open && currentTime <= todayHours.close;
    
    // Format time from 24-hour to 12-hour format
    const formatTime = (time: string) => {
      const [hour, minute] = time.split(':');
      const hourNum = parseInt(hour, 10);
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
      return `${displayHour}:${minute} ${ampm}`;
    };
    
    const openTime = formatTime(todayHours.open);
    const closeTime = formatTime(todayHours.close);
    
    // Handle 24-hour businesses
    if (todayHours.open === '00:00' && todayHours.close === '23:59') {
      return 'Open 24 hours';
    }
    
    const status = isCurrentlyOpen ? '🟢 Open' : '🔴 Closed';
    return `${status} today ${openTime} - ${closeTime}`;
  };
  
  const getReputationColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const handleCardClick = () => {
    // Navigate to business detail page
    if (onViewProfile) {
      onViewProfile(business.id);
    }
  };

  const handlePaymentSuccess = async () => {
    console.log(`🔵 handlePaymentSuccess called for ${business.name} (ID: ${business.id})`);
    
    // Check if we've already processed a payment for this business in this session
    const sessionPaymentId = `session-${business.id}`;
    if (processedPayments.has(sessionPaymentId)) {
      console.log(`🚫 Payment already processed for ${business.name}, skipping`);
      return;
    }
    
    // Mark this payment as processed
    setProcessedPayments(prev => new Set([...prev, sessionPaymentId]));
    
    // Generate stable dialog ID for this business success (one per session)
    const dialogId = `success-${business.id}`;
    
    // Only show dialog if not already shown
    if (!shownDialogs.has(dialogId)) {
      setShownDialogs(prev => new Set([...prev, dialogId]));
      alert(`✅ Payment successful!\n\nAmount: ${paymentAmount} ETH\nBusiness: ${business.name}\n\nThis was a real transaction on Base Sepolia!`);
    }
    
    // Automatically increment business transaction count
    try {
      console.log(`🔵 About to increment transactions for ${business.name}`);
      await LocalBaseAPI.incrementBusinessTransactions(business.id);
      console.log(`🔵 Transaction count incremented for ${business.name}`);
      
      // Notify parent component to refresh the business list
      if (onBusinessUpdate) {
        onBusinessUpdate();
      }
      
      console.log(`🔵 Transaction increment completed for ${business.name}`);
    } catch (error) {
      console.error('Failed to increment transaction count:', error);
    }
  };

  const handlePaymentError = (error: string) => {
    // Generate stable dialog ID for this error type
    const dialogId = `error-${business.id}-${error}`;
    
    // Only show dialog if not already shown
    if (!shownDialogs.has(dialogId)) {
      setShownDialogs(prev => new Set([...prev, dialogId]));
      alert(`❌ Payment failed: ${error}`);
    }
  };

  const handleShareBusiness = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (context && composeCast) {
      // Share on Farcaster via MiniKit
      composeCast({
        text: `Check out ${business.name} on LocalBase! 🏪\n\n${business.description}\n\n📍 ${business.address}\n⭐ ${(business.averageRating || 0).toFixed(1)}/5 stars (${business.totalReviews || 0} reviews)`,
        embeds: [window.location.href]
      });
    } else {
      // Fallback to clipboard
      const shareText = `Check out ${business.name} on LocalBase!\n\n${business.description}\n\nLocation: ${business.address}\nRating: ${(business.averageRating || 0).toFixed(1)}/5 stars (${business.totalReviews || 0} reviews)\n\n${window.location.href}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Business info copied to clipboard!');
      });
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (openUrl) {
      openUrl(`https://maps.google.com/search/${encodeURIComponent(business.name + ' ' + business.address)}`);
    } else {
      console.log('View details:', business.id);
    }
  };
  
  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
              {business.avatarUrl || '🏪'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {business.name}
              </h3>
              <VerificationBadge 
                business={{
                  id: business.id,
                  name: business.name,
                  verified: business.id.includes('test') || business.reputationScore > 85, // Hackathon demo logic
                  hackathonPartner: ['test9', 'test8', 'test7'].includes(business.id), // Demo partners
                  transactionCount: business.totalTransactions
                }}
              />
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(business.category)}`}>
                  {business.category}
                </span>
                {business.acceptsBasePay && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CreditCard className="w-3 h-3" />
                    <span className="text-xs font-medium">Base Pay</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className={`font-semibold ${getReputationColor(business.reputationScore)}`}>
                {(business.averageRating || 0).toFixed(1)}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {business.totalReviews || 0} reviews
            </p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {business.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{business.address}</span>
          </div>
          
          {business.hours && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>{formatBusinessHours(business.hours)}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Actions */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            step="0.001"
            min="0.001"
            max="1.0"
            value={paymentAmount}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              console.log('💳 Payment amount changed:', { value, input: e.target.value });
              
              if (value > 1.0) {
                alert('⚠️ Maximum testnet payment is 1.0 ETH. Please use a smaller amount for testing.');
                setPaymentAmount('0.001');
              } else if (value > 0.1) {
                const confirmed = confirm(`⚠️ You're about to pay ${value} ETH (~$${(value * 4000).toFixed(2)} USD estimated).\n\nThis is a real transaction on Base Sepolia testnet.\n\nContinue with this amount?`);
                if (!confirmed) {
                  setPaymentAmount('0.001');
                  return;
                }
                setPaymentAmount(e.target.value);
              } else {
                setPaymentAmount(e.target.value);
              }
            }}
            className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Amount (ETH)"
            onClick={(e) => e.stopPropagation()}
            title="Enter payment amount in ETH (max 1.0 for testnet)"
          />
          <div className="flex flex-col text-xs text-gray-500">
            <span>Max: 1.0 ETH</span>
            <span>~${(parseFloat(paymentAmount) * 4000).toFixed(2)} USD</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1" onClick={(e) => e.stopPropagation()}>
            <PaymentTransaction
              business={business}
              amount={paymentAmount}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
          <button 
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={handleShareBusiness}
            title="Share business"
          >
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={handleViewDetails}
            title="View on map"
          >
            <ExternalLink className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        {!isConnected && (
          <p className="text-xs text-orange-600 mt-2 text-center">
            Connect wallet to make payments
          </p>
        )}
      </div>
    </div>
  );
}
