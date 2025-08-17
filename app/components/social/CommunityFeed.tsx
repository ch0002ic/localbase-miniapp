'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useMiniKit, useComposeCast, useViewProfile } from '@coinbase/onchainkit/minikit';
import { MessageCircle, Heart, Share2, MapPin, Clock, Users, TrendingUp } from 'lucide-react';
import { CommunityPost } from '../../types/localbase';
import { LocalBaseAPI } from '../../services/api';

export function CommunityFeed() {
  const { address, isConnected } = useAccount();
  const { context } = useMiniKit();
  const { composeCast } = useComposeCast();
  const viewProfile = useViewProfile();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'feed' | 'trending' | 'local'>('feed');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  
  // Comments state
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [newComments, setNewComments] = useState<{[postId: string]: string}>({});
  const [postComments, setPostComments] = useState<{[postId: string]: Array<{
    id: string;
    author: string;
    content: string;
    timestamp: number;
  }>}>({});
  
  useEffect(() => {
    fetchPosts();
  }, [activeTab]); // Re-fetch when tab changes
  
  // Watch for wallet connection changes and update liked posts accordingly
  useEffect(() => {
    if (isConnected && address) {
      // User just connected wallet - load their previous likes
      console.log(`Wallet connected: ${address}, loading previous likes...`);
      const userLikesKey = `user_likes_${address}`;
      const userLikes = localStorage.getItem(userLikesKey);
      if (userLikes) {
        try {
          const likedPostIds = JSON.parse(userLikes);
          setLikedPosts(new Set(likedPostIds));
          console.log(`✅ Loaded ${likedPostIds.length} previous likes for user ${address}`);
          
          // Show a subtle notification that likes were restored
          if (likedPostIds.length > 0) {
            console.log(`🔄 Restored your ${likedPostIds.length} previous likes`);
          }
        } catch (error) {
          console.error('Error loading user likes:', error);
          setLikedPosts(new Set());
        }
      } else {
        // No previous likes found
        setLikedPosts(new Set());
        console.log(`✨ Welcome! No previous likes found for user ${address}`);
      }
    } else {
      // User disconnected wallet - clear liked posts state
      console.log('🔌 Wallet disconnected, clearing liked posts state');
      setLikedPosts(new Set());
    }
  }, [isConnected, address]);
  
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const apiPosts = await LocalBaseAPI.getCommunityPosts();
      
      // Update posts with current comment counts and likes from localStorage
      let postsWithCommentCounts = apiPosts.map(post => {
        const commentsKey = `comments_${post.id}`;
        const storedComments = localStorage.getItem(commentsKey);
        const commentCount = storedComments ? JSON.parse(storedComments).length : 0;
        
        // Load likes count from localStorage
        const likesKey = `likes_${post.id}`;
        const storedLikes = localStorage.getItem(likesKey);
        let likesCount = 0;
        
        if (storedLikes) {
          try {
            const likeData = JSON.parse(storedLikes);
            likesCount = likeData.count || likeData || 0; // Handle both old and new format
          } catch (error) {
            console.error(`Error parsing likes for post ${post.id}:`, error);
            likesCount = 0;
          }
        }
        
        return { ...post, comments: commentCount, likes: likesCount };
      });
      
      // Filter posts based on active tab
      if (activeTab === 'trending') {
        // Sort by likes + comments (engagement) for trending
        postsWithCommentCounts = postsWithCommentCounts
          .filter(post => (post.likes || 0) + (post.comments || 0) > 0) // Must have some engagement
          .sort((a, b) => {
            const aEngagement = (a.likes || 0) + (a.comments || 0);
            const bEngagement = (b.likes || 0) + (b.comments || 0);
            return bEngagement - aEngagement; // Highest engagement first
          });
      } else if (activeTab === 'local') {
        // Filter posts that mention businesses or have location tags
        postsWithCommentCounts = postsWithCommentCounts.filter(post => 
          post.businessId || // Posts tagged to businesses
          post.tags?.some(tag => tag.includes('local') || tag.includes('event') || tag.includes('meetup')) ||
          post.content.toLowerCase().includes('@') || // Posts mentioning businesses
          post.content.toLowerCase().includes('event') ||
          post.content.toLowerCase().includes('meetup') ||
          post.content.toLowerCase().includes('local')
        ).sort((a, b) => b.timestamp - a.timestamp); // Recent first
      }
      // For 'feed' tab, keep all posts sorted by timestamp (newest first)
      else {
        postsWithCommentCounts = postsWithCommentCounts.sort((a, b) => b.timestamp - a.timestamp);
      }
      
      setPosts(postsWithCommentCounts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLike = (postId: string) => {
    if (!isConnected || !address) {
      alert('Please connect your wallet to like posts');
      return;
    }
    
    const isLiked = likedPosts.has(postId);
    console.log(`User ${address} ${isLiked ? 'unliking' : 'liking'} post ${postId}`);
    
    // Update liked posts state
    const newLikedPosts = new Set(likedPosts);
    if (isLiked) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);

    // Save user's liked posts to localStorage
    const userLikesKey = `user_likes_${address}`;
    localStorage.setItem(userLikesKey, JSON.stringify(Array.from(newLikedPosts)));
    
    console.log(`User ${address} has now liked ${newLikedPosts.size} posts total`);

    // Update posts with new like count
    const updatedPosts = posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: isLiked ? post.likes - 1 : post.likes + 1 
          }
        : post
    );
    setPosts(updatedPosts);

    // Save updated likes count and user list to localStorage
    const updatedPost = updatedPosts.find(p => p.id === postId);
    if (updatedPost) {
      const likesKey = `likes_${postId}`;
      
      // Get existing like data
      const existingLikesData = localStorage.getItem(likesKey);
      let existingUsers: string[] = [];
      
      if (existingLikesData) {
        try {
          const data = JSON.parse(existingLikesData);
          existingUsers = data.users || [];
        } catch (error) {
          console.error('Error parsing existing like data:', error);
        }
      }
      
      // Update user list
      const updatedUsers = [...existingUsers];
      if (isLiked) {
        // Remove user from likes
        const userIndex = updatedUsers.indexOf(address);
        if (userIndex > -1) {
          updatedUsers.splice(userIndex, 1);
        }
      } else {
        // Add user to likes (prevent duplicates)
        if (!updatedUsers.includes(address)) {
          updatedUsers.push(address);
        }
      }
      
      const likeData = {
        count: updatedPost.likes,
        users: updatedUsers,
        lastUpdated: Date.now()
      };
      localStorage.setItem(likesKey, JSON.stringify(likeData));
      console.log(`Post ${postId} now has ${updatedPost.likes} likes from users:`, updatedUsers);
    }
  };
  
  const addQuickTag = (tag: string) => {
    const tagText = `#${tag} `;
    setNewPost(prev => prev + tagText);
  };

  const handleSubmitPost = async () => {
    if (!newPost.trim() || !isConnected) return;
    
    try {
      const postId = await LocalBaseAPI.generatePostId();
      
      // Auto-generate tags based on content and active tab
      const autoTags: string[] = [];
      const content = newPost.toLowerCase();
      
      // Add tab-specific tags
      if (activeTab === 'local') {
        if (!content.includes('#local')) autoTags.push('local');
        if (content.includes('event') && !content.includes('#event')) autoTags.push('event');
        if (content.includes('meetup') && !content.includes('#meetup')) autoTags.push('meetup');
      }
      
      // Extract hashtags from content
      const hashtagMatches = newPost.match(/#[\w]+/g);
      const contentTags = hashtagMatches ? hashtagMatches.map(tag => tag.slice(1)) : [];
      
      // Extract business mentions
      const businessMatches = newPost.match(/@[\w]+/g);
      const businessId = businessMatches ? businessMatches[0].slice(1) : undefined;
      
      const newCommunityPost: CommunityPost = {
        id: postId,
        authorAddress: address || '',
        authorName: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Anonymous',
        content: newPost,
        timestamp: Date.now(),
        likes: 0,
        comments: 0,
        tags: [...new Set([...autoTags, ...contentTags])], // Remove duplicates
        businessId
      };
      
      await LocalBaseAPI.addCommunityPost(newCommunityPost);
      setNewPost('');
      fetchPosts(); // Refresh the list
      
      console.log(`✅ Posted with tags: ${newCommunityPost.tags?.join(', ')}`);
    } catch (error) {
      console.error('Error posting:', error);
    }
  };
  
  const formatTimeAgo = (timestamp: number) => {
    if (!timestamp || isNaN(timestamp)) {
      return 'now';
    }
    
    const diff = Date.now() - timestamp;
    if (diff < 0) return 'now'; // Handle future timestamps
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'now';
  };

  // Comments functions
  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
      // Load comments for this post if not already loaded
      if (!postComments[postId]) {
        loadCommentsForPost(postId);
      }
    }
    setExpandedComments(newExpanded);
  };

  const loadCommentsForPost = (postId: string) => {
    // In a real app, this would fetch from API
    // For now, load from localStorage
    const commentsKey = `comments_${postId}`;
    const storedComments = localStorage.getItem(commentsKey);
    if (storedComments) {
      const comments = JSON.parse(storedComments);
      setPostComments(prev => ({ ...prev, [postId]: comments }));
    }
  };

  const addComment = async (postId: string) => {
    const commentText = newComments[postId]?.trim();
    if (!commentText || !isConnected || !address) return;

    const comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      author: `${address.slice(0, 6)}...${address.slice(-4)}`,
      content: commentText,
      timestamp: Date.now()
    };

    // Add to local state
    const currentComments = postComments[postId] || [];
    const updatedComments = [comment, ...currentComments];
    setPostComments(prev => ({ ...prev, [postId]: updatedComments }));

    // Save to localStorage
    const commentsKey = `comments_${postId}`;
    localStorage.setItem(commentsKey, JSON.stringify(updatedComments));

    // Update post comments count
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments: updatedComments.length }
        : post
    ));

    // Clear the input
    setNewComments(prev => ({ ...prev, [postId]: '' }));
  };

  // Enhanced share function with MiniKit
  const handleShare = async (post: CommunityPost) => {
    const shareData = {
      title: `LocalBase Community Post by ${post.authorName}`,
      text: post.content,
      url: window.location.href
    };

    try {
      // If in MiniKit context, offer Farcaster sharing first
      if (context && composeCast) {
        const shouldShareOnFarcaster = confirm(
          'Share this post on Farcaster?\n\nClick OK for Farcaster or Cancel for other sharing options.'
        );
        
        if (shouldShareOnFarcaster) {
          composeCast({
            text: `Check out this local community post!\n\n"${post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content}"\n\n- ${post.authorName} on LocalBase 🏪`,
            embeds: [window.location.href]
          });
          return;
        }
      }
      
      // Try to use native Web Share API (mobile/modern browsers)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        const shareText = `Check out this post on LocalBase:\n\n"${post.content}"\n\n- ${post.authorName}\n\n${window.location.href}`;
        await navigator.clipboard.writeText(shareText);
        
        // Show success message
        alert('Post link copied to clipboard!');
      }
    } catch (error) {
      // If all else fails, show share options
      const shareText = `Check out this post on LocalBase:\n\n"${post.content}"\n\n- ${post.authorName}\n\n${window.location.href}`;
      
      // Create a temporary text area to copy text
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      alert('Post details copied to clipboard!');
    }
  };
  
  const tabs = [
    { id: 'feed' as const, label: 'Community Feed', icon: Users },
    { id: 'trending' as const, label: 'Trending', icon: TrendingUp },
    { id: 'local' as const, label: 'Local Events', icon: MapPin },
  ];
  
  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          <Users className="inline-block w-6 h-6 mr-2 text-blue-600" />
          Community
        </h1>
        <p className="text-gray-600">Connect with fellow crypto-friendly locals</p>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Create Post */}
      {isConnected && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder={
              activeTab === 'local' 
                ? "Share a local event or meetup..." 
                : activeTab === 'trending'
                ? "What's trending in your community?"
                : "Share your LocalBase experience..."
            }
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-2 flex-wrap">
              {activeTab === 'local' ? (
                <div className="flex gap-1 flex-wrap">
                  <span className="text-xs text-gray-500">💡 Quick tags:</span>
                  <button 
                    onClick={() => addQuickTag('local')}
                    className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    #local
                  </button>
                  <button 
                    onClick={() => addQuickTag('event')}
                    className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full hover:bg-green-200 transition-colors"
                  >
                    #event
                  </button>
                  <button 
                    onClick={() => addQuickTag('meetup')}
                    className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full hover:bg-purple-200 transition-colors"
                  >
                    #meetup
                  </button>
                </div>
              ) : (
                <span className="text-xs text-gray-500">💡 Tip: Tag businesses with @businessname</span>
              )}
            </div>
            <button
              onClick={handleSubmitPost}
              disabled={!newPost.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Post
            </button>
          </div>
        </div>
      )}
      
      {/* Posts Feed */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          {activeTab === 'feed' && (
            <>
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-4">Be the first to share your LocalBase experience!</p>
              {!isConnected && (
                <p className="text-sm text-orange-600">Connect your wallet to start posting</p>
              )}
            </>
          )}
          {activeTab === 'trending' && (
            <>
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No trending posts</h3>
              <p className="text-gray-600">Posts with more likes and comments will appear here</p>
            </>
          )}
          {activeTab === 'local' && (
            <>
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No local events</h3>
              <p className="text-gray-600">Posts about local businesses and events will appear here</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
              {/* Post Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {(post.authorName || 'Anonymous').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{post.authorName || 'Anonymous'}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(post.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Post Content */}
              <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Post Actions */}
              <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleLike(post.id)}
                  disabled={!isConnected}
                  className={`flex items-center gap-2 transition-colors ${
                    !isConnected 
                      ? 'text-gray-300 cursor-not-allowed'
                      : likedPosts.has(post.id) 
                        ? 'text-red-500' 
                        : 'text-gray-500 hover:text-red-500'
                  }`}
                  title={!isConnected ? 'Connect wallet to like posts' : ''}
                >
                  <Heart className={`w-4 h-4 ${likedPosts.has(post.id) && isConnected ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{post.likes || 0}</span>
                </button>
                
                <button 
                  onClick={() => toggleComments(post.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    expandedComments.has(post.id) ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{post.comments || 0}</span>
                </button>
                
                <button 
                  onClick={() => handleShare(post)}
                  className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>

              {/* Comments Section */}
              {expandedComments.has(post.id) && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {/* Add Comment Input */}
                  {isConnected && (
                    <div className="mb-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newComments[post.id] || ''}
                          onChange={(e) => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addComment(post.id);
                            }
                          }}
                          placeholder="Add a comment..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => addComment(post.id)}
                          disabled={!newComments[post.id]?.trim()}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Comments List */}
                  <div className="space-y-3">
                    {postComments[post.id]?.length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-4">No comments yet. Be the first to comment!</p>
                    )}
                    {postComments[post.id]?.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {comment.author.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg px-3 py-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm text-gray-900">{comment.author}</span>
                              <span className="text-xs text-gray-500">{formatTimeAgo(comment.timestamp)}</span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Connect Wallet CTA */}
      {!isConnected && (
        <div className="text-center py-8 bg-blue-50 rounded-xl border border-blue-200">
          <Users className="w-12 h-12 text-blue-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Join the Community</h3>
          <p className="text-gray-600 mb-4">Connect your wallet to share experiences and engage with other local crypto users.</p>
        </div>
      )}
    </div>
  );
}
