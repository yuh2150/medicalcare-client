import React from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Search, Filter, Download, MoreHorizontal } from 'lucide-react';
import { Button, Input, Dropdown, DropdownItem, Badge } from './index';
import { Select } from './Form';

// ====================
// TABLE TYPES
// ====================

export interface Column<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableFilter {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'daterange';
  options?: { label: string; value: string }[];
  placeholder?: string;
}

export interface BulkAction {
  key: string;
  label: string;
  icon?: React.ComponentType<any>;
  danger?: boolean;
  action?: string;
}

export interface TableProps<T> {
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
  emptyText?: string;
}

// ====================
// TABLE COMPONENTS
// ====================

export function Table<T>({
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
  className = '',
  emptyText = 'No data available'
}: TableProps<T>) {
  const [sortField, setSortField] = React.useState<string>('');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [searchValue, setSearchValue] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);
  const [currentFilters, setCurrentFilters] = React.useState<Record<string, any>>({});

  // Memoized computed values for better performance
  const hasSelection = Boolean(selection && selection.selectedKeys.length > 0);
  const isAllSelected = React.useMemo(() => {
    if (!selection || data.length === 0) return false;
    return data.every(record => selection.selectedKeys.includes(selection.getRowKey(record)));
  }, [selection, data]);
  
  const isIndeterminate = React.useMemo(() => {
    if (!selection || data.length === 0) return false;
    const selectedCount = data.filter(record => 
      selection.selectedKeys.includes(selection.getRowKey(record))
    ).length;
    return selectedCount > 0 && selectedCount < data.length;
  }, [selection, data]);

  const handleSort = React.useCallback((field: string) => {
    if (!columns.find(col => col.key === field)?.sortable) return;
    
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [columns, sortField, sortDirection]);

  const handleSearch = React.useCallback((value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  }, [onSearch]);

  const handleFilterChange = React.useCallback((key: string, value: any) => {
    const newFilters = { ...currentFilters, [key]: value };
    setCurrentFilters(newFilters);
    onFilter?.(newFilters);
  }, [currentFilters, onFilter]);

  const handleBulkAction = React.useCallback((action: string) => {
    if (!selection?.selectedKeys.length) return;
    onBulkAction?.(action, selection.selectedKeys);
  }, [selection, onBulkAction]);

  const handleSelectAll = React.useCallback((checked: boolean) => {
    if (!selection) return;
    
    if (checked) {
      const allKeys = data.map(record => selection.getRowKey(record));
      selection.onChange(allKeys);
    } else {
      selection.onChange([]);
    }
  }, [selection, data]);

  const handleSelectRow = React.useCallback((key: string, checked: boolean) => {
    if (!selection) return;
    
    const newKeys = checked 
      ? [...selection.selectedKeys, key]
      : selection.selectedKeys.filter(k => k !== key);
    
    selection.onChange(newKeys);
  }, [selection]);

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Table Header with Actions */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            
            {filters && filters.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasSelection && bulkActions && (
              <Dropdown
                trigger={
                  <Button variant="outline" size="sm">
                    Bulk Actions ({selection?.selectedKeys.length})
                  </Button>
                }
              >
                {bulkActions.map((action) => (
                  <DropdownItem
                    key={action.key}
                    onClick={() => handleBulkAction(action.key)}
                    className={action.danger ? 'text-red-600 hover:bg-red-50' : ''}
                  >
                    {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                    {action.label}
                  </DropdownItem>
                ))}
              </Dropdown>
            )}
            
            {exportable && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>

        {/* Filters Row */}
        {showFilters && filters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filters.map((filter) => (
                <div key={filter.key}>
                  {filter.type === 'select' ? (
                    <Select
                      label={filter.label}
                      options={filter.options || []}
                      placeholder={filter.placeholder}
                      value={currentFilters[filter.key] || ''}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange(filter.key, e.target.value)}
                    />
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {filter.label}
                      </label>
                      <input
                        type={filter.type}
                        placeholder={filter.placeholder}
                        value={currentFilters[filter.key] || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(filter.key, e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {selection && (
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isIndeterminate;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.align === 'center' ? 'text-center' : 
                      column.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                    style={{ width: column.width }}
                  >
                    <div className="flex items-center gap-1">
                      <span>{column.title}</span>
                      {column.sortable && (
                        <button
                          onClick={() => handleSort(String(column.key))}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {sortField === column.key ? (
                            sortDirection === 'asc' ? 
                              <ChevronUp className="w-4 h-4" /> : 
                              <ChevronDown className="w-4 h-4" />
                          ) : (
                            <div className="flex flex-col">
                              <ChevronUp className="w-3 h-3 -mb-1" />
                              <ChevronDown className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (selection ? 1 : 0)} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-500">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (selection ? 1 : 0)} className="px-6 py-12 text-center text-gray-500">
                    {emptyText}
                  </td>
                </tr>
              ) : (
                data.map((record, index) => {
                  const rowKey = selection?.getRowKey(record) || String(index);
                  const isSelected = selection?.selectedKeys.includes(rowKey) || false;
                  
                  return (
                    <tr 
                      key={rowKey}
                      className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                    >
                      {selection && (
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(rowKey, e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                      )}
                      {columns.map((column) => (
                        <td
                          key={String(column.key)}
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            column.align === 'center' ? 'text-center' : 
                            column.align === 'right' ? 'text-right' : 'text-left'
                          }`}
                        >
                          {column.render 
                            ? column.render(record[column.key as keyof T], record, index)
                            : String(record[column.key as keyof T] || '-')
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
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {Math.min((pagination.current - 1) * pagination.pageSize + 1, pagination.total)} to{' '}
              {Math.min(pagination.current * pagination.pageSize, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
                disabled={pagination.current <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, Math.ceil(pagination.total / pagination.pageSize)) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => pagination.onChange(page, pagination.pageSize)}
                      className={`px-3 py-1 text-sm rounded ${
                        pagination.current === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ====================
// STATUS BADGE HELPER
// ====================

interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
}

export function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  const variants = {
    success: 'success',
    warning: 'warning', 
    danger: 'danger',
    info: 'info',
    default: 'secondary'
  };

  return (
    <Badge variant={variants[variant] as any} size="sm">
      {status}
    </Badge>
  );
}

// ====================
// ACTION MENU HELPER
// ====================

interface ActionMenuProps {
  actions: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<any>;
    danger?: boolean;
  }[];
}

export function ActionMenu({ actions }: ActionMenuProps) {
  return (
    <Dropdown
      trigger={
        <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      }
    >
      {actions.map((action, index) => (
        <DropdownItem
          key={index}
          onClick={action.onClick}
          className={action.danger ? 'text-red-600 hover:bg-red-50' : ''}
        >
          {action.icon && <action.icon className="w-4 h-4 mr-2" />}
          {action.label}
        </DropdownItem>
      ))}
    </Dropdown>
  );
}
