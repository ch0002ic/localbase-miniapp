// Persistent storage service for demo mode
import { Business, CommunityPost, Review } from '../types/localbase';

export class PersistentStorage {
  private static BUSINESSES_KEY = 'localbase_businesses';
  private static POSTS_KEY = 'localbase_posts';
  private static REVIEWS_KEY = 'localbase_reviews';

  // Get stored businesses or return empty array
  static getStoredBusinesses(): Business[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(this.BUSINESSES_KEY);
      const businesses = stored ? JSON.parse(stored) : [];
      
      // Migrate existing businesses to add missing fields
      return businesses.map((business: Partial<Business>) => ({
        ...business,
        verified: business.verified ?? false,
        averageRating: business.averageRating ?? 0,
        totalReviews: business.totalReviews ?? 0,
      })) as Business[];
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

  // Get stored reviews or return empty array
  static getStoredReviews(): Review[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(this.REVIEWS_KEY);
      const reviews = stored ? JSON.parse(stored) : [];
      
      // Migrate existing reviews to add missing helpfulUsers field
      return reviews.map((review: Partial<Review>) => ({
        ...review,
        helpfulUsers: review.helpfulUsers ?? [], // Initialize empty array if missing
      })) as Review[];
    } catch {
      return [];
    }
  }

  // Save reviews to localStorage
  static saveReviews(reviews: Review[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.REVIEWS_KEY, JSON.stringify(reviews));
    } catch (error) {
      console.error('Failed to save reviews:', error);
    }
  }

  // Add a new review
  static addReview(review: Review): void {
    const reviews = this.getStoredReviews();
    reviews.unshift(review); // Add to beginning
    this.saveReviews(reviews);
  }

  // Clear all stored data (for testing)
  static clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.BUSINESSES_KEY);
    localStorage.removeItem(this.POSTS_KEY);
    localStorage.removeItem(this.REVIEWS_KEY);
  }

  // Initialize with default mock data if empty
  static initializeDefaultData(): void {
    const businesses = this.getStoredBusinesses();
    const posts = this.getStoredPosts();
    const reviews = this.getStoredReviews();

    if (businesses.length === 0) {
      this.saveBusinesses(this.getDefaultBusinesses());
    }

    if (posts.length === 0) {
      this.savePosts(this.getDefaultPosts());
    }

    if (reviews.length === 0) {
      this.saveReviews(this.getDefaultReviews());
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
        avatarUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=400&fit=crop&crop=center',
        coverUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=400&fit=crop&crop=center',
        verified: true,
        averageRating: 4.5,
        totalReviews: 42,
        phoneNumber: '+65 6XXX XXXX',
        email: 'hello@localcafe.sg',
        website: 'https://localcafe.sg',
        priceRange: '$$',
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
        name: 'McDonald\'s @ NTU',
        description: 'Best study place at North Spine',
        category: 'food',
        address: 'LocalBase Community',
        latitude: 1.2966,
        longitude: 103.7764,
        owner: '0x456...',
        isActive: true,
        totalTransactions: 0,
        reputationScore: 0,
        acceptsBasePay: true,
        avatarUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop&crop=center',
        coverUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop&crop=center',
        verified: false,
        averageRating: 0,
        totalReviews: 0,
        phoneNumber: '+65 6XXX YYYY',
        email: 'support@mcdonalds.sg',
        priceRange: '$',
        hours: {
          monday: { open: '06:00', close: '23:00' },
          tuesday: { open: '06:00', close: '23:00' },
          wednesday: { open: '06:00', close: '23:00' },
          thursday: { open: '06:00', close: '23:00' },
          friday: { open: '06:00', close: '23:00' },
          saturday: { open: '06:00', close: '23:00' },
          sunday: { open: '07:00', close: '22:00' },
        },
      },
      {
        id: '3',
        name: 'TechMart Base',
        description: 'Electronics and crypto hardware',
        category: 'shopping',
        address: '21 Heng Mui Keng Terrace, Singapore',
        latitude: 1.2966,
        longitude: 103.7764,
        owner: '0x789...',
        isActive: true,
        totalTransactions: 234,
        reputationScore: 96,
        acceptsBasePay: true,
        avatarUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center',
        coverUrl: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=400&fit=crop&crop=center',
        verified: true,
        averageRating: 5.0,
        totalReviews: 2,
        phoneNumber: '+65 6XXX YYYY',
        email: 'support@techmart.sg',
        priceRange: '$$$',
        socialLinks: {
          instagram: 'https://instagram.com/techmart_base',
          facebook: 'https://facebook.com/techmartbase'
        },
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
        id: '4',
        name: 'Wellness Spa Chain',
        description: 'Relaxation services with crypto payments',
        category: 'health',
        address: '1 Marina Bay Sands, Singapore',
        latitude: 1.2834,
        longitude: 103.8607,
        owner: '0xabc...',
        isActive: true,
        totalTransactions: 156,
        reputationScore: 94,
        acceptsBasePay: true,
        avatarUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400&fit=crop&crop=center',
        coverUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop&crop=center',
        verified: true,
        averageRating: 4.7,
        totalReviews: 65,
        phoneNumber: '+65 6XXX ZZZZ',
        email: 'book@wellness.sg',
        priceRange: '$$$$',
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
        id: '5',
        name: 'Marina Bay Event Space',
        description: 'Premium venue for meetups and crypto events',
        category: 'fun',
        address: '2 Marina Bay Dr, Singapore',
        latitude: 1.2838,
        longitude: 103.8612,
        owner: '0xdef...',
        isActive: true,
        totalTransactions: 67,
        reputationScore: 99,
        acceptsBasePay: true,
        avatarUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=400&fit=crop&crop=center',
        coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop&crop=center',
        verified: true,
        averageRating: 4.9,
        totalReviews: 12,
        phoneNumber: '+65 6XXX AAAA',
        email: 'events@marina.sg',
        priceRange: '$$$$',
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
      {
        id: '6',
        name: 'LocalBase',
        description: 'Decentralized Local Business Discovery & Payment Platform',
        category: 'services',
        address: '439A Sengkang West Ave',
        latitude: 1.3966,
        longitude: 103.9132,
        owner: '0x1a2b3c4d...',
        isActive: true,
        totalTransactions: 1,
        reputationScore: 100,
        acceptsBasePay: true,
        avatarUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop&crop=center',
        coverUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop&crop=center',
        verified: true,
        averageRating: 5.0,
        totalReviews: 1,
        phoneNumber: '+65 6XXX BBBB',
        email: 'hello@localbase.sg',
        website: 'https://localbase.vercel.app',
        priceRange: '$',
        socialLinks: {
          twitter: 'https://twitter.com/localbase',
          linkedin: 'https://linkedin.com/company/localbase',
          instagram: 'https://instagram.com/localbase'
        },
        hours: {
          monday: { open: '00:00', close: '23:59' },
          tuesday: { open: '00:00', close: '23:59' },
          wednesday: { open: '00:00', close: '23:59' },
          thursday: { open: '00:00', close: '23:59' },
          friday: { open: '00:00', close: '23:59' },
          saturday: { open: '00:00', close: '23:59' },
          sunday: { open: '00:00', close: '23:59' },
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
        timestamp: Date.now() - 1800000, // 30 mins ago
        likes: 12,
        comments: 3,
        tags: ['coffee', 'basepay', 'ntu'],
      },
      {
        id: '2',
        authorAddress: '0x456...',
        authorName: 'TechStudent',
        content: 'TechRepair Hub fixed my laptop screen in 2 hours and accepted USDC payment! 💻 No more cash or card hassles. Supporting local businesses with crypto feels great! 💪',
        businessId: '2',
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

  private static getDefaultReviews(): Review[] {
    return [
      {
        id: '1',
        businessId: '1',
        userId: '0xuser1',
        userAddress: '0xuser1',
        userName: 'CoffeeLover',
        rating: 5,
        comment: 'Amazing coffee and great atmosphere! The crypto payment was super smooth and fast. Definitely coming back!',
        timestamp: Date.now() - 86400000, // 1 day ago
        verified: true,
        helpful: 8,
        helpfulUsers: ['0xa1b2c3d4', '0xe5f6g7h8', '0xi9j0k1l2', '0xm3n4o5p6', '0xq7r8s9t0', '0xu1v2w3x4', '0xy5z6a7b8', '0xc9d0e1f2'],
        photos: []
      },
      {
        id: '2',
        businessId: '1',
        userId: '0xuser2',
        userAddress: '0xuser2',
        userName: 'StudyBuddy',
        rating: 4,
        comment: 'Perfect spot for studying. Good WiFi and the staff is friendly. Love that they accept crypto payments!',
        timestamp: Date.now() - 172800000, // 2 days ago
        verified: true,
        helpful: 5,
        helpfulUsers: ['0xa1b2c3d4', '0xe5f6g7h8', '0xi9j0k1l2', '0xm3n4o5p6', '0xq7r8s9t0'],
        photos: []
      },
      {
        id: '3',
        businessId: '3',
        userId: '0xuser3',
        userAddress: '0xuser3',
        userName: 'TechEnthusiast',
        rating: 5,
        comment: 'Amazing electronics selection! Got my crypto hardware here and the staff really knows their stuff.',
        timestamp: Date.now() - 259200000, // 3 days ago
        verified: true,
        helpful: 12,
        helpfulUsers: ['0xa1b2c3d4', '0xe5f6g7h8', '0xi9j0k1l2', '0xm3n4o5p6', '0xq7r8s9t0', '0xu1v2w3x4', '0xy5z6a7b8', '0xc9d0e1f2', '0xg3h4i5j6', '0xk7l8m9n0', '0xo1p2q3r4', '0xs5t6u7v8'],
        photos: []
      },
      {
        id: '4',
        businessId: '3', 
        userId: '0xuser4',
        userAddress: '0xuser4',
        userName: 'CryptoMiner',
        rating: 5,
        comment: 'Best place for crypto hardware in Singapore. Great prices and they accept Base payments!',
        timestamp: Date.now() - 345600000, // 4 days ago
        verified: true,
        helpful: 8,
        helpfulUsers: ['0xa1b2c3d4', '0xe5f6g7h8', '0xi9j0k1l2', '0xm3n4o5p6', '0xq7r8s9t0', '0xu1v2w3x4', '0xy5z6a7b8', '0xc9d0e1f2'],
        photos: []
      },
      {
        id: '5',
        businessId: '4',
        userId: '0xuser5',
        userAddress: '0xuser5',
        userName: 'WellnessSeeker',
        rating: 5,
        comment: 'The best spa experience I\'ve had! The massage was incredible and paying with crypto was so modern and easy.',
        timestamp: Date.now() - 345600000, // 4 days ago
        verified: true,
        helpful: 15,
        helpfulUsers: ['0xa1b2c3d4', '0xe5f6g7h8', '0xi9j0k1l2', '0xm3n4o5p6', '0xq7r8s9t0', '0xu1v2w3x4', '0xy5z6a7b8', '0xc9d0e1f2', '0xg3h4i5j6', '0xk7l8m9n0', '0xo1p2q3r4', '0xs5t6u7v8', '0xw9x0y1z2', '0xa3b4c5d6', '0xe7f8g9h0'],
        photos: []
      },
      {
        id: '5',
        businessId: '4',
        userId: '0xuser5',
        userAddress: '0xuser5',
        userName: 'WellnessSeeker',
        rating: 5,
        comment: 'The best spa experience I\'ve had! The massage was incredible and paying with crypto was so modern and easy.',
        timestamp: Date.now() - 345600000, // 4 days ago
        verified: true,
        helpful: 15,
        helpfulUsers: ['0xa1b2c3d4', '0xe5f6g7h8', '0xi9j0k1l2', '0xm3n4o5p6', '0xq7r8s9t0', '0xu1v2w3x4', '0xy5z6a7b8', '0xc9d0e1f2', '0xg3h4i5j6', '0xk7l8m9n0', '0xo1p2q3r4', '0xs5t6u7v8', '0xw9x0y1z2', '0xa3b4c5d6', '0xe7f8g9h0'],
        photos: []
      },
      {
        id: '6',
        businessId: '5',
        userId: '0xuser6',
        userAddress: '0xuser6',
        userName: 'EventPlanner',
        rating: 4,
        comment: 'Great venue for our crypto meetup! Professional setup and the team was very accommodating.',
        timestamp: Date.now() - 432000000, // 5 days ago
        verified: true,
        helpful: 7,
        helpfulUsers: ['0xa1b2c3d4', '0xe5f6g7h8', '0xi9j0k1l2', '0xm3n4o5p6', '0xq7r8s9t0', '0xu1v2w3x4', '0xy5z6a7b8'],
        photos: []
      },
      {
        id: '7',
        businessId: '6',
        userId: '0xa96D...c403',
        userAddress: '0xa96D...c403',
        userName: '0xa96D...c403',
        rating: 5,
        comment: 'excellent platform! give it a 5/5',
        timestamp: 1755486903000, // Aug 19, 2025
        verified: true,
        helpful: 3,
        helpfulUsers: ['0xa1b2c3d4', '0xe5f6g7h8', '0xi9j0k1l2'],
        photos: []
      }
    ];
  }
}

export default PersistentStorage;
