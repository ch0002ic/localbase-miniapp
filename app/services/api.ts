import { PersistentStorage } from './storage';
import { Business, CommunityPost } from '../types/localbase';

export class LocalBaseAPI {
  static async getBusinesses(category?: string): Promise<Business[]> {
    try {
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
}
