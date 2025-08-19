import { PersistentStorage } from './storage';
import { Business, CommunityPost, Review, BusinessAnalytics } from '../types/localbase';
import { isValidImageUrl } from '../utils/validation';

export class LocalBaseAPI {
  // Clean up invalid image URLs from business data
  private static cleanupBusinessImageUrls(business: Business): Business {
    return {
      ...business,
      avatarUrl: isValidImageUrl(business.avatarUrl) ? business.avatarUrl : '',
      coverUrl: isValidImageUrl(business.coverUrl) ? business.coverUrl : ''
    };
  }

  // Clean up all corrupted business data
  static async cleanupCorruptedData(): Promise<void> {
    try {
      console.log('🔧 Starting corrupted data cleanup...');
      const businesses = await PersistentStorage.getStoredBusinesses();
      let hasChanges = false;
      
      const cleanedBusinesses = businesses.map(business => {
        const originalBusiness = { ...business };
        
        // Clean up image URLs
        const cleanedBusiness = this.cleanupBusinessImageUrls(business);
        
        // AGGRESSIVE FIX: Force correct hours for known businesses
        if (cleanedBusiness.name?.toLowerCase().includes('mcdonald')) {
          console.log('🍟 Fixing McDonald\'s hours data...');
          cleanedBusiness.hours = {
            monday: { open: '06:00', close: '23:00', closed: false },
            tuesday: { open: '06:00', close: '23:00', closed: false },
            wednesday: { open: '06:00', close: '23:00', closed: false },
            thursday: { open: '06:00', close: '23:00', closed: false },
            friday: { open: '06:00', close: '23:00', closed: false },
            saturday: { open: '06:00', close: '23:00', closed: false },
            sunday: { open: '07:00', close: '22:00', closed: false }
          };
          hasChanges = true;
        } else {
          // Fix business hours data for other businesses
          if (cleanedBusiness.hours) {
            const fixedHours: { [key: string]: { open: string; close: string; closed?: boolean } } = {};
            
            Object.entries(cleanedBusiness.hours).forEach(([day, hours]) => {
              if (hours && typeof hours === 'object' && 'open' in hours && 'close' in hours) {
                let openTime = this.normalizeTimeFormat(hours.open);
                let closeTime = this.normalizeTimeFormat(hours.close);
                
                // Fix specific data corruption issues
                // If close time is early morning (00:00-05:59) or same as open time, it's likely corrupted
                const openHour = parseInt(openTime.split(':')[0], 10);
                const closeHour = parseInt(closeTime.split(':')[0], 10);
                
                if (closeHour >= 0 && closeHour <= 5 && closeHour <= openHour) {
                  // Default business hours for other businesses
                  openTime = '09:00';
                  closeTime = day === 'sunday' ? '18:00' : '21:00';
                }
                
                fixedHours[day] = {
                  open: openTime,
                  close: closeTime,
                  closed: hours.closed || false
                };
              } else {
                // Default hours if data is completely corrupted
                fixedHours[day] = {
                  open: '09:00',
                  close: '18:00',
                  closed: false
                };
              }
            });
            
            cleanedBusiness.hours = fixedHours;
          }
        }
        
        // Check if any changes were made
        if (JSON.stringify(originalBusiness) !== JSON.stringify(cleanedBusiness)) {
          hasChanges = true;
        }
        
        return cleanedBusiness;
      });
      
      if (hasChanges) {
        await PersistentStorage.saveBusinesses(cleanedBusinesses);
        console.log('✅ Cleaned up corrupted business data including hours');
      } else {
        console.log('ℹ️ No corrupted data found to clean up');
      }
    } catch (error) {
      console.error('Error cleaning up corrupted data:', error);
    }
  }

  // Helper function to normalize time format
  private static normalizeTimeFormat(time: string): string {
    if (!time || typeof time !== 'string') return '09:00';
    
    // Remove any invalid characters and ensure HH:MM format
    const cleaned = time.replace(/[^0-9:]/g, '');
    const parts = cleaned.split(':');
    
    if (parts.length !== 2) return '09:00';
    
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    
    // Validate hours and minutes
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return '09:00'; // Default fallback
    }
    
    // Return properly formatted time
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  // Function to completely reset business data to defaults (use with caution)
  static async resetBusinessData(): Promise<void> {
    try {
      await PersistentStorage.clearAllData();
      await PersistentStorage.initializeDefaultData();
      console.log('✅ Reset all business data to defaults');
    } catch (error) {
      console.error('Error resetting business data:', error);
    }
  }

