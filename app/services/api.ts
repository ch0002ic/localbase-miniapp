import { PersistentStorage } from './storage';
import { Business, CommunityPost, Review, BusinessAnalytics } from '../types/localbase';

export class LocalBaseAPI {
  static async getBusinesses(category?: string): Promise<Business[]> {
    try {
      // Initialize default data if no businesses exist
      PersistentStorage.initializeDefaultData();
      
      const businesses = await PersistentStorage.getStoredBusinesses();
      
      // Filter by category if specified
      if (category && category !== 'all') {
        return businesses.filter(business => business.category === category);
      }
      
      return businesses;
    } catch (error) {
      console.error('Error fetching businesses:', error);
      return [];
    }
  }

  static async addBusiness(business: Business): Promise<void> {
    try {
      await PersistentStorage.addBusiness(business);
    } catch (error) {
      console.error('Error adding business:', error);
      throw error;
    }
  }

  static async getBusinessById(id: string): Promise<Business | null> {
    const businesses = await this.getBusinesses();
    return businesses.find(b => b.id === id) || null;
  }

  static async incrementBusinessTransactions(businessId: string): Promise<void> {
    console.log(`🟡 incrementBusinessTransactions called for businessId: ${businessId}`);
    try {
      const businesses = await PersistentStorage.getStoredBusinesses();
      console.log(`🔍 Before increment - All businesses:`, businesses.map(b => `${b.name}: ${b.totalTransactions}`));
      
      const businessIndex = businesses.findIndex(b => b.id === businessId);
      
      if (businessIndex !== -1) {
        const oldCount = businesses[businessIndex].totalTransactions;
        businesses[businessIndex].totalTransactions += 1;
        const newCount = businesses[businessIndex].totalTransactions;
        
        await PersistentStorage.saveBusinesses(businesses);
        console.log(`✅ Incremented ${businesses[businessIndex].name}: ${oldCount} → ${newCount}`);
        console.log(`🔍 After increment - All businesses:`, businesses.map(b => `${b.name}: ${b.totalTransactions}`));
      } else {
        console.error(`❌ Business with ID ${businessId} not found`);
      }
    } catch (error) {
      console.error('Error incrementing business transactions:', error);
      throw error;
    }
  }

  static async searchBusinesses(query: string): Promise<Business[]> {
    const businesses = await this.getBusinesses();
    return businesses.filter(business => 
      business.name.toLowerCase().includes(query.toLowerCase()) ||
      business.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  static async getCommunityPosts(): Promise<CommunityPost[]> {
    try {
      // Initialize default data if no posts exist
      PersistentStorage.initializeDefaultData();
      
      return await PersistentStorage.getStoredPosts();
    } catch (error) {
      console.error('Error fetching community posts:', error);
      return [];
    }
  }

  static async addCommunityPost(post: CommunityPost): Promise<void> {
    try {
      await PersistentStorage.addPost(post);
    } catch (error) {
      console.error('Error adding community post:', error);
      throw error;
    }
  }

  static async generateBusinessId(): Promise<string> {
    const businesses = await this.getBusinesses();
    return (businesses.length + 1).toString();
  }

  static async generatePostId(): Promise<string> {
    const posts = await this.getCommunityPosts();
    return (posts.length + 1).toString();
  }

  // Review-related methods
  static async getBusinessReviews(businessId: string): Promise<Review[]> {
    try {
      const reviews = await PersistentStorage.getStoredReviews();
      return reviews.filter(review => review.businessId === businessId);
    } catch (error) {
      console.error('Error fetching business reviews:', error);
      return [];
    }
  }

  static async addBusinessReview(businessId: string, reviewData: {
    rating: number;
    comment: string;
    photos?: string[];
    userAddress: string;
  }): Promise<void> {
    try {
      const reviews = await PersistentStorage.getStoredReviews();
      const newReview: Review = {
        id: (reviews.length + 1).toString(),
        businessId,
        userId: reviewData.userAddress,
        userAddress: reviewData.userAddress,
        rating: reviewData.rating,
        comment: reviewData.comment,
        timestamp: Date.now(),
        verified: true, // Could check if user made recent transaction
        helpful: 0,
        photos: reviewData.photos || []
      };

      await PersistentStorage.addReview(newReview);
      
      // Update business average rating
      await this.updateBusinessRating(businessId);
    } catch (error) {
      console.error('Error adding business review:', error);
      throw error;
    }
  }

  static async markReviewHelpful(reviewId: string): Promise<void> {
    try {
      const reviews = await PersistentStorage.getStoredReviews();
      const reviewIndex = reviews.findIndex(r => r.id === reviewId);
      
      if (reviewIndex !== -1) {
        reviews[reviewIndex].helpful += 1;
        await PersistentStorage.saveReviews(reviews);
      }
    } catch (error) {
      console.error('Error marking review helpful:', error);
      throw error;
    }
  }

  private static async updateBusinessRating(businessId: string): Promise<void> {
    try {
      const reviews = await this.getBusinessReviews(businessId);
      const businesses = await PersistentStorage.getStoredBusinesses();
      const businessIndex = businesses.findIndex(b => b.id === businessId);
      
      if (businessIndex !== -1 && reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        businesses[businessIndex].averageRating = totalRating / reviews.length;
        businesses[businessIndex].totalReviews = reviews.length;
        
        await PersistentStorage.saveBusinesses(businesses);
      }
    } catch (error) {
      console.error('Error updating business rating:', error);
    }
  }

  // Analytics methods
  static async getBusinessAnalytics(businessId: string): Promise<BusinessAnalytics | null> {
    try {
      // This would typically come from a real analytics service
      // For demo purposes, we'll generate mock analytics based on stored data
      const business = await this.getBusinessById(businessId);
      const reviews = await this.getBusinessReviews(businessId);
      
      if (!business) return null;

      const analytics: BusinessAnalytics = {
        businessId,
        period: 'month',
        totalRevenue: (business.totalTransactions * 25.50).toString(), // Mock calculation
        totalTransactions: business.totalTransactions,
        averageTransactionValue: '25.50',
        uniqueCustomers: Math.max(1, Math.floor(business.totalTransactions * 0.8)),
        returningCustomers: Math.max(0, Math.floor(business.totalTransactions * 0.3)),
        peakHours: [
          { hour: 9, transactions: 15 },
          { hour: 12, transactions: 32 },
          { hour: 15, transactions: 28 },
          { hour: 18, transactions: 45 },
          { hour: 21, transactions: 22 }
        ],
        topPaymentMethods: [
          { method: 'ETH', count: Math.floor(business.totalTransactions * 0.6) },
          { method: 'USDC', count: Math.floor(business.totalTransactions * 0.4) }
        ],
        reviewStats: {
          averageRating: business.averageRating || 0,
          totalReviews: reviews.length,
          ratingDistribution: reviews.reduce((dist, review) => {
            dist[review.rating] = (dist[review.rating] || 0) + 1;
            return dist;
          }, {} as { [key: number]: number })
        },
        geographicData: [
          { location: 'Downtown', customers: Math.floor(business.totalTransactions * 0.4) },
          { location: 'Midtown', customers: Math.floor(business.totalTransactions * 0.3) },
          { location: 'Uptown', customers: Math.floor(business.totalTransactions * 0.2) },
          { location: 'Suburbs', customers: Math.floor(business.totalTransactions * 0.1) }
        ]
      };

      return analytics;
    } catch (error) {
      console.error('Error fetching business analytics:', error);
      return null;
    }
  }
}
