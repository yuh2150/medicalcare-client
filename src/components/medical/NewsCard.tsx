import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import type { News } from '@/types';

// Component Thẻ Tin tức
interface NewsCardProps {
  news: News;
}

export function NewsCard({ news }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Link href={`/news/${news.id}`}>
      <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100 overflow-hidden">
        {/* Hình ảnh bài viết */}
        <div className="h-48 bg-linear-to-br from-blue-50 to-blue-100 relative overflow-hidden">
          <Image
            src="/images/tintuc.jpg"
            alt={news.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Nhãn ngày tháng */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
            {formatDate(news.publishedAt)}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
            {news.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {news.excerpt}
          </p>
          
          {/* Thẻ */}
          {news.tags && news.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {news.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              {news.author && `Bởi ${news.author}`}
            </div>
            <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
              Đọc Thêm
              <ChevronRight className="w-4 h-4 ml-1 group-hover:ml-0 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
