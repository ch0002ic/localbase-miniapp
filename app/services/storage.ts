// Persistent storage service for demo mode
import { Business, CommunityPost } from '../types/localbase';

export class PersistentStorage {
  private static BUSINESSES_KEY = 'localbase_businesses';
  private static POSTS_KEY = 'localbase_posts';

  // Get stored businesses or return empty array
  static getStoredBusinesses(): Business[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(this.BUSINESSES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Save businesses to localStorage
  static saveBusinesses(businesses: Business[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.BUSINESSES_KEY, JSON.stringify(businesses));
    } catch (error) {
      console.error('Failed to save businesses:', error);
    }
  }

  // Add a new business
  static addBusiness(business: Business): void {
    const businesses = this.getStoredBusinesses();
    businesses.unshift(business); // Add to beginning
    this.saveBusinesses(businesses);
  }

  // Get stored posts or return empty array
  static getStoredPosts(): CommunityPost[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(this.POSTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Save posts to localStorage
  static savePosts(posts: CommunityPost[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.POSTS_KEY, JSON.stringify(posts));
    } catch (error) {
      console.error('Failed to save posts:', error);
    }
  }

  // Add a new post
  static addPost(post: CommunityPost): void {
    const posts = this.getStoredPosts();
    posts.unshift(post); // Add to beginning
    this.savePosts(posts);
  }

  // Clear all stored data (for testing)
  static clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.BUSINESSES_KEY);
    localStorage.removeItem(this.POSTS_KEY);
  }

  // Initialize with default mock data if empty
  static initializeDefaultData(): void {
    const businesses = this.getStoredBusinesses();
    const posts = this.getStoredPosts();

    if (businesses.length === 0) {
      this.saveBusinesses(this.getDefaultBusinesses());
    }

    if (posts.length === 0) {
      this.savePosts(this.getDefaultPosts());
    }
  }

  private static getDefaultBusinesses(): Business[] {
    return [
      {
        id: '1',
        name: 'LocalCafe NTU',
        description: 'Best coffee and study spot near campus',
        category: 'food',
        address: '50 Nanyang Ave, Singapore',
        latitude: 1.3483,
        longitude: 103.6831,
        owner: '0x123...',
        isActive: true,
        totalTransactions: 89,
        reputationScore: 98,
        acceptsBasePay: true,
        avatarUrl: '☕',
        hours: {
          monday: { open: '07:00', close: '22:00' },
          tuesday: { open: '07:00', close: '22:00' },
          wednesday: { open: '07:00', close: '22:00' },
          thursday: { open: '07:00', close: '22:00' },
          friday: { open: '07:00', close: '22:00' },
          saturday: { open: '08:00', close: '23:00' },
          sunday: { open: '08:00', close: '21:00' },
        },
      },
      {
        id: '2',
        name: 'TechMart Base',
        description: 'Electronics and crypto hardware',
        category: 'shopping',
        address: '21 Heng Mui Keng Terrace, Singapore',
        latitude: 1.2966,
        longitude: 103.7764,
        owner: '0x456...',
        isActive: true,
        totalTransactions: 234,
        reputationScore: 96,
        acceptsBasePay: true,
        avatarUrl: '📱',
        hours: {
          monday: { open: '10:00', close: '20:00' },
          tuesday: { open: '10:00', close: '20:00' },
          wednesday: { open: '10:00', close: '20:00' },
          thursday: { open: '10:00', close: '20:00' },
          friday: { open: '10:00', close: '20:00' },
          saturday: { open: '10:00', close: '21:00' },
          sunday: { open: '11:00', close: '19:00' },
        },
      },
      {
        id: '3',
        name: 'Wellness Spa Chain',
        description: 'Relaxation services with crypto payments',
        category: 'health',
        address: '1 Marina Bay Sands, Singapore',
        latitude: 1.2834,
        longitude: 103.8607,
        owner: '0x789...',
        isActive: true,
        totalTransactions: 156,
        reputationScore: 94,
        acceptsBasePay: true,
        avatarUrl: '🧘‍♀️',
        hours: {
          monday: { open: '09:00', close: '21:00' },
          tuesday: { open: '09:00', close: '21:00' },
          wednesday: { open: '09:00', close: '21:00' },
          thursday: { open: '09:00', close: '21:00' },
          friday: { open: '09:00', close: '21:00' },
          saturday: { open: '09:00', close: '22:00' },
          sunday: { open: '10:00', close: '20:00' },
        },
      },
      {
        id: '4',
        name: 'Marina Bay Event Space',
        description: 'Premium venue for meetups and crypto events',
        category: 'entertainment',
        address: '2 Marina Bay Dr, Singapore',
        latitude: 1.2838,
        longitude: 103.8612,
        owner: '0xdef...',
        isActive: true,
        totalTransactions: 67,
        reputationScore: 99,
        acceptsBasePay: true,
        avatarUrl: '🎪',
        hours: {
          monday: { open: '10:00', close: '23:00' },
          tuesday: { open: '10:00', close: '23:00' },
          wednesday: { open: '10:00', close: '23:00' },
          thursday: { open: '10:00', close: '23:00' },
          friday: { open: '10:00', close: '02:00' },
          saturday: { open: '10:00', close: '02:00' },
          sunday: { open: '10:00', close: '23:00' },
        },
      },
    ];
  }

