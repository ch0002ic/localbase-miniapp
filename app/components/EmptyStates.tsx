'use client';

import { Search, Store, MessageCircle, Star, Users, MapPin } from 'lucide-react';

interface EmptyStateProps {
  type: 'businesses' | 'reviews' | 'posts' | 'search' | 'rewards' | 'analytics';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  type, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  const getContent = () => {
    switch (type) {
      case 'businesses':
        return {
          icon: <Store className="w-16 h-16 text-gray-400" />,
          defaultTitle: 'No businesses found',
          defaultDescription: 'Be the first to register your business in this area!',
          defaultAction: 'Register Business'
        };
      case 'reviews':
        return {
          icon: <Star className="w-16 h-16 text-gray-400" />,
          defaultTitle: 'No reviews yet',
          defaultDescription: 'Share your experience and be the first to review this business.',
          defaultAction: 'Write Review'
        };
      case 'posts':
        return {
          icon: <MessageCircle className="w-16 h-16 text-gray-400" />,
          defaultTitle: 'No posts yet',
          defaultDescription: 'Start the conversation by sharing something with the community.',
          defaultAction: 'Create Post'
        };
      case 'search':
        return {
          icon: <Search className="w-16 h-16 text-gray-400" />,
          defaultTitle: 'No results found',
          defaultDescription: 'Try adjusting your search terms or browse all businesses.',
          defaultAction: 'Clear Search'
        };
      case 'rewards':
        return {
          icon: <Star className="w-16 h-16 text-gray-400" />,
          defaultTitle: 'No rewards available',
          defaultDescription: 'Make purchases at local businesses to earn loyalty rewards.',
          defaultAction: 'Discover Businesses'
        };
      case 'analytics':
        return {
          icon: <Users className="w-16 h-16 text-gray-400" />,
          defaultTitle: 'No analytics data',
          defaultDescription: 'Analytics will appear once customers start interacting with your business.',
          defaultAction: 'Share Business'
        };
      default:
        return {
          icon: <MapPin className="w-16 h-16 text-gray-400" />,
          defaultTitle: 'Nothing here yet',
          defaultDescription: 'Check back later for updates.',
          defaultAction: 'Refresh'
        };
    }
  };

  const content = getContent();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4">
        {content.icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title || content.defaultTitle}
      </h3>
      <p className="text-gray-600 mb-6 max-w-sm">
        {description || content.defaultDescription}
      </p>
      {(actionLabel || content.defaultAction) && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          {actionLabel || content.defaultAction}
        </button>
      )}
    </div>
  );
}

export function ErrorState({ 
  title = 'Something went wrong',
  description = 'We encountered an error while loading this content.',
  actionLabel = 'Try Again',
  onRetry
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <span className="text-2xl">⚠️</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
