'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Award, Gift, Star, ShoppingBag } from 'lucide-react';

interface LoyaltyNFT {
  tokenId: string;
  businessId: string;
  businessName: string;
  tier: string;
  discountPercentage: number;
  imageUrl: string;
  metadata?: {
    description: string;
    benefits: string[];
  };
}

export function NFTRewards() {
  const { address, isConnected } = useAccount();
  const [loyaltyNFTs, setLoyaltyNFTs] = useState<LoyaltyNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRewards: 0,
    totalSavings: 0,
    activeBenefits: 0,
  });
  
  // Reward usage state
  const [usedRewards, setUsedRewards] = useState<{[tokenId: string]: number}>({});
  const [usingReward, setUsingReward] = useState<{[tokenId: string]: boolean}>({});
  
  const loadUsedRewards = () => {
    if (!address) return;
    
    const usedRewardsKey = `used_rewards_${address}`;
    const stored = localStorage.getItem(usedRewardsKey);
    if (stored) {
      setUsedRewards(JSON.parse(stored));
    }
  };

  const fetchLoyaltyNFTs = useCallback(async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      const mockNFTs: LoyaltyNFT[] = [
        {
          tokenId: '1',
          businessId: '1',
          businessName: 'LocalCafe NTU',
          tier: 'Gold Member',
          discountPercentage: 15,
          imageUrl: '☕',
          metadata: {
            description: 'Exclusive Gold membership for frequent coffee lovers',
            benefits: [
              '15% off all drinks',
              'Free pastry every 10th visit',
              'Priority seating',
              'Special member events'
            ],
          },
        },
        {
          tokenId: '2',
          businessId: '3',
          businessName: 'Campus Bookstore',
          tier: 'Silver Member',
          discountPercentage: 10,
          imageUrl: '📚',
          metadata: {
            description: 'Silver loyalty member with exclusive student benefits',
            benefits: [
              '10% off textbooks',
              'Early access to new arrivals',
              'Free bookmark with purchase',
            ],
          },
        },
      ];
      
      setLoyaltyNFTs(mockNFTs);
      setStats({
        totalRewards: mockNFTs.length,
        totalSavings: 45.20, // Mock savings amount
        activeBenefits: mockNFTs.reduce((acc, nft) => acc + (nft.metadata?.benefits.length || 0), 0),
      });

      // Load used rewards from localStorage
      loadUsedRewards();
    } catch (error) {
      console.error('Failed to fetch loyalty NFTs:', error);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      fetchLoyaltyNFTs();
    } else {
      setLoading(false);
    }
  }, [fetchLoyaltyNFTs, address, isConnected]);

  const canUseReward = (tokenId: string) => {
    const lastUsed = usedRewards[tokenId];
    if (!lastUsed) return true;
    
    // 24 hour cooldown (86400000 ms)
    const cooldownPeriod = 24 * 60 * 60 * 1000;
    return Date.now() - lastUsed > cooldownPeriod;
  };

  const getTimeUntilNextUse = (tokenId: string) => {
    const lastUsed = usedRewards[tokenId];
    if (!lastUsed) return null;
    
    const cooldownPeriod = 24 * 60 * 60 * 1000;
    const timeLeft = cooldownPeriod - (Date.now() - lastUsed);
    
    if (timeLeft <= 0) return null;
    
    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours}h ${minutes}m`;
  };

  const redeemReward = async (nft: LoyaltyNFT) => {
    if (!address || !canUseReward(nft.tokenId)) return;
    
    setUsingReward(prev => ({ ...prev, [nft.tokenId]: true }));
    
    try {
      // Simulate using the reward (could be an API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update used rewards
      const newUsedRewards = {
        ...usedRewards,
        [nft.tokenId]: Date.now()
      };
      setUsedRewards(newUsedRewards);
      
      // Save to localStorage
      const usedRewardsKey = `used_rewards_${address}`;
      localStorage.setItem(usedRewardsKey, JSON.stringify(newUsedRewards));
      
      // Update total savings
      const newSavings = stats.totalSavings + (nft.discountPercentage * 2); // Mock savings calculation
      setStats(prev => ({ ...prev, totalSavings: newSavings }));
      
      // Show success message
      alert(`🎉 Reward Used Successfully!\n\n${nft.tier} benefit activated for ${nft.businessName}\n${nft.discountPercentage}% discount applied!\n\nNext use available in 24 hours.`);
      
    } catch (error) {
      console.error('Failed to use reward:', error);
      alert('Failed to use reward. Please try again.');
    } finally {
      setUsingReward(prev => ({ ...prev, [nft.tokenId]: false }));
    }
  };
  
  if (!isConnected) {
    return (
      <div className="p-6 text-center">
        <div className="max-w-md mx-auto">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to view your loyalty rewards and exclusive benefits from local businesses.
          </p>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your rewards...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          <Award className="inline-block w-6 h-6 mr-2 text-blue-600" />
          Your Loyalty Rewards
        </h1>
        <p className="text-gray-600">NFT-powered loyalty benefits from your favorite local businesses</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Rewards</p>
              <p className="text-2xl font-bold">{stats.totalRewards}</p>
            </div>
            <Gift className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Savings</p>
              <p className="text-2xl font-bold">${stats.totalSavings}</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Active Benefits</p>
              <p className="text-2xl font-bold">{stats.activeBenefits}</p>
            </div>
            <Star className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>
      
      {/* Rewards Grid */}
      {loyaltyNFTs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No loyalty rewards yet</h3>
          <p className="text-gray-600 mb-6">
            Shop at local businesses to earn exclusive NFT rewards and unlock special benefits!
          </p>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
            Discover Businesses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loyaltyNFTs.map((nft) => (
            <div key={nft.tokenId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
              {/* NFT Image/Icon */}
              <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-6xl">
                {nft.imageUrl}
              </div>
              
              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{nft.businessName}</h3>
                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                      {nft.tier}
                    </span>
                    {usedRewards[nft.tokenId] && (
                      <span className="text-xs text-gray-500">
                        Last used: {new Date(usedRewards[nft.tokenId]).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {nft.metadata?.description}
                </p>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-800">
                      {nft.discountPercentage}% Discount
                    </span>
                  </div>
                  
                  {nft.metadata?.benefits && (
                    <div className="space-y-1">
                      {nft.metadata.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-green-700">
                          <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => redeemReward(nft)}
                  disabled={!canUseReward(nft.tokenId) || usingReward[nft.tokenId]}
                  className={`w-full py-2 rounded-lg transition-colors font-medium ${
                    canUseReward(nft.tokenId) && !usingReward[nft.tokenId]
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {usingReward[nft.tokenId] ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Using...
                    </div>
                  ) : canUseReward(nft.tokenId) ? (
                    'Use Reward'
                  ) : (
                    `Available in ${getTimeUntilNextUse(nft.tokenId)}`
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* How it Works */}
      <div className="mt-12 bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How Loyalty Rewards Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Shop & Pay</h4>
            <p className="text-sm text-gray-600">
              Make purchases at participating businesses using Base Pay
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Earn NFTs</h4>
            <p className="text-sm text-gray-600">
              Automatically receive loyalty NFTs based on your spending
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Gift className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Unlock Benefits</h4>
            <p className="text-sm text-gray-600">
              Enjoy exclusive discounts and perks at your favorite places
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
