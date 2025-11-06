'use client';

import React, { useState, useEffect } from 'react';
import { 
  EyeIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import AdminTable, { Column } from '@/components/admin/AdminTable';
import { AuditLog, TableFilter } from '@/types/admin';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 20
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    loadLogs();
  }, [pagination.current, pagination.pageSize]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      // Mock data
      const mockLogs: AuditLog[] = Array.from({ length: 100 }, (_, i) => {
        const actions = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW'];
        const entities = ['User', 'Doctor', 'Order', 'Article', 'Image', 'System'];
        const levels = ['info', 'warning', 'error', 'success'];
        
        const action = actions[i % actions.length];
        const entity = entities[i % entities.length];
        const level = levels[i % levels.length];
        
        return {
          id: `log-${i + 1}`,
          action,
          entity,
          entityId: `${entity.toLowerCase()}-${Math.floor(Math.random() * 1000) + 1}`,
          userId: `user-${(i % 5) + 1}`,
          userName: `Người dùng ${(i % 5) + 1}`,
          userRole: ['admin', 'manager', 'staff'][i % 3] as any,
          level: level as any,
          message: `${action} ${entity} thành công`,
          details: {
            ip: `192.168.1.${Math.floor(Math.random() * 255) + 1}`,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            changes: action === 'UPDATE' ? {
              before: { status: 'inactive', name: 'Old Name' },
              after: { status: 'active', name: 'New Name' }
            } : undefined
          },
          createdAt: new Date(Date.now() - i * Math.random() * 24 * 60 * 60 * 1000).toISOString()
        };
      });

      const startIndex = (pagination.current - 1) * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;
      
      setLogs(mockLogs.slice(startIndex, endIndex));
      setPagination(prev => ({
        ...prev,
        total: mockLogs.length
      }));
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info': return <InformationCircleIcon className="h-4 w-4" />;
      case 'success': return <CheckCircleIcon className="h-4 w-4" />;
      case 'warning': return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'error': return <XCircleIcon className="h-4 w-4" />;
      default: return <InformationCircleIcon className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-blue-100 text-blue-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'LOGIN': return 'bg-purple-100 text-purple-800';
      case 'LOGOUT': return 'bg-gray-100 text-gray-800';
      case 'VIEW': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: Column<AuditLog>[] = [
    {
      key: 'level',
      title: 'Mức độ',
      width: '100px',
      render: (value: any) => (
        <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${getLevelColor(value)}`}>
          {getLevelIcon(value)}
          <span className="ml-1 capitalize">{value}</span>
        </span>
      )
    },
    {
      key: 'action',
      title: 'Hành động',
      width: '120px',
      render: (value: any) => (
        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getActionColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'entity',
      title: 'Đối tượng',
      render: (value: any, record: any) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">ID: {record.entityId}</div>
        </div>
      )
    },
    {
      key: 'userName',
      title: 'Người thực hiện',
      render: (value: any, record: any) => (
        <div className="flex items-center gap-2">
          <UserIcon className="h-4 w-4 text-gray-400" />
          <div>
            <div className="text-sm font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{record.userRole}</div>
          </div>
        </div>
      )
    },
    {
      key: 'message',
      title: 'Mô tả',
      render: (value: any) => (
        <div className="max-w-xs">
          <div className="text-sm text-gray-900 truncate">{value}</div>
        </div>
      )
    },
    {
      key: 'createdAt',
      title: 'Thời gian',
      sortable: true,
      render: (value: any) => (
        <div className="flex items-center gap-1">
          <ClockIcon className="h-4 w-4 text-gray-400" />
          <div>
            <div className="text-sm text-gray-900">
              {new Date(value).toLocaleDateString('vi-VN')}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(value).toLocaleTimeString('vi-VN')}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'details',
      title: 'Chi tiết',
      width: '80px',
      render: (_, record: any) => (
        <button
          onClick={() => setSelectedLog(record)}
          className="text-blue-600 hover:text-blue-800"
          title="Xem chi tiết"
        >
          <EyeIcon className="h-4 w-4" />
        </button>
      )
    }
  ];

  const filters: TableFilter[] = [
    {
      key: 'level',
      label: 'Mức độ',
      type: 'select',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' }
      ]
    },
    {
      key: 'action',
      label: 'Hành động',
      type: 'select',
      options: [
        { label: 'CREATE', value: 'CREATE' },
        { label: 'UPDATE', value: 'UPDATE' },
        { label: 'DELETE', value: 'DELETE' },
        { label: 'LOGIN', value: 'LOGIN' },
        { label: 'LOGOUT', value: 'LOGOUT' },
        { label: 'VIEW', value: 'VIEW' }
      ]
    },
    {
      key: 'entity',
      label: 'Đối tượng',
      type: 'select',
      options: [
        { label: 'User', value: 'User' },
        { label: 'Doctor', value: 'Doctor' },
        { label: 'Order', value: 'Order' },
        { label: 'Article', value: 'Article' },
        { label: 'Image', value: 'Image' },
        { label: 'System', value: 'System' }
      ]
    },
    {
      key: 'userRole',
      label: 'Vai trò',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Staff', value: 'staff' }
      ]
    },
    {
      key: 'dateFrom',
      label: 'Từ ngày',
      type: 'date'
    },
    {
      key: 'dateTo',
      label: 'Đến ngày',
      type: 'date'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nhật ký hệ thống</h1>
          <p className="text-gray-600">Theo dõi các hoạt động và thay đổi trong hệ thống</p>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <InformationCircleIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Info</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {logs.filter(log => log.level === 'info').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Success</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {logs.filter(log => log.level === 'success').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Warning</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {logs.filter(log => log.level === 'warning').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <XCircleIcon className="h-8 w-8 text-red-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Error</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {logs.filter(log => log.level === 'error').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdminTable
        data={logs}
        columns={columns}
        loading={loading}
        pagination={{
          current: pagination.current,
          total: pagination.total,
          pageSize: pagination.pageSize,
          onChange: (page: any, pageSize: any) => setPagination(prev => ({ ...prev, current: page, pageSize }))
        }}
        filters={filters}
        searchable={true}
        exportable={true}
        onExport={() => {
          alert('Tính năng xuất CSV sẽ được triển khai sau');
        }}
      />

      {/* Log Detail Modal */}
      {selectedLog && (
        <LogDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
}

// Log Detail Modal
interface LogDetailModalProps {
  log: AuditLog;
  onClose: () => void;
}

function LogDetailModal({ log, onClose }: LogDetailModalProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-blue-100 text-blue-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'LOGIN': return 'bg-purple-100 text-purple-800';
      case 'LOGOUT': return 'bg-gray-100 text-gray-800';
      case 'VIEW': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Chi tiết nhật ký</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID</label>
                <p className="mt-1 text-sm font-mono bg-gray-50 p-2 rounded">{log.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Thời gian</label>
                <p className="mt-1 text-sm">{new Date(log.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mức độ</label>
                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getLevelColor(log.level)}`}>
                  {log.level}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hành động</label>
                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getActionColor(log.action)}`}>
                  {log.action}
                </span>
              </div>
            </div>

            {/* Entity & User Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Đối tượng</label>
                <p className="mt-1 text-sm">{log.entity}</p>
                <p className="text-xs text-gray-500">ID: {log.entityId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Người thực hiện</label>
                <p className="mt-1 text-sm">{log.userName}</p>
                <p className="text-xs text-gray-500">Vai trò: {log.userRole}</p>
                <p className="text-xs text-gray-500">ID: {log.userId}</p>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Mô tả</label>
              <p className="mt-1 text-sm bg-gray-50 p-3 rounded">{log.message}</p>
            </div>

            {/* Technical Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chi tiết kỹ thuật</label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <span className="text-xs font-medium text-gray-700">IP Address:</span>
                    <p className="text-xs text-gray-600 font-mono">{log.details.ip}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-700">User Agent:</span>
                    <p className="text-xs text-gray-600 font-mono break-all">{log.details.userAgent}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Changes (if UPDATE action) */}
            {log.action === 'UPDATE' && log.details.changes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thay đổi</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-2">Trước khi thay đổi:</h4>
                    <pre className="text-xs bg-red-50 p-3 rounded border text-red-800 overflow-x-auto">
                      {JSON.stringify(log.details.changes.before, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-2">Sau khi thay đổi:</h4>
                    <pre className="text-xs bg-green-50 p-3 rounded border text-green-800 overflow-x-auto">
                      {JSON.stringify(log.details.changes.after, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Raw Log Data */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dữ liệu thô</label>
              <pre className="text-xs bg-gray-100 p-4 rounded border overflow-x-auto">
                {JSON.stringify(log, null, 2)}
              </pre>
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
