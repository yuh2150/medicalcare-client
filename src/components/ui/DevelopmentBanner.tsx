'use client';

import { AlertTriangle, Info } from 'lucide-react';

interface DevelopmentBannerProps {
  message?: string;
  type?: 'info' | 'warning';
}

export function DevelopmentBanner({ 
  message = 'Đang sử dụng dữ liệu mẫu để demo', 
  type = 'info' 
}: DevelopmentBannerProps) {
  // Only show in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const bgColor = type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200';
  const textColor = type === 'warning' ? 'text-yellow-800' : 'text-blue-800';
  const iconColor = type === 'warning' ? 'text-yellow-600' : 'text-blue-600';
  
  const Icon = type === 'warning' ? AlertTriangle : Info;

  return (
    <div className={`${bgColor} border rounded-lg p-3 mb-4`}>
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <span className={`text-sm font-medium ${textColor}`}>
          {message}
        </span>
      </div>
    </div>
  );
}
