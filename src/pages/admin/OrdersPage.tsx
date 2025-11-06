'use client';

import React, { useState, useEffect } from 'react';
import { 
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import AdminTable, { Column } from '@/components/admin/AdminTable';
import { Order, TableFilter, BulkAction } from '@/types/admin';
import { orderApi } from '@/api/adminApi';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10
  });
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderCount, setOrderCount] = useState<number>(0);

  const openOrderModal = React.useCallback((order: Order | null = null) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  }, []);

  const closeOrderModal = React.useCallback(() => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  }, []);

  const loadOrders = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderApi.getOrders({
        page: pagination.current,
        limit: pagination.pageSize
      });
      
      setOrders(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.pagination?.total || response.data?.length || 0
      }));
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
      alert('Có lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize]);

  const loadOrderCount = React.useCallback(async () => {
    try {
      const response = await orderApi.getOrdersCount();
      setOrderCount(response.count || 0);
    } catch (error) {
      console.error('Error loading order count:', error);
    }
  }, []);

  React.useEffect(() => {
    loadOrders();
    loadOrderCount();
  }, [loadOrders, loadOrderCount]);



  const handleUpdateOrderStatus = React.useCallback(async (orderId: string, status: string) => {
    try {
      const response = await orderApi.updateOrderStatus(orderId, status);
      if (response.success) {
        await loadOrders();
        await loadOrderCount();
        alert('Cập nhật trạng thái thành công!');
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Update order status error:', error);
      alert('Có lỗi xảy ra!');
    }
  }, [loadOrders, loadOrderCount]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'consultation': return 'Tư vấn';
      case 'prescription': return 'Kê đơn';
      case 'test': return 'Xét nghiệm';
      default: return type;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Đã thanh toán';
      case 'pending': return 'Chờ thanh toán';
      case 'failed': return 'Thất bại';
      default: return status;
    }
  };

  const columns: Column<Order>[] = [
    {
      key: 'id',
      title: 'Mã đơn',
      width: '120px',
      render: (value: any) => (
        <span className="font-mono text-sm">{value}</span>
      )
    },
    {
      key: 'patientName',
      title: 'Bệnh nhân',
      sortable: true,
      render: (value: any, record: any) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">ID: {record.patientId}</div>
        </div>
      )
    },
    {
      key: 'doctorName',
      title: 'Bác sĩ',
      sortable: true,
      render: (value: any, record: any) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">ID: {record.doctorId}</div>
        </div>
      )
    },
    {
      key: 'type',
      title: 'Loại',
      sortable: true,
      render: (value: any) => (
        <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
          {getTypeText(value)}
        </span>
      )
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
      key: 'amount',
      title: 'Số tiền',
      sortable: true,
      render: (value: any) => (
        <span className="text-sm font-medium">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'paymentStatus',
      title: 'Thanh toán',
      sortable: true,
      render: (value: any) => (
        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(value)}`}>
          {getPaymentStatusText(value)}
        </span>
      )
    },
    {
      key: 'appointmentDate',
      title: 'Ngày hẹn',
      sortable: true,
      render: (value: any) => (
        <div className="flex items-center gap-1">
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{new Date(value).toLocaleDateString('vi-VN')}</span>
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '150px',
      render: (_, record: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedOrder(record);
              setShowOrderModal(true);
            }}
            className="text-blue-600 hover:text-blue-800"
            title="Xem chi tiết"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          
          {record.status === 'pending' && (
            <button
              onClick={() => handleUpdateOrderStatus(record.id, 'confirmed')}
              className="text-green-600 hover:text-green-800"
              title="Xác nhận"
            >
              <CheckCircleIcon className="h-4 w-4" />
            </button>
          )}
          
          {(record.status === 'pending' || record.status === 'confirmed') && (
            <button
              onClick={() => handleUpdateOrderStatus(record.id, 'cancelled')}
              className="text-red-600 hover:text-red-800"
              title="Hủy đơn"
            >
              <XCircleIcon className="h-4 w-4" />
            </button>
          )}
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
        { label: 'Chờ xác nhận', value: 'pending' },
        { label: 'Đã xác nhận', value: 'confirmed' },
        { label: 'Hoàn thành', value: 'completed' },
        { label: 'Đã hủy', value: 'cancelled' }
      ]
    },
    {
      key: 'type',
      label: 'Loại dịch vụ',
      type: 'select',
      options: [
        { label: 'Tư vấn', value: 'consultation' },
        { label: 'Kê đơn', value: 'prescription' },
        { label: 'Xét nghiệm', value: 'test' }
      ]
    },
    {
      key: 'paymentStatus',
      label: 'Thanh toán',
      type: 'select',
      options: [
        { label: 'Đã thanh toán', value: 'paid' },
        { label: 'Chờ thanh toán', value: 'pending' },
        { label: 'Thất bại', value: 'failed' }
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

  const bulkActions: BulkAction[] = [
    {
      key: 'confirm',
      label: 'Xác nhận',
      icon: CheckCircleIcon
    },
    {
      key: 'cancel',
      label: 'Hủy đơn',
      icon: XCircleIcon,
      danger: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-gray-600">
            Theo dõi và quản lý các đơn đặt dịch vụ y tế
            {orderCount > 0 && <span className="ml-2">• Tổng: {orderCount} đơn hàng</span>}
          </p>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Chờ xác nhận</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Hoàn thành</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {orders.filter(o => o.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Doanh thu</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(orders.reduce((sum, o) => sum + o.totalAmount, 0))}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <XCircleIcon className="h-8 w-8 text-red-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Đã hủy</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {orders.filter(o => o.status === 'cancelled').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdminTable
        data={orders}
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
        onBulkAction={React.useCallback(async (action: string, keys: string[]) => {
          const actionText = action === 'delete' ? 'xóa' : 
                           action === 'confirm' ? 'xác nhận' : 
                           action === 'complete' ? 'hoàn thành' : 'hủy';
          
          if (!confirm(`Bạn có chắc chắn muốn ${actionText} ${keys.length} đơn hàng?`)) {
            return;
          }

          try {
            const response = await orderApi.bulkAction({ 
              key: action,
              label: actionText,
              action, 
              ids: keys 
            });
            
            if (response.success) {
              await loadOrders();
              await loadOrderCount();
              setSelectedKeys([]);
              alert(`${actionText.charAt(0).toUpperCase() + actionText.slice(1)} thành công!`);
            } else {
              throw new Error(response.message || 'Có lỗi xảy ra');
            }
          } catch (error) {
            console.error('Bulk action error:', error);
            alert('Có lỗi xảy ra!');
          }
        }, [loadOrders, loadOrderCount])}
        onExport={() => {
          alert('Tính năng xuất CSV sẽ được triển khai sau');
        }}
      />

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedOrder(null);
          }}
          onStatusUpdate={handleUpdateOrderStatus}
        />
      )}
    </div>
  );
}

// Order Detail Modal
interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: string) => void;
}

function OrderDetailModal({ order, onClose, onStatusUpdate }: OrderDetailModalProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'consultation': return 'Tư vấn';
      case 'prescription': return 'Kê đơn';
      case 'test': return 'Xét nghiệm';
      default: return type;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Chi tiết đơn hàng</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mã đơn hàng</label>
                <p className="mt-1 text-sm font-mono bg-gray-50 p-2 rounded">{order.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Loại dịch vụ</label>
                <p className="mt-1 text-sm">{getTypeText(order.type)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <p className="mt-1 text-sm">{getStatusText(order.status)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Số tiền</label>
                <p className="mt-1 text-sm font-medium">{formatCurrency(order.totalAmount)}</p>
              </div>
            </div>

            {/* Patient & Doctor Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bệnh nhân</label>
                <p className="mt-1 text-sm">{order.patientName}</p>
                <p className="text-xs text-gray-500">ID: {order.patientId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bác sĩ</label>
                <p className="mt-1 text-sm">{order.doctorName}</p>
                <p className="text-xs text-gray-500">ID: {order.doctorId}</p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Phương thức thanh toán</label>
                <p className="mt-1 text-sm">{order.paymentMethod || 'Chưa xác định'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ngày tạo</label>
                <p className="mt-1 text-sm">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
                <p className="mt-1 text-sm bg-gray-50 p-3 rounded">{order.notes}</p>
              </div>
            )}

            {/* Status Actions */}
            {(order.status === 'pending' || order.status === 'confirmed') && (
              <div className="flex gap-3 pt-4 border-t">
                {order.status === 'pending' && (
                  <button
                    onClick={() => {
                      onStatusUpdate(order.id, 'confirmed');
                      onClose();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                    Xác nhận đơn
                  </button>
                )}
                
                <button
                  onClick={() => {
                    onStatusUpdate(order.id, 'cancelled');
                    onClose();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <XCircleIcon className="h-4 w-4" />
                  Hủy đơn
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