  private static getDefaultPosts(): CommunityPost[] {
    return [
      {
        id: '1',
        authorAddress: '0x123...',
        authorName: 'CryptoFoodie',
        content: 'Just had an amazing coffee at LocalCafe NTU! ☕ Paid with Base and got instant loyalty points. The future of payments is here! 🚀 #BasePay #LocalBase',
        businessId: '1',
        businessName: 'LocalCafe NTU',
        timestamp: Date.now() - 1800000, // 30 mins ago
        likes: 12,
        comments: 3,
        tags: ['coffee', 'basepay', 'ntu'],
        liked: false,
      },
      {
        id: '2',
        authorAddress: '0x456...',
        authorName: 'TechStudent',
        content: 'TechRepair Hub fixed my laptop screen in 2 hours and accepted USDC payment! 💻 No more cash or card hassles. Supporting local businesses with crypto feels great! 💪',
        businessId: '2',
        businessName: 'TechRepair Hub',
        timestamp: Date.now() - 3600000, // 1 hour ago
        likes: 8,
        comments: 2,
        tags: ['tech', 'repair', 'usdc'],
      },
      {
        id: '3',
        authorAddress: '0x789...',
        authorName: 'CryptoMeetup',
        content: '🎪 Weekly LocalBase Meetup this Friday 7PM at Marina Bay! Join fellow crypto enthusiasts for networking and demo sessions. Free pizza and drinks sponsored by Base! 🍕🥤 #local #event #meetup',
        timestamp: Date.now() - 7200000, // 2 hours ago
        likes: 24,
        comments: 8,
        tags: ['local', 'event', 'meetup', 'friday'],
      },
      {
        id: '4',
        authorAddress: '0xabc...',
        authorName: 'EventOrganizer',
        content: '🎨 Local Art & Crypto Exhibition opening next week at Clarke Quay! Featuring NFT artists and blockchain demos. Entry free with any Base transaction. Come support local creativity! #local #event #art #nft',
        timestamp: Date.now() - 10800000, // 3 hours ago
        likes: 15,
        comments: 6,
        tags: ['local', 'event', 'art', 'exhibition'],
      },
      {
        id: '5',
        authorAddress: '0xdef...',
        authorName: 'LocalFoodie',
        content: '🍜 Night Market at Chinatown this weekend! Many vendors now accept Base payments. Let\'s show support for local merchants embracing crypto! Who\'s joining? #local #event #food #weekend',
        timestamp: Date.now() - 14400000, // 4 hours ago
        likes: 18,
        comments: 12,
        tags: ['local', 'event', 'food', 'market'],
      },
      {
        id: '6',
        authorAddress: '0x999...',
        authorName: 'CommunityBuilder',
        content: '📅 Monthly LocalBase Community Cleanup at East Coast Park tomorrow 9AM! Volunteers get Base tokens as thank you. Let\'s keep our local community beautiful! 🌟 #local #event #community #volunteer',
        timestamp: Date.now() - 18000000, // 5 hours ago
        likes: 31,
        comments: 15,
        tags: ['local', 'event', 'community', 'cleanup'],
      },
    ];
  }
}

export default PersistentStorage;
