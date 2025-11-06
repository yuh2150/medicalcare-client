'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { 
  ChevronUpIcon, 
  ChevronDownIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { TableFilter, BulkAction } from '@/types/admin';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string;
}

export interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number, pageSize: number) => void;
  };
  selection?: {
    selectedKeys: string[];
    onChange: (keys: string[]) => void;
    getRowKey: (record: T) => string;
  };
  filters?: TableFilter[];
  onFilter?: (filters: Record<string, any>) => void;
  bulkActions?: BulkAction[];
  onBulkAction?: (action: string, selectedKeys: string[]) => void;
  searchable?: boolean;
  onSearch?: (value: string) => void;
  exportable?: boolean;
  onExport?: () => void;
  className?: string;
}

export default function AdminTable<T>({
  data,
  columns,
  loading = false,
  pagination,
  selection,
  filters,
  onFilter,
  bulkActions,
  onBulkAction,
  searchable = true,
  onSearch,
  exportable = true,
  onExport,
  className = ''
}: AdminTableProps<T>) {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({});

  // Memoized computed values for better performance
  const hasSelection = Boolean(selection && selection.selectedKeys.length > 0);
  const isAllSelected = useMemo(() => {
    if (!selection || data.length === 0) return false;
    return data.every(record => selection.selectedKeys.includes(selection.getRowKey(record)));
  }, [selection, data]);
  
  const isIndeterminate = useMemo(() => {
    if (!selection || data.length === 0) return false;
    const selectedCount = data.filter(record => 
      selection.selectedKeys.includes(selection.getRowKey(record))
    ).length;
    return selectedCount > 0 && selectedCount < data.length;
  }, [selection, data]);

  const handleSort = useCallback((field: string) => {
    if (!columns.find(col => col.key === field)?.sortable) return;
    
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [columns, sortField, sortDirection]);

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  }, [onSearch]);

  const handleFilterChange = useCallback((key: string, value: any) => {
    const newFilters = { ...currentFilters, [key]: value };
    setCurrentFilters(newFilters);
    onFilter?.(newFilters);
  }, [currentFilters, onFilter]);

  const handleBulkAction = useCallback((action: string) => {
    if (!selection?.selectedKeys.length) return;
    onBulkAction?.(action, selection.selectedKeys);
  }, [selection, onBulkAction]);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (!selection) return;
    
    if (checked) {
      const allKeys = data.map(item => selection.getRowKey(item));
      selection.onChange(allKeys);
    } else {
      selection.onChange([]);
    }
  }, [selection, data]);

  const handleSelectRow = useCallback((key: string, checked: boolean) => {
    if (!selection) return;
    
    const newKeys = checked 
      ? [...selection.selectedKeys, key]
      : selection.selectedKeys.filter(k => k !== key);
    
    selection.onChange(newKeys);
  }, [selection]);



  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header Controls */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            {searchable && (
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="text-gray-500 pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
            
            {filters && filters.length > 0 && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-gray-500 flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <FunnelIcon className="h-4 w-4" />
                Bộ lọc
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selection && selection.selectedKeys.length > 0 && bulkActions && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Đã chọn {selection.selectedKeys.length} mục
                </span>
                {bulkActions.map((action) => (
                  <button
                    key={action.key}
                    onClick={() => handleBulkAction(action.key)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm ${
                      action.danger
                        ? 'text-red-600 bg-red-50 hover:bg-red-100'
                        : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {action.icon && <action.icon className="h-4 w-4" />}
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {exportable && (
              <button
                onClick={onExport}
                className="text-gray-500 flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                Xuất CSV
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && filters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filters.map((filter) => (
                <div key={filter.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {filter.label}
                  </label>
                  {filter.type === 'select' ? (
                    <select
                      value={currentFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      className="text-gray-500 text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Tất cả</option>
                      {filter.options?.map((option: any) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : filter.type === 'date' ? (
                    <input
                      type="date"
                      value={currentFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      className="text-gray-500 text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={filter.placeholder}
                      value={currentFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      className="text-gray-500 text-gray-500 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selection && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected || false}
                    ref={(input) => {
                      if (input) input.indeterminate = isIndeterminate || false;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center gap-1">
                    {column.title}
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUpIcon 
                          className={`h-3 w-3 ${
                            sortField === column.key && sortDirection === 'asc' 
                              ? 'text-blue-600' 
                              : 'text-gray-400'
                          }`} 
                        />
                        <ChevronDownIcon 
                          className={`h-3 w-3 -mt-1 ${
                            sortField === column.key && sortDirection === 'desc' 
                              ? 'text-blue-600' 
                              : 'text-gray-400'
                          }`} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td 
                  colSpan={columns.length + (selection ? 1 : 0)} 
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (selection ? 1 : 0)} 
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              data.map((record, index) => {
                const rowKey = selection?.getRowKey(record) || String(index);
                const isSelected = selection?.selectedKeys.includes(rowKey) || false;
                
                return (
                  <tr key={rowKey} className={isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                    {selection && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(rowKey, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {column.render 
                          ? column.render((record as any)[column.key], record, index)
                          : String((record as any)[column.key] || '')
                        }
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị <span className="font-medium">{((pagination.current - 1) * pagination.pageSize) + 1}</span> đến{' '}
            <span className="font-medium">
              {Math.min(pagination.current * pagination.pageSize, pagination.total)}
            </span>{' '}
            của <span className="font-medium">{pagination.total}</span> kết quả
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
              disabled={pagination.current <= 1}
              className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, Math.ceil(pagination.total / pagination.pageSize)) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => pagination.onChange(page, pagination.pageSize)}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      pagination.current === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
