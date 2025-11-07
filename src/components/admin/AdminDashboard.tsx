'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { DashboardStats, ChartData, Activity as ActivityType } from '../../types/admin';
import { format } from 'date-fns';

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color,
  subtitle 
}) => {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              {subtitle && (
                <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
            <div className={`flex items-center text-sm ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(change)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Activity Item Component
interface ActivityItemProps {
  activity: ActivityType;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return <div className="w-2 h-2 bg-green-400 rounded-full" />;
      case 'update': return <div className="w-2 h-2 bg-blue-400 rounded-full" />;
      case 'delete': return <div className="w-2 h-2 bg-red-400 rounded-full" />;
      case 'login': return <div className="w-2 h-2 bg-purple-400 rounded-full" />;
      default: return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
  };

  const timeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return format(time, 'dd/MM/yyyy HH:mm');
  };

  return (
    <div className="flex items-start space-x-3 py-3">
      <div className="flex-shrink-0 mt-1">
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{activity.description}</p>
        <div className="flex items-center mt-1 text-xs text-gray-500">
          <span>{activity.userName}</span>
          <span className="mx-1">•</span>
          <span>{timeAgo(activity.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, chartResponse, activitiesData] = await Promise.all([
          adminApi.getDashboardStats(),
          adminApi.getChartData(),
          adminApi.getRecentActivities()
        ]);

        setStats(statsData);
        setChartData(chartResponse);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const pieData = [
    { name: 'Hoàn thành', value: stats?.orders.total || 0, color: '#10B981' },
    { name: 'Đang xử lý', value: stats?.bookings.pending || 0, color: '#F59E0B' },
    { name: 'Hôm nay', value: stats?.orders.today || 0, color: '#3B82F6' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Tổng quan về hoạt động của hệ thống
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Cập nhật lần cuối: {format(new Date(), 'dd/MM/yyyy HH:mm')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Tổng đơn hàng"
          value={formatNumber(stats?.orders.total || 0)}
          change={stats?.orders.growth || 0}
          icon={ShoppingBag}
          color="bg-blue-500"
          subtitle={`${stats?.orders.today || 0} đơn hôm nay`}
        />
        <StatsCard
          title="Doanh thu"
          value={formatCurrency(stats?.revenue.total || 0)}
          change={stats?.revenue.growth || 0}
          icon={DollarSign}
          color="bg-green-500"
          subtitle={`${formatCurrency(stats?.revenue.today || 0)} hôm nay`}
        />
        <StatsCard
          title="Bệnh nhân"
          value={formatNumber(stats?.patients.total || 0)}
          change={stats?.patients.growth || 0}
          icon={Users}
          color="bg-purple-500"
          subtitle={`${stats?.patients.new || 0} bệnh nhân mới`}
        />
        <StatsCard
          title="Lịch hẹn"
          value={formatNumber(stats?.bookings.total || 0)}
          change={0}
          icon={Calendar}
          color="bg-orange-500"
          subtitle={`${stats?.bookings.today || 0} hôm nay, ${stats?.bookings.pending || 0} chờ xử lý`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Xu hướng 7 ngày qua</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                Đơn hàng
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Bệnh nhân
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => format(new Date(value), 'dd/MM')}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy')}
                formatter={(value, name) => [
                  formatNumber(value as number), 
                  name === 'orders' ? 'Đơn hàng' : 'Bệnh nhân'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="patients" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Revenue */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Doanh thu 7 ngày qua</h3>
            <div className="text-sm text-gray-500">VNĐ</div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => format(new Date(value), 'dd/MM')}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000)}K`}
              />
              <Tooltip 
                labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy')}
                formatter={(value) => [formatCurrency(value as number), 'Doanh thu']}
              />
              <Bar 
                dataKey="revenue" 
                fill="#8B5CF6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Hoạt động gần đây</h3>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="px-6 py-4 max-h-96 overflow-y-auto">
            {activities.length > 0 ? (
              <div className="space-y-1">
                {activities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Chưa có hoạt động nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Status Overview */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Tình trạng tổng quan</h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatNumber(value as number)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </div>
                  <span className="font-medium">{formatNumber(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
