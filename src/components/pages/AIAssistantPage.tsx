'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Mic, MicOff, Paperclip, Send, Trash2 } from 'lucide-react';
import { Section, Container, Breadcrumb } from '@/components/ui/Layout';
import { HTMLContent } from '@/components/ui/HTMLContent';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  agent?: string;
  imageUrl?: string;
  resultImageUrl?: string;
  requiresValidation?: boolean;
}

interface AssistantResponse {
  response: string;
  agent: string;
  result_image?: string;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'system-welcome',
  role: 'system',
  content: 'Xin chào! Tôi là trợ lý AI y tế. Bạn có thể hỏi về sức khỏe hoặc gửi hình ảnh y khoa để được phân tích.'
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

export function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationNotes, setValidationNotes] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const breadcrumbItems = useMemo(() => (
    [
      { label: 'Trang Chu', href: '/' },
      { label: 'Trợ Lý AI', href: '#' }
    ]
  ), []);

  useEffect(() => {
    if (!chatBodyRef.current) return;
    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!previewUrl) return;
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmed = input.trim();
    const hasImage = Boolean(fileInputRef.current?.files?.length);

    if (!trimmed && !hasImage) return;

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

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

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
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.response || 'Không có phản hồi từ hệ thống.',
          agent: data.agent,
          resultImageUrl: data.result_image,
          requiresValidation: data.agent?.includes('HUMAN_VALIDATION')
        };
        return [...cleaned, assistantMessage];
      });
    } catch (error) {
      setMessages((prev) => prev.filter((item) => item.id !== thinkingMessage.id));
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Xin lỗi, hệ thống đang gặp lỗi. Vui lòng thử lại sau.'
        }
      ]);
    } finally {
      setIsSending(false);
      clearImage();
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];

      recorder.addEventListener('dataavailable', (event) => {
        audioChunksRef.current.push(event.data);
      });

      recorder.addEventListener('stop', () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
        transcribeSpeech(audioBlob);
      });

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error('Không thể truy cập micro:', error);
    }
  };

  const transcribeSpeech = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    try {
      const response = await fetch('/transcribe', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.transcript) {
        setInput(data.transcript);
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }
    } catch (error) {
      console.error('Lỗi chuyển giọng nói:', error);
    } finally {
      setIsRecording(false);
    }
  };

  const generateSpeech = async (text: string) => {
    const response = await fetch('/generate-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        voice_id: '21m00Tcm4TlvDq8ikWAM'
      })
    });

    if (!response.ok) {
      throw new Error('Không thể tạo giọng nói.');
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  };

  const handlePlaySpeech = async (message: ChatMessage) => {
    const text = message.content?.slice(0, 1000) || '';
    if (!text) return;

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }

    try {
      const audioUrl = await generateSpeech(text);
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
      };

      await audio.play();
    } catch (error) {
      console.error('Lỗi phát giọng nói:', error);
    }
  };

  const handleValidationSubmit = async (messageId: string, validation: 'yes' | 'no') => {
    const comments = validationNotes[messageId] || '';
    const formData = new FormData();
    formData.append('validation_result', validation);
    formData.append('comments', comments);

    try {
      const response = await fetch('/validate', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `validated-${Date.now()}`,
          role: 'assistant',
          content: `${data.message || ''}\n${data.response || ''}`.trim() || 'Đã gửi phản hồi.'
        }
      ]);
    } catch (error) {
      console.error('Gửi validation thất bại:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Section background="white" padding="lg">
        <Container>
          <Breadcrumb items={breadcrumbItems} className="mb-6" />
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Trợ Lý AI Y Tế</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trao đổi nhanh chóng với trợ lý AI để nhận tư vấn y tế, giải thích triệu chứng và hướng dẫn chăm sóc.
            </p>
          </div>
        </Container>
      </Section>

      <Section padding="xl">
        <Container>
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-linear-to-r from-blue-600 via-blue-500 to-sky-500 text-white">
                <div>
                  <h2 className="text-lg font-semibold">Phòng Trò Chuyện</h2>
                  <p className="text-sm text-white/80">Kết nối trực tiếp với trợ lý AI</p>
                </div>
                <button
                  onClick={handleClearChat}
                  className="inline-flex items-center gap-2 text-sm font-medium bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa chat
                </button>
              </div>

              <div
                ref={chatBodyRef}
                className="h-[480px] overflow-y-auto px-6 py-5 space-y-6 bg-gradient-to-b from-white via-white to-blue-50"
              >
                {messages.map((message) => {
                  const isUser = message.role === 'user';
                  const isSystem = message.role === 'system';

                  return (
                    <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm border ${
                          isUser
                            ? 'bg-blue-600 text-white border-blue-600 rounded-br-sm'
                            : isSystem
                              ? 'bg-gray-100 text-gray-700 border-gray-200'
                              : 'bg-white text-gray-800 border-gray-200 rounded-bl-sm'
                        }`}
                      >
                        {!isUser && message.agent && (
                          <div className="text-xs font-semibold text-blue-600 mb-2">{message.agent}</div>
                        )}
                        <HTMLContent
                          content={formatToHtml(message.content)}
                          className="prose prose-sm max-w-none"
                          safe={false}
                        />
                        {message.imageUrl && (
                          <div className="mt-3">
                            <img
                              src={message.imageUrl}
                              alt="Ảnh tải lên"
                              className="rounded-xl border border-white/30 max-h-48 object-contain"
                            />
                          </div>
                        )}
                        {message.resultImageUrl && (
                          <div className="mt-3">
                            <img
                              src={message.resultImageUrl}
                              alt="Kết quả"
                              className="rounded-xl border border-gray-200 max-h-72 object-contain"
                            />
                          </div>
                        )}

                        {!isUser && !isSystem && (
                          <div className="mt-3 flex items-center gap-3 text-xs">
                            <button
                              onClick={() => handlePlaySpeech(message)}
                              className="px-3 py-1 rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              Phát giọng nói
                            </button>
                          </div>
                        )}

                        {message.requiresValidation && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                            <p className="text-sm font-medium text-blue-700 mb-2">Cần xác nhận từ con người</p>
                            <textarea
                              value={validationNotes[message.id] || ''}
                              onChange={(event) =>
                                setValidationNotes((prev) => ({
                                  ...prev,
                                  [message.id]: event.target.value
                                }))
                              }
                              rows={2}
                              className="w-full text-sm p-2 rounded-lg border border-blue-100 focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                              placeholder="Ghi chú thêm (tùy chọn)"
                            />
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => handleValidationSubmit(message.id, 'yes')}
                                className="px-3 py-1 text-sm rounded-full bg-green-600 text-white hover:bg-green-700"
                              >
                                Đồng ý
                              </button>
                              <button
                                onClick={() => handleValidationSubmit(message.id, 'no')}
                                className="px-3 py-1 text-sm rounded-full bg-red-600 text-white hover:bg-red-700"
                              >
                                Không đồng ý
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSubmit} className="border-t border-gray-100 px-6 py-5 bg-white">
                {previewUrl && (
                  <div className="mb-4 flex items-center gap-4">
                    <img
                      src={previewUrl}
                      alt="Xem trước"
                      className="h-20 w-20 rounded-xl border border-gray-200 object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="text-sm text-gray-500 hover:text-red-500"
                    >
                      Xóa ảnh
                    </button>
                  </div>
                )}

                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Nhập câu hỏi y tế của bạn..."
                      rows={1}
                      className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

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
                    className="h-12 w-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-200"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`h-12 w-12 rounded-full flex items-center justify-center border transition ${
                      isRecording
                        ? 'bg-red-500 text-white border-red-500'
                        : 'border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="h-12 px-5 rounded-full bg-blue-600 text-white font-semibold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    Gửi
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trợ Lý AI Hỗ Trợ</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li>Gợi ý chăm sóc sức khỏe tại nhà</li>
                  <li>Giải thích triệu chứng và khuyến nghị hành động</li>
                  <li>Hướng dẫn chuẩn bị trước khi đi khám</li>
                  <li>Hỗ trợ phân tích hình ảnh y khoa</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-sky-500 rounded-3xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Lưu ý quan trọng</h3>
                <p className="text-sm text-white/90">
                  Trợ lý AI không thay thế bác sĩ. Nếu có triệu chứng nghiêm trọng, hãy liên hệ cơ sở y tế gần nhất.
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Mẹo sử dụng nhanh</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>Mô tả rõ triệu chứng, thời gian và mức độ.</p>
                  <p>Đính kèm ảnh rõ nét nếu cần phân tích da liễu.</p>
                  <p>Nếu cần hỗ trợ khẩn cấp, gọi số 115.</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
