'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Bot, Paperclip, Send, Trash2, X } from 'lucide-react';
import { HTMLContent } from '@/components/ui/HTMLContent';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  imageUrl?: string;
}

interface AssistantResponse {
  response: string;
  agent?: string;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'system-welcome',
  role: 'system',
  content: 'Xin chào! Tôi là trợ lý AI. Hãy nhập câu hỏi để bắt đầu.'
};

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatToHtml(text: string) {
  if (!text) return '';
  return escapeHtml(text).replace(/\n/g, '<br />');
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!previewUrl) return;
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!chatBodyRef.current) return;
    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [messages, isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const clearImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setPreviewUrl(null);
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    clearImage();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    const hasImage = Boolean(fileInputRef.current?.files?.length);
    if ((!trimmed && !hasImage) || isSending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      imageUrl: previewUrl || undefined
    };

    const thinkingMessage: ChatMessage = {
      id: `thinking-${Date.now()}`,
      role: 'assistant',
      content: 'Đang xử lý...'
    };

    setMessages((prev) => [...prev, userMessage, thinkingMessage]);
    setInput('');
    setIsSending(true);

    const file = fileInputRef.current?.files?.[0] || null;

    try {
      const response = file
        ? await fetch('/upload', {
            method: 'POST',
            body: (() => {
              const formData = new FormData();
              formData.append('image', file);
              formData.append('text', trimmed);
              return formData;
            })(),
            credentials: 'include'
          })
        : await fetch('/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: trimmed, conversation_history: [] }),
            credentials: 'include'
          });

      const data = (await response.json()) as AssistantResponse;

      setMessages((prev) => {
        const cleaned = prev.filter((item) => item.id !== thinkingMessage.id);
        return [
          ...cleaned,
          {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: data.response || 'Hiện chưa có phản hồi từ hệ thống.'
          }
        ];
      });
    } catch (error) {
      setMessages((prev) => prev.filter((item) => item.id !== thinkingMessage.id));
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.'
        }
      ]);
    } finally {
      setIsSending(false);
      clearImage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="w-[320px] sm:w-[360px] h-[520px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-4">
          <div className="flex items-center justify-between px-5 py-4 bg-linear-to-r from-blue-600 to-sky-500 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Trợ Lý AI</p>
                <p className="text-xs text-white/80">Hỗ trợ nhanh</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearChat}
                className="p-2 rounded-full hover:bg-white/20"
                aria-label="Xóa đoạn chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleToggle}
                className="p-2 rounded-full hover:bg-white/20"
                aria-label="Đóng chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div ref={chatBodyRef} className="h-[360px] overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-white via-white to-blue-50">
            {messages.map((message) => {
              const isUser = message.role === 'user';
              const isSystem = message.role === 'system';

              return (
                <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm border ${
                      isUser
                        ? 'bg-blue-600 text-white border-blue-600 rounded-br-sm'
                        : isSystem
                          ? 'bg-gray-100 text-gray-700 border-gray-200'
                          : 'bg-white text-gray-800 border-gray-200 rounded-bl-sm'
                    }`}
                  >
                    <HTMLContent content={formatToHtml(message.content)} className="prose prose-sm max-w-none" />
                    {message.imageUrl && (
                      <img
                        src={message.imageUrl}
                        alt="Ảnh tải lên"
                        className="mt-2 max-h-40 rounded-xl border border-white/40 object-contain"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-gray-100 px-4 py-4 bg-white">
            {previewUrl && (
              <div className="mb-3 flex items-center gap-3">
                <img
                  src={previewUrl}
                  alt="Xem trước"
                  className="h-16 w-16 rounded-xl border border-gray-200 object-cover"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="text-xs text-gray-500 hover:text-red-500"
                >
                  Xóa ảnh
                </button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <button
                type="button"
                onClick={handlePickImage}
                className="w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 flex items-center justify-center"
                aria-label="Thêm ảnh"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Nhập câu hỏi..."
                className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <button
                type="submit"
                disabled={isSending}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-60"
                aria-label="Gửi"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
              <span>Tư vấn nhanh, không thay thế bác sĩ.</span>
              <Link href="/ai-assistant" className="text-blue-600 hover:text-blue-700 font-medium">
                Mở đầy đủ
              </Link>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={handleToggle}
        className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl hover:bg-blue-700 transition"
        aria-label="Mở chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>
    </div>
  );
}
