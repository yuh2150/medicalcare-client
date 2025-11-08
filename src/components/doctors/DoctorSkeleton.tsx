'use client';

interface DoctorSkeletonProps {
  viewMode?: 'grid' | 'list';
  count?: number;
}

export function DoctorSkeleton({ viewMode = 'grid', count = 6 }: DoctorSkeletonProps) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 animate-pulse">
            <div className="flex items-center gap-6">
              {/* Avatar skeleton */}
              <div className="w-20 h-20 bg-gray-200 rounded-full shrink-0"></div>
              
              {/* Content skeleton */}
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded-lg w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
                  ))}
                  <div className="h-4 bg-gray-200 rounded w-16 ml-2"></div>
                </div>
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              
              {/* Button skeleton */}
              <div className="shrink-0">
                <div className="w-24 h-12 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 text-center animate-pulse">
          {/* Avatar skeleton */}
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6"></div>
          
          {/* Content skeleton */}
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded-lg w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            
            {/* Rating skeleton */}
            <div className="flex items-center justify-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-4 bg-gray-200 rounded w-8"></div>
            </div>
            
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>

          {/* Button skeleton */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="h-12 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
