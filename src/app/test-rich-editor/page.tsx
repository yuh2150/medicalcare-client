'use client';

import { useState } from 'react';
import { RichTextEditor } from '@/components/ui/RichTextEditor';

export default function TestRichEditorPage() {
  const [content, setContent] = useState('<p>Chào mừng bạn đến với CKEditor 5!</p><h2>Tiêu đề mẫu</h2><p>Đây là một đoạn văn bản <strong>in đậm</strong> và <em>in nghiêng</em>.</p>');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Test CKEditor 5</h1>
          
          <div className="space-y-8">
            {/* Rich Text Editor */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Rich Text Editor</h2>
              <RichTextEditor
                label="Nội dung"
                value={content}
                onChange={setContent}
                placeholder="Nhập nội dung của bạn..."
                helperText="Sử dụng CKEditor 5 để tạo nội dung rich text"
              />
            </div>

            {/* Preview */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Preview HTML</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                  {content}
                </pre>
              </div>
            </div>

            {/* Rendered Output */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Rendered Output</h2>
              <div 
                className="prose max-w-none border border-gray-200 rounded-lg p-4"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
