'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave';
}

export function Skeleton({ 
  className = '', 
  variant = 'text', 
  width, 
  height, 
  animation = 'pulse' 
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 animate-pulse';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]'
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
}

// Business Card Skeleton
export function BusinessCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header with avatar and rating */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Skeleton variant="circular" className="w-12 h-12" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Skeleton variant="circular" className="w-4 h-4" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Location */}
      <div className="flex items-center space-x-2 mb-4">
        <Skeleton variant="circular" className="w-4 h-4" />
        <Skeleton className="h-4 w-40" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center">
            <Skeleton className="h-5 w-8 mx-auto mb-1" />
            <Skeleton className="h-3 w-12 mx-auto" />
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex space-x-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
}

// Community Post Skeleton
export function CommunityPostSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <Skeleton variant="circular" className="w-10 h-10" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Tags */}
      <div className="flex space-x-2 mb-4">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-8 w-12" />
      </div>
    </div>
  );
}

// Review Skeleton
export function ReviewSkeleton() {
  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Skeleton variant="circular" className="w-8 h-8" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} variant="circular" className="w-3 h-3" />
              ))}
            </div>
          </div>
        </div>
        <Skeleton className="h-3 w-16" />
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}

// Analytics Card Skeleton
export function AnalyticsCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <Skeleton variant="circular" className="w-10 h-10" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-3 w-20 mb-1" />
      <Skeleton className="h-6 w-16 mb-1" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

// Search Suggestions Skeleton
export function SearchSuggestionsSkeleton() {
  return (
    <div className="py-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="px-4 py-3 flex items-center space-x-3">
          <Skeleton className="w-6 h-6" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Payment Modal Skeleton
export function PaymentModalSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Skeleton className="h-6 w-32 mx-auto" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>

      {/* Amount input */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-3 w-24" />
      </div>

      {/* Message input */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-20 w-full" />
      </div>

      {/* Payment button */}
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

// Generic Loading Grid
export function LoadingGrid({ 
  count = 6, 
  columns = 3,
  SkeletonComponent = BusinessCardSkeleton 
}: { 
  count?: number;
  columns?: number;
  SkeletonComponent?: React.ComponentType;
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
}
