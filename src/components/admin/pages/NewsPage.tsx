'use client';

import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  PhotoIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import AdminTable, { Column } from '@/components/admin/AdminTable';
import { Article, TableFilter, BulkAction } from '@/types/admin';

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10
  });
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  useEffect(() => {
    loadArticles();
  }, [pagination.current, pagination.pageSize]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      // Mock data
      const mockArticles: Article[] = Array.from({ length: 15 }, (_, i) => ({
        id: `article-${i + 1}`,
        title: `Bài viết y khoa số ${i + 1}`,
        slug: `bai-viet-y-khoa-so-${i + 1}`,
        excerpt: `Tóm tắt của bài viết số ${i + 1}. Đây là một bài viết về chăm sóc sức khỏe...`,
        content: `Nội dung chi tiết của bài viết số ${i + 1}...`,
        featuredImage: i % 3 === 0 ? '/images/placeholder-doctor.png' : undefined,
        status: ['draft', 'published', 'archived'][i % 3] as any,
        categoryId: `cat-${(i % 4) + 1}`,
        categoryName: ['Tin tức', 'Sức khỏe', 'Dinh dưỡng', 'Y học'][i % 4],
        tags: [`tag${i + 1}`, `health`, `medical`],
        authorId: `author-${(i % 3) + 1}`,
        authorName: `Tác giả ${(i % 3) + 1}`,
        publishedAt: i % 3 === 1 ? new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString() : undefined,
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
        viewsCount: Math.floor(Math.random() * 10000),
        likesCount: Math.floor(Math.random() * 500),
        commentsCount: Math.floor(Math.random() * 50)
      }));

      const startIndex = (pagination.current - 1) * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;
      
      setArticles(mockArticles.slice(startIndex, endIndex));
      setPagination(prev => ({
        ...prev,
        total: mockArticles.length
      }));
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        // Mock delete
        setArticles(prev => prev.filter(article => article.id !== articleId));
        alert('Xóa thành công!');
      } catch (error) {
        console.error('Delete article error:', error);
        alert('Có lỗi xảy ra!');
      }
    }
  };

  const handleBulkAction = async (action: string, keys: string[]) => {
    try {
      if (action === 'publish') {
        setArticles(prev => prev.map(article => 
          keys.includes(article.id) ? { ...article, status: 'published' as any } : article
        ));
        alert('Xuất bản thành công!');
      } else if (action === 'unpublish') {
        setArticles(prev => prev.map(article => 
          keys.includes(article.id) ? { ...article, status: 'draft' as any } : article
        ));
        alert('Hủy xuất bản thành công!');
      } else if (action === 'delete') {
        if (confirm(`Bạn có chắc chắn muốn xóa ${keys.length} bài viết?`)) {
          setArticles(prev => prev.filter(article => !keys.includes(article.id)));
          alert('Xóa thành công!');
        }
      }
      setSelectedKeys([]);
    } catch (error) {
      console.error('Bulk action error:', error);
      alert('Có lỗi xảy ra!');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Đã xuất bản';
      case 'draft': return 'Bản nháp';
      case 'archived': return 'Lưu trữ';
      default: return status;
    }
  };

  const columns: Column<Article>[] = [
    {
      key: 'featuredImage',
      title: 'Ảnh',
      width: '80px',
      render: (value: any, record: any) => (
        <div className="shrink-0 h-12 w-12">
          {value ? (
            <img 
              className="h-12 w-12 rounded object-cover" 
              src={value} 
              alt={record.title} 
            />
          ) : (
            <PhotoIcon className="h-12 w-12 text-gray-300 border rounded" />
          )}
        </div>
      )
    },
    {
      key: 'title',
      title: 'Tiêu đề',
      sortable: true,
      render: (value: any, record: any) => (
        <div className="max-w-xs">
          <div className="text-sm font-medium text-gray-900 truncate">{value}</div>
          <div className="text-sm text-gray-500 truncate">{record.excerpt}</div>
          <div className="text-xs text-gray-400">Danh mục: {record.category}</div>
        </div>
      )
    },
    {
      key: 'authorName',
      title: 'Tác giả',
      sortable: true,
      render: (value: any) => <span className="text-sm">{value}</span>
    },
    {
      key: 'status',
      title: 'Trạng thái',
      sortable: true,
      render: (value: any) => (
        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(value)}`}>
          {getStatusText(value)}
        </span>
      )
    },
    {
      key: 'views',
      title: 'Lượt xem',
      sortable: true,
      render: (value: any) => <span className="text-sm">{value?.toLocaleString()}</span>
    },
    {
      key: 'publishedAt',
      title: 'Ngày xuất bản',
      sortable: true,
      render: (value: any) => (
        <div className="flex items-center gap-1">
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {value ? new Date(value).toLocaleDateString('vi-VN') : 'Chưa xuất bản'}
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '120px',
      render: (_, record: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingArticle(record);
              setShowArticleModal(true);
            }}
            className="text-blue-600 hover:text-blue-800"
            title="Xem chi tiết"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setEditingArticle(record);
              setShowArticleModal(true);
            }}
            className="text-yellow-600 hover:text-yellow-800"
            title="Chỉnh sửa"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteArticle(record.id)}
            className="text-red-600 hover:text-red-800"
            title="Xóa"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const filters: TableFilter[] = [
    {
      key: 'status',
      label: 'Trạng thái',
      type: 'select',
      options: [
        { label: 'Đã xuất bản', value: 'published' },
        { label: 'Bản nháp', value: 'draft' },
        { label: 'Lưu trữ', value: 'archived' }
      ]
    },
    {
      key: 'category',
      label: 'Danh mục',
      type: 'select',
      options: [
        { label: 'Tin tức', value: 'Tin tức' },
        { label: 'Sức khỏe', value: 'Sức khỏe' },
        { label: 'Dinh dưỡng', value: 'Dinh dưỡng' },
        { label: 'Y học', value: 'Y học' }
      ]
    },
    {
      key: 'author',
      label: 'Tác giả',
      type: 'text',
      placeholder: 'Tên tác giả'
    },
    {
      key: 'dateFrom',
      label: 'Từ ngày',
      type: 'date'
    }
  ];

  const bulkActions: BulkAction[] = [
    {
      key: 'publish',
      label: 'Xuất bản',
      icon: CheckCircleIcon
    },
    {
      key: 'unpublish',
      label: 'Hủy xuất bản',
      icon: XCircleIcon
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: TrashIcon,
      danger: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý tin tức</h1>
          <p className="text-gray-600">Quản lý bài viết, tin tức y khoa</p>
        </div>
        <button
          onClick={() => {
            setEditingArticle(null);
            setShowArticleModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          Thêm bài viết
        </button>
      </div>

      <AdminTable
        data={articles}
        columns={columns}
        loading={loading}
        pagination={{
          current: pagination.current,
          total: pagination.total,
          pageSize: pagination.pageSize,
          onChange: (page: any, pageSize: any) => setPagination(prev => ({ ...prev, current: page, pageSize }))
        }}
        selection={{
          selectedKeys,
          onChange: setSelectedKeys,
          getRowKey: (record: any) => record.id
        }}
        filters={filters}
        bulkActions={bulkActions}
        onBulkAction={handleBulkAction}
        onExport={() => {
          alert('Tính năng xuất CSV sẽ được triển khai sau');
        }}
      />

      {/* Article Modal */}
      {showArticleModal && (
        <ArticleModal
          article={editingArticle}
          onClose={() => {
            setShowArticleModal(false);
            setEditingArticle(null);
          }}
          onSave={() => {
            loadArticles();
            setShowArticleModal(false);
            setEditingArticle(null);
          }}
        />
      )}
    </div>
  );
}

// Article Modal Component
interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
  onSave: () => void;
}

function ArticleModal({ article, onClose, onSave }: ArticleModalProps) {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    featuredImage: article?.featuredImage || '',
    status: article?.status || 'draft',
    category: article?.categoryName || '',
    tags: article?.tags?.join(', ') || '',
    authorName: article?.authorName || ''
  });
  const [loading, setLoading] = useState(false);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock save
      console.log('Saving article:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(article ? 'Cập nhật thành công!' : 'Tạo bài viết thành công!');
      onSave();
    } catch (error) {
      console.error('Save article error:', error);
      alert('Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            {article ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Chọn danh mục</option>
                  <option value="Tin tức">Tin tức</option>
                  <option value="Sức khỏe">Sức khỏe</option>
                  <option value="Dinh dưỡng">Dinh dưỡng</option>
                  <option value="Y học">Y học</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Bản nháp</option>
                  <option value="published">Xuất bản</option>
                  <option value="archived">Lưu trữ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tác giả
                </label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                  className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (cách nhau bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="VD: sức khỏe, y tế, dinh dưỡng"
                  className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ảnh đại diện (URL)
              </label>
              <input
                type="url"
                value={formData.featuredImage}
                onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formData.featuredImage && (
                <div className="mt-2">
                  <img 
                    src={formData.featuredImage} 
                    alt="Preview" 
                    className="h-24 w-24 object-cover rounded border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tóm tắt
              </label>
              <textarea
                rows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tóm tắt ngắn gọn về nội dung bài viết..."
              />
            </div>

            {/* Content - Simple textarea for now */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung *
              </label>
              <textarea
                rows={12}
                required
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Nhập nội dung bài viết (có thể sử dụng Markdown)..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Có thể sử dụng Markdown để định dạng văn bản
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Đang lưu...' : (article ? 'Cập nhật' : 'Tạo mới')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
