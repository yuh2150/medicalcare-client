'use client';

import { SkeletonCard } from '../ui';

interface SpecialistSkeletonProps {
  viewMode?: 'grid' | 'list';
  count?: number;
}

export function SpecialistSkeleton({ viewMode = 'grid', count = 6 }: SpecialistSkeletonProps) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 animate-pulse">
            <div className="flex items-center gap-6">
              {/* Icon skeleton */}
              <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
              
              {/* Content skeleton */}
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded-lg w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-full max-w-md"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              
              {/* Arrow skeleton */}
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden animate-pulse">
          {/* Image skeleton */}
          <div className="h-48 bg-gray-200"></div>
          
          {/* Content skeleton */}
          <div className="p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
