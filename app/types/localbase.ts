export interface Business {
  id: string;
  name: string;
  description: string;
  category: BusinessCategory;
  address: string;
  latitude: number;
  longitude: number;
  owner: string;
  isActive: boolean;
  totalTransactions: number;
  reputationScore: number;
  avatarUrl?: string;
  coverUrl?: string;
  acceptsBasePay: boolean;
  phoneNumber?: string;
  website?: string;
  email?: string;
  hours?: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  // Enhanced fields
  photos?: string[];
  videos?: string[];
  specialties?: string[];
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  verified?: boolean;
  verificationDate?: number;
  averageRating?: number;
  totalReviews?: number;
  responseTime?: string; // e.g., "Usually responds within 1 hour"
  establishedYear?: number;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface Review {
  id: string;
  businessId: string;
  userId: string;
  userAddress: string;
  userName?: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  timestamp: number;
  transactionHash?: string;
  verified: boolean;
  helpful: number; // Number of users who found this helpful
  photos?: string[]; // Review photos
}

export interface LoyaltyReward {
  id: string;
  businessId: string;
  tokenId: string;
  tier: string;
  discountPercentage: number;
  isActive: boolean;
  metadata?: {
    image: string;
    description: string;
    benefits: string[];
  };
}

export interface Transaction {
  id: string;
  businessId: string;
  userAddress: string;
  amount: string;
  currency: 'USDC' | 'ETH';
  transactionHash: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  description?: string;
}

export interface CommunityPost {
  id: string;
  authorAddress: string;
  authorName?: string;
  content: string;
  images?: string[];
  businessId?: string;
  timestamp: number;
  likes: number;
  comments: number;
  tags?: string[];
}

export type BusinessCategory = 
  | 'food' 
  | 'shopping' 
  | 'services' 
  | 'fun' 
  | 'health' 
  | 'beauty';

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

export interface PaymentRequest {
  businessId: string;
  amount: string;
  currency: 'USDC' | 'ETH';
  description: string;
  metadata?: {
    items?: Array<{
      name: string;
      quantity: number;
      price: string;
    }>;
  };
}

// Enhanced business features types
export interface BusinessAnalytics {
  businessId: string;
  period: 'day' | 'week' | 'month' | 'year';
  totalRevenue: string;
  totalTransactions: number;
  averageTransactionValue: string;
  uniqueCustomers: number;
  returningCustomers: number;
  peakHours: Array<{ hour: number; transactions: number }>;
  topPaymentMethods: Array<{ method: string; count: number }>;
  reviewStats: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
  };
  geographicData: Array<{ location: string; customers: number }>;
}

export interface BusinessVerification {
  businessId: string;
  status: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verificationDate?: number;
  documents: Array<{
    type: 'business_license' | 'tax_id' | 'address_proof' | 'owner_id';
    url: string;
    verified: boolean;
  }>;
  verificationLevel: 'basic' | 'enhanced' | 'premium';
  badges: string[]; // e.g., ['local_favorite', 'quick_response', 'eco_friendly']
}

export interface BusinessHours {
  monday: { open: string; close: string; closed?: boolean };
  tuesday: { open: string; close: string; closed?: boolean };
  wednesday: { open: string; close: string; closed?: boolean };
  thursday: { open: string; close: string; closed?: boolean };
  friday: { open: string; close: string; closed?: boolean };
  saturday: { open: string; close: string; closed?: boolean };
  sunday: { open: string; close: string; closed?: boolean };
}

export interface BusinessInsights {
  weeklyGrowth: number;
  monthlyGrowth: number;
  customerSatisfaction: number;
  recommendationScore: number;
  competitorComparison: {
    averageRating: number;
    transactionVolume: number;
    responseTime: number;
  };
}
