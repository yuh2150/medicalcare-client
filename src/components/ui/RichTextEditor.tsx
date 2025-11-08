'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for CKEditor wrapper to avoid SSR issues
const CKEditorWrapper = dynamic(
  () => import('./CKEditorWrapper').then(mod => ({ default: mod.CKEditorWrapper })),
  {
    ssr: false,
    loading: () => (
      <div className="h-40 bg-gray-100 animate-pulse rounded-lg flex flex-col items-center justify-center space-y-3">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <span className="text-gray-500 text-sm font-medium">Đang tải CKEditor 5...</span>
      </div>
    )
  }
);

interface RichTextEditorProps {
  value?: string;
  onChange?: (data: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
  helperText?: string;
}

export function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Nhập nội dung...',
  disabled = false,
  className = '',
  label,
  error,
  helperText
}: RichTextEditorProps) {
  const [editorError, setEditorError] = useState<string | null>(null);

  const handleEditorReady = (editor: any) => {
    console.log('CKEditor is ready!', editor);
  };

  const handleEditorError = (error: any) => {
    console.error('CKEditor error:', error);
    setEditorError('Có lỗi xảy ra với CKEditor');
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className={`rounded-lg overflow-hidden shadow-sm ${error ? 'ring-2 ring-red-300' : 'ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-blue-500'} transition-all duration-200`}>
        <CKEditorWrapper
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onReady={handleEditorReady}
          onError={handleEditorError}
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