  static async getBusinesses(category?: string): Promise<Business[]> {
    try {
      // Initialize default data if no businesses exist
      PersistentStorage.initializeDefaultData();
      
      const businesses = await PersistentStorage.getStoredBusinesses();
      
      // Clean up invalid image URLs
      const cleanedBusinesses = businesses.map(business => this.cleanupBusinessImageUrls(business));
      
      // Filter by category if specified
      if (category && category !== 'all') {
        return cleanedBusinesses.filter(business => business.category === category);
      }
      
      return cleanedBusinesses;
    } catch (error) {
      console.error('Error fetching businesses:', error);
      return [];
    }
  }

  // Force refresh of default data (for testing/updating)
  static async refreshDefaultData(): Promise<void> {
    try {
      PersistentStorage.clearAll();
      PersistentStorage.initializeDefaultData();
      console.log('✅ Default data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing default data:', error);
      throw error;
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

  static async updateBusiness(updatedBusiness: Business): Promise<void> {
    try {
      const businesses = await PersistentStorage.getStoredBusinesses();
      const businessIndex = businesses.findIndex(b => b.id === updatedBusiness.id);
      
      if (businessIndex === -1) {
        throw new Error('Business not found');
      }
      
      // Clean up image URLs before updating
      const cleanedBusiness = this.cleanupBusinessImageUrls(updatedBusiness);
      
      // Update the business while preserving readonly fields
      businesses[businessIndex] = {
        ...businesses[businessIndex],
        ...cleanedBusiness,
        // Preserve these fields that shouldn't be edited
        id: businesses[businessIndex].id,
        owner: businesses[businessIndex].owner,
        totalTransactions: businesses[businessIndex].totalTransactions,
        reputationScore: businesses[businessIndex].reputationScore,
        verified: businesses[businessIndex].verified,
        averageRating: businesses[businessIndex].averageRating,
        totalReviews: businesses[businessIndex].totalReviews,
      };
      
      await PersistentStorage.saveBusinesses(businesses);
      console.log(`Business ${updatedBusiness.id} updated successfully`);
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  }

  static async deleteBusiness(businessId: string): Promise<void> {
    try {
      const businesses = await PersistentStorage.getStoredBusinesses();
      const filteredBusinesses = businesses.filter(b => b.id !== businessId);
      await PersistentStorage.saveBusinesses(filteredBusinesses);
      
      // Also remove related reviews
      const reviews = await PersistentStorage.getStoredReviews();
      const filteredReviews = reviews.filter(r => r.businessId !== businessId);
      await PersistentStorage.saveReviews(filteredReviews);
      
      console.log(`Business ${businessId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting business:', error);
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
      const review: Review = {
        id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        businessId,
        userId: `user_${reviewData.userAddress}`,
        userAddress: reviewData.userAddress,
        userName: undefined,
        rating: reviewData.rating,
        comment: reviewData.comment,
        timestamp: Date.now(),
        verified: false,
        helpful: 0,
        helpfulUsers: [], // Initialize empty array for helpful users
        photos: reviewData.photos || []
      };

      await PersistentStorage.addReview(review);
      
      // Update business average rating
      await this.updateBusinessRating(businessId);
    } catch (error) {
      console.error('Error adding business review:', error);
      throw error;
    }
  }

  static async updateReview(reviewId: string, updateData: {
    rating?: number;
    comment?: string;
  }): Promise<void> {
    try {
      const reviews = await PersistentStorage.getStoredReviews();
      const reviewIndex = reviews.findIndex(r => r.id === reviewId);
      
      if (reviewIndex === -1) {
        throw new Error('Review not found');
      }
      
      // Update the review
      reviews[reviewIndex] = {
        ...reviews[reviewIndex],
        ...updateData,
        timestamp: Date.now() // Update timestamp to show it was edited
      };
      
      await PersistentStorage.saveReviews(reviews);
      
      // Update business average rating if rating was changed
      if (updateData.rating !== undefined) {
        await this.updateBusinessRating(reviews[reviewIndex].businessId);
      }
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }

  static async updateCommunityPost(postId: string, updateData: {
    content?: string;
    tags?: string[];
  }): Promise<void> {
    try {
      const posts = await PersistentStorage.getStoredPosts();
      const postIndex = posts.findIndex(p => p.id === postId);
      
      if (postIndex === -1) {
        throw new Error('Post not found');
      }
      
      // Update the post
      posts[postIndex] = {
        ...posts[postIndex],
        ...updateData,
        timestamp: Date.now() // Update timestamp to show it was edited
      };
      
      await PersistentStorage.savePosts(posts);
    } catch (error) {
      console.error('Error updating community post:', error);
      throw error;
    }
  }

  // Delete methods
  static async deleteReview(reviewId: string, userAddress: string): Promise<void> {
    try {
      const reviews = await PersistentStorage.getStoredReviews();
      const reviewIndex = reviews.findIndex(r => r.id === reviewId);
      
      if (reviewIndex === -1) {
        throw new Error('Review not found');
      }
      
      // Verify the review belongs to the user
      const review = reviews[reviewIndex];
      if (review.userAddress !== userAddress) {
        throw new Error('Unauthorized: You can only delete your own reviews');
      }
      
      // Remove the review
      const deletedReview = reviews.splice(reviewIndex, 1)[0];
      await PersistentStorage.saveReviews(reviews);
      
      // Update business average rating after deletion
      await this.updateBusinessRating(deletedReview.businessId);
      
      console.log(`✅ Review ${reviewId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  static async deleteCommunityPost(postId: string, userAddress: string): Promise<void> {
    try {
      const posts = await PersistentStorage.getStoredPosts();
      const postIndex = posts.findIndex(p => p.id === postId);
      
      if (postIndex === -1) {
        throw new Error('Post not found');
      }
      
      // Verify the post belongs to the user
      const post = posts[postIndex];
      if (post.authorAddress !== userAddress) {
        throw new Error('Unauthorized: You can only delete your own posts');
      }
      
      // Remove the post
      posts.splice(postIndex, 1);
      await PersistentStorage.savePosts(posts);
      
      // Clean up associated comments from localStorage
      const commentsKey = `comments_${postId}`;
      localStorage.removeItem(commentsKey);
      
      // Clean up likes data from localStorage
      const likesKey = `likes_${postId}`;
      localStorage.removeItem(likesKey);
      
      console.log(`✅ Community post ${postId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting community post:', error);
      throw error;
    }
  }

  static async toggleReviewHelpful(reviewId: string, userAddress: string): Promise<boolean> {
    try {
      const reviews = await PersistentStorage.getStoredReviews();
      const reviewIndex = reviews.findIndex(r => r.id === reviewId);
      
      if (reviewIndex !== -1) {
        const review = reviews[reviewIndex];
        
        // Initialize helpfulUsers array if it doesn't exist (for backward compatibility)
        if (!review.helpfulUsers) {
          review.helpfulUsers = [];
        }
        
        const userIndex = review.helpfulUsers.indexOf(userAddress);
        
        if (userIndex === -1) {
          // User hasn't liked this review, add their like
          review.helpfulUsers.push(userAddress);
          review.helpful += 1;
          await PersistentStorage.saveReviews(reviews);
          return true; // User liked the review
        } else {
          // User has already liked this review, remove their like
          review.helpfulUsers.splice(userIndex, 1);
          review.helpful = Math.max(0, review.helpful - 1); // Ensure it doesn't go below 0
          await PersistentStorage.saveReviews(reviews);
          return false; // User unliked the review
        }
      }
      return false;
    } catch (error) {
      console.error('Error toggling review helpful:', error);
      throw error;
    }
  }

  // Keep the old method for backward compatibility
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

  // Comment management methods
  static async deleteComment(postId: string, commentId: string, userAddress: string): Promise<void> {
    try {
      // Get comments from localStorage for community posts
      const commentsKey = `comments_${postId}`;
      const storedComments = localStorage.getItem(commentsKey);
      
      if (!storedComments) {
        throw new Error('Comments not found');
      }
      
      const comments = JSON.parse(storedComments);
      const commentIndex = comments.findIndex((c: {id: string; author: string}) => c.id === commentId);
      
      if (commentIndex === -1) {
        throw new Error('Comment not found');
      }
      
      // Verify the comment belongs to the user (author validation)
      const comment = comments[commentIndex];
      const commentAuthor = comment.author;
      const currentUserShort = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
      
      if (commentAuthor !== currentUserShort) {
        throw new Error('Unauthorized: You can only delete your own comments');
      }
      
      // Remove the comment
      comments.splice(commentIndex, 1);
      
      // Save updated comments back to localStorage
      localStorage.setItem(commentsKey, JSON.stringify(comments));
      
      console.log(`✅ Comment ${commentId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  static async deleteReviewComment(reviewId: string, commentId: string, userAddress: string): Promise<void> {
    try {
      // For review comments, we'll store them in a similar localStorage pattern
      const commentsKey = `review_comments_${reviewId}`;
      const storedComments = localStorage.getItem(commentsKey);
      
      if (!storedComments) {
        throw new Error('Review comments not found');
      }
      
      const comments = JSON.parse(storedComments);
      const commentIndex = comments.findIndex((c: {id: string; author: string}) => c.id === commentId);
      
      if (commentIndex === -1) {
        throw new Error('Review comment not found');
      }
      
      // Verify the comment belongs to the user
      const comment = comments[commentIndex];
      const commentAuthor = comment.author;
      const currentUserShort = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
      
      if (commentAuthor !== currentUserShort) {
        throw new Error('Unauthorized: You can only delete your own comments');
      }
      
      // Remove the comment
      comments.splice(commentIndex, 1);
      
      // Save updated comments back to localStorage
      localStorage.setItem(commentsKey, JSON.stringify(comments));
      
      console.log(`✅ Review comment ${commentId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting review comment:', error);
      throw error;
    }
  }

  private static async updateBusinessRating(businessId: string): Promise<void> {
    try {
      const reviews = await this.getBusinessReviews(businessId);
      const businesses = await PersistentStorage.getStoredBusinesses();
      const businessIndex = businesses.findIndex(b => b.id === businessId);
      
      if (businessIndex !== -1) {
        if (reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          businesses[businessIndex].averageRating = totalRating / reviews.length;
          businesses[businessIndex].totalReviews = reviews.length;
        } else {
          // When no reviews, set rating to 0 and review count to 0
          businesses[businessIndex].averageRating = 0;
          businesses[businessIndex].totalReviews = 0;
        }
        
        await PersistentStorage.saveBusinesses(businesses);
        console.log(`✅ Business ${businessId} rating updated: ${businesses[businessIndex].averageRating.toFixed(1)} (${businesses[businessIndex].totalReviews} reviews)`);
      }
    } catch (error) {
      console.error('Error updating business rating:', error);
    }
  }

  // Analytics methods
  static async getBusinessAnalytics(businessId: string): Promise<BusinessAnalytics | null> {
    try {
      // Get both local and onchain business data
      const business = await this.getBusinessById(businessId);
      const reviews = await this.getBusinessReviews(businessId);
      
      if (!business) return null;

      // Try to get real onchain data
      let onchainData = null;
      try {
        const { SmartContractService } = await import('./smartContract');
        if (SmartContractService.isEnabled()) {
          onchainData = await SmartContractService.getBusinessInfo(businessId);
        }
      } catch (error) {
        console.warn('Could not fetch onchain business data:', error);
      }

      // Use onchain data if available, otherwise fall back to mock data
      const realTotalReceived = onchainData ? parseFloat(onchainData.totalReceived) : 0;
      const realTransactionCount = onchainData ? onchainData.transactionCount : business.totalTransactions;
      const averageTransactionValue = realTransactionCount > 0 ? (realTotalReceived / realTransactionCount).toFixed(4) : '0.001';

      const analytics: BusinessAnalytics = {
        businessId,
        period: 'month',
        totalRevenue: onchainData ? (realTotalReceived * 3100).toFixed(2) : (business.totalTransactions * 25.50).toString(), // Convert ETH to USD (~$3100)
        totalTransactions: realTransactionCount,
        averageTransactionValue: onchainData ? averageTransactionValue : '0.001',
        uniqueCustomers: Math.max(1, Math.floor(realTransactionCount * 0.8)),
        returningCustomers: Math.max(0, Math.floor(realTransactionCount * 0.3)),
        peakHours: [
          { hour: 9, transactions: Math.floor(realTransactionCount * 0.15) },
          { hour: 12, transactions: Math.floor(realTransactionCount * 0.25) },
          { hour: 15, transactions: Math.floor(realTransactionCount * 0.20) },
          { hour: 18, transactions: Math.floor(realTransactionCount * 0.30) },
          { hour: 21, transactions: Math.floor(realTransactionCount * 0.10) }
        ],
        topPaymentMethods: [
          { method: 'ETH', count: Math.floor(realTransactionCount * 1.0) }, // All payments are ETH
          { method: 'Other', count: 0 }
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
          { location: 'Downtown', customers: Math.floor(realTransactionCount * 0.4) },
          { location: 'Midtown', customers: Math.floor(realTransactionCount * 0.3) },
          { location: 'Uptown', customers: Math.floor(realTransactionCount * 0.2) },
          { location: 'Suburbs', customers: Math.floor(realTransactionCount * 0.1) }
        ]
      };

      return analytics;
    } catch (error) {
      console.error('Error fetching business analytics:', error);
      return null;
    }
  }
}
