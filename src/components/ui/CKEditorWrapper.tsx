'use client';

import { useEffect, useRef, useState } from 'react';

interface CKEditorWrapperProps {
  value?: string;
  onChange?: (data: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onReady?: (editor: any) => void;
  onError?: (error: any) => void;
}

export function CKEditorWrapper({
  value = '',
  onChange,
  placeholder = 'Nhập nội dung...',
  disabled = false,
  onReady,
  onError
}: CKEditorWrapperProps) {
  const editorRef = useRef<any>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    let editorInstance: any = null;

    const initializeEditor = async () => {
      try {
        // Ensure the element is ready
        if (!editorRef.current) {
          console.log('Editor element not ready');
          return;
        }

        // Clear any existing content
        editorRef.current.innerHTML = '';
        
        // Import CKEditor modules dynamically
        const { default: ClassicEditor } = await import('@ckeditor/ckeditor5-build-classic');

        if (!mountedRef.current || !editorRef.current) return;

        // Initialize editor
        editorInstance = await ClassicEditor.create(editorRef.current, {
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            'link',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'blockQuote',
            'insertTable',
            '|',
            'undo',
            'redo'
          ],
          placeholder
        });

        // Store reference for cleanup
        editorRef.current.__editorInstance = editorInstance;

        if (!mountedRef.current) {
          await editorInstance.destroy();
          return;
        }

        // Set initial data
        if (value) {
          editorInstance.setData(value);
        }

        // Listen for changes
        editorInstance.model.document.on('change:data', () => {
          if (mountedRef.current && onChange) {
            const data = editorInstance.getData();
            onChange(data);
          }
        });

        // Handle disabled state
        if (disabled) {
          editorInstance.enableReadOnlyMode('disabled');
        }

        setIsEditorReady(true);
        setEditorError(null);

        if (onReady) {
          onReady(editorInstance);
        }

      } catch (error) {
        console.error('Failed to initialize CKEditor:', error);
        setEditorError('Không thể khởi tạo CKEditor');
        if (onError) {
          onError(error);
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(initializeEditor, 100);

    return () => {
      clearTimeout(timeoutId);
      mountedRef.current = false;
      
      // Cleanup editor instance
      if (editorRef.current?.__editorInstance) {
        editorRef.current.__editorInstance.destroy().catch((error: any) => {
          console.error('Error destroying editor:', error);
        });
        editorRef.current.__editorInstance = null;
      }
      
      if (editorInstance) {
        editorInstance.destroy().catch((error: any) => {
          console.error('Error destroying editor:', error);
        });
      }
    };
  }, []); // Remove dependencies to prevent re-initialization

  // Update editor data when value prop changes
  useEffect(() => {
    if (isEditorReady && editorRef.current?.__editorInstance && value !== undefined) {
      const editorInstance = editorRef.current.__editorInstance;
      try {
        // Only update if the current content is different from the new value
        const currentData = editorInstance.getData() || '';
        if (currentData !== value) {
          editorInstance.setData(value);
        }
      } catch (error) {
        console.error('Error updating editor data:', error);
      }
    }
  }, [value, isEditorReady]);

  // Update disabled state
  useEffect(() => {
    if (isEditorReady && editorRef.current?.__editorInstance) {
      const editorInstance = editorRef.current.__editorInstance;
      try {
        if (disabled) {
          editorInstance.enableReadOnlyMode('disabled');
        } else {
          editorInstance.disableReadOnlyMode('disabled');
        }
      } catch (error) {
        console.error('Error updating editor disabled state:', error);
      }
    }
  }, [disabled, isEditorReady]);

  if (editorError) {
    return (
      <div className="w-full">
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-2 text-sm text-yellow-600">
          {editorError}. Đang sử dụng chế độ văn bản đơn giản.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={editorRef} className="min-h-[200px]" />
      {!isEditorReady && (
        <div className="h-40 bg-gray-100 animate-pulse rounded-lg flex flex-col items-center justify-center space-y-3">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-gray-500 text-sm font-medium">Đang khởi tạo CKEditor 5...</span>
        </div>
      )}
    </div>
  );
}
