'use client';

import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  TrashIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  PhotoIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { ImageFile, TableFilter, BulkAction } from '@/types/admin';

export default function ImagesPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      // Mock data
      const mockImages: ImageFile[] = Array.from({ length: 24 }, (_, i) => ({
        id: `image-${i + 1}`,
        filename: `image-${i + 1}.jpg`,
        originalName: `Hình ảnh y tế ${i + 1}.jpg`,
        url: `/images/placeholder-${i % 2 === 0 ? 'doctor' : 'specialist'}.png`,
        thumbnailUrl: `/images/placeholder-${i % 2 === 0 ? 'doctor' : 'specialist'}.png`,
        size: Math.floor(Math.random() * 5000000) + 100000,
        mimeType: 'image/jpeg',
        width: 800 + Math.floor(Math.random() * 400),
        height: 600 + Math.floor(Math.random() * 400),
        category: ['avatar', 'article', 'banner', 'general'][i % 4] as any,
        alt: `Mô tả hình ảnh ${i + 1}`,
        uploadedBy: `user-${(i % 3) + 1}`,
        uploaderName: `Người dùng ${(i % 3) + 1}`,
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString()
      }));

      // Apply filters
      let filteredImages = mockImages;
      
      if (searchQuery) {
        filteredImages = filteredImages.filter(img => 
          img.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          img.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
          img.alt?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (filterCategory) {
        filteredImages = filteredImages.filter(img => img.category === filterCategory);
      }

      setImages(filteredImages);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) {
      try {
        setImages(prev => prev.filter(img => img.id !== imageId));
        alert('Xóa thành công!');
      } catch (error) {
        console.error('Delete image error:', error);
        alert('Có lỗi xảy ra!');
      }
    }
  };

  const handleBulkAction = async (action: string, keys: string[]) => {
    try {
      if (action === 'delete') {
        if (confirm(`Bạn có chắc chắn muốn xóa ${keys.length} hình ảnh?`)) {
          setImages(prev => prev.filter(img => !keys.includes(img.id)));
          setSelectedKeys([]);
          alert('Xóa thành công!');
        }
      } else if (action === 'download') {
        alert(`Tải xuống ${keys.length} hình ảnh (tính năng sẽ được triển khai)`);
      }
    } catch (error) {
      console.error('Bulk action error:', error);
      alert('Có lỗi xảy ra!');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'avatar': return 'Avatar';
      case 'article': return 'Bài viết';
      case 'banner': return 'Banner';
      case 'general': return 'Tổng quát';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'avatar': return 'bg-blue-100 text-blue-800';
      case 'article': return 'bg-green-100 text-green-800';
      case 'banner': return 'bg-purple-100 text-purple-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Đã sao chép vào clipboard!');
  };

  const filteredImages = images.filter(img => {
    const matchesSearch = !searchQuery || 
      img.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.alt?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !filterCategory || img.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý hình ảnh</h1>
          <p className="text-gray-600">Quản lý thư viện hình ảnh của hệ thống</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm hình ảnh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tất cả danh mục</option>
            <option value="avatar">Avatar</option>
            <option value="article">Bài viết</option>
            <option value="banner">Banner</option>
            <option value="general">Tổng quát</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 border-l ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            >
              <FolderIcon className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4" />
            Upload hình ảnh
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedKeys.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              Đã chọn {selectedKeys.length} hình ảnh
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('download', selectedKeys)}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                Tải xuống
              </button>
              <button
                onClick={() => handleBulkAction('delete', selectedKeys)}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                <TrashIcon className="h-4 w-4" />
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Images Grid/List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredImages.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow border overflow-hidden group">
              <div className="relative">
                <img
                  src={image.thumbnailUrl}
                  alt={image.alt || image.originalName}
                  className="w-full h-32 object-cover"
                />
                
                {/* Selection Checkbox */}
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedKeys.includes(image.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedKeys(prev => [...prev, image.id]);
                      } else {
                        setSelectedKeys(prev => prev.filter(key => key !== image.id));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSelectedImage(image)}
                      className="p-1 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70"
                      title="Xem chi tiết"
                    >
                      <EyeIcon className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(image.url)}
                      className="p-1 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70"
                      title="Sao chép URL"
                    >
                      <DocumentDuplicateIcon className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="p-1 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70"
                      title="Xóa"
                    >
                      <TrashIcon className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <div className="text-xs font-medium text-gray-900 truncate" title={image.originalName}>
                  {image.originalName}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatFileSize(image.size)}
                </div>
                <div className="mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getCategoryColor(image.category || '')}`}>
                    {getCategoryText(image.category || '')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedKeys.length === filteredImages.length && filteredImages.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedKeys(filteredImages.map(img => img.id));
                        } else {
                          setSelectedKeys([]);
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preview</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên file</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kích thước</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tải lên</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredImages.map((image) => (
                  <tr key={image.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedKeys.includes(image.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedKeys(prev => [...prev, image.id]);
                          } else {
                            setSelectedKeys(prev => prev.filter(key => key !== image.id));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <img
                        src={image.thumbnailUrl}
                        alt={image.alt || image.originalName}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{image.originalName}</div>
                      <div className="text-sm text-gray-500">{image.filename}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatFileSize(image.size)}
                      <div className="text-xs text-gray-500">{image.width} × {image.height}</div>
                    </td>
                    <td className="px-6 py-4">                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getCategoryColor(image.category || '')}`}>
                      {getCategoryText(image.category || '')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(image.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedImage(image)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Xem chi tiết"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(image.url)}
                          className="text-green-600 hover:text-green-800"
                          title="Sao chép URL"
                        >
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Xóa"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredImages.length === 0 && (
        <div className="text-center py-12">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không có hình ảnh</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || filterCategory ? 'Không tìm thấy hình ảnh phù hợp' : 'Hãy tải lên hình ảnh đầu tiên'}
          </p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            loadImages();
            setShowUploadModal(false);
          }}
        />
      )}

      {/* Image Detail Modal */}
      {selectedImage && (
        <ImageDetailModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onSave={(updatedImage) => {
            setImages(prev => prev.map(img => 
              img.id === updatedImage.id ? updatedImage : img
            ));
            setSelectedImage(null);
          }}
        />
      )}
    </div>
  );
}

// Upload Modal Component
interface UploadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function UploadModal({ onClose, onSuccess }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file => 
        file.type.startsWith('image/')
      );
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    try {
      // Mock upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Tải lên ${files.length} hình ảnh thành công!`);
      onSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Có lỗi xảy ra khi tải lên!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Tải lên hình ảnh</h2>

          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Kéo thả hình ảnh vào đây hoặc{' '}
              <label className="text-blue-600 hover:text-blue-800 cursor-pointer">
                chọn file
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Hỗ trợ: JPG, PNG, GIF, WebP (tối đa 10MB mỗi file)
            </p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Đã chọn {files.length} file:
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <PhotoIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={handleUpload}
              disabled={files.length === 0 || uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? 'Đang tải lên...' : `Tải lên ${files.length} file`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Image Detail Modal Component
interface ImageDetailModalProps {
  image: ImageFile;
  onClose: () => void;
  onSave: (image: ImageFile) => void;
}

function ImageDetailModal({ image, onClose, onSave }: ImageDetailModalProps) {
  const [formData, setFormData] = useState({
    originalName: image.originalName,
    alt: image.alt || '',
    category: image.category
  });
  const [loading, setLoading] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Mock save
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedImage = {
        ...image,
        ...formData,
        updatedAt: new Date().toISOString()
      };
      
      onSave(updatedImage);
      alert('Cập nhật thành công!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Chi tiết hình ảnh</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Preview */}
            <div>
              <img
                src={image.url}
                alt={image.alt || image.originalName}
                className="w-full rounded-lg border"
              />
              
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Kích thước:</span>
                  <p className="text-gray-600">{image.width} × {image.height} px</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Dung lượng:</span>
                  <p className="text-gray-600">{formatFileSize(image.size)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Định dạng:</span>
                  <p className="text-gray-600">{image.mimeType}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Tải lên bởi:</span>
                  <p className="text-gray-600">{image.uploaderName}</p>
                </div>
              </div>

              <div className="mt-4">
                <span className="font-medium text-gray-700">URL:</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={image.url}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(image.url);
                      alert('Đã sao chép URL!');
                    }}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Image Info Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên file
                </label>
                <input
                  type="text"
                  value={formData.originalName}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalName: e.target.value }))}
                  className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt text (Mô tả)
                </label>
                <textarea
                  rows={3}
                  value={formData.alt}
                  onChange={(e) => setFormData(prev => ({ ...prev, alt: e.target.value }))}
                  className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mô tả hình ảnh cho SEO và accessibility..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                  className="text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="general">Tổng quát</option>
                  <option value="avatar">Avatar</option>
                  <option value="article">Bài viết</option>
                  <option value="banner">Banner</option>
                </select>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-600">
                  <p><strong>Tên file gốc:</strong> {image.filename}</p>
                  <p><strong>Ngày tải lên:</strong> {new Date(image.createdAt).toLocaleString('vi-VN')}</p>
                  <p><strong>Cập nhật lần cuối:</strong> {image.updatedAt ? new Date(image.updatedAt).toLocaleString('vi-VN') : 'Chưa cập nhật'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Đóng
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
