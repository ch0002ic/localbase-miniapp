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
  hours?: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
}

export interface Review {
  id: string;
  businessId: string;
  userId: string;
  userAddress: string;
  rating: number;
  comment: string;
  timestamp: number;
  transactionHash?: string;
  verified: boolean;
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
