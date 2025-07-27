import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services';
import { orderService } from '../../services'
import StatsCard from '../../components/admin/dashboard/StatsCard';
import SalesChart from '../../components/admin/dashboard/SalesChart';
import RecentOrders from '../../components/admin/dashboard/RecentOrders';
import TopProducts from '../../components/admin/dashboard/TopProducts';
import LoadingSpinner from '../../components/admin/ui/LoadingSpinner';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState('7d');

  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading } = useQuery(
    ['dashboard-stats', dateRange],
    () => analyticsService.getDashboardStats({ range: dateRange }),
    { refetchInterval: 5 * 60 * 1000 } // Refetch every 5 minutes
  );

  const { data: recentOrders, isLoading: ordersLoading } = useQuery(
    'recent-orders',
    () => orderService.getRecentOrders(10)
  );

  const { data: salesData, isLoading: salesLoading } = useQuery(
    ['sales-analytics', dateRange],
    () => analyticsService.getSalesAnalytics({ range: dateRange })
  );

  const { data: topProducts, isLoading: productsLoading } = useQuery(
    ['top-products', dateRange],
    () => analyticsService.getProductPerformance({ range: dateRange, limit: 5 })
  );

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={stats?.totalRevenue || 0}
          change={stats?.revenueChange || 0}
          icon={DollarSign}
          format="currency"
        />
        <StatsCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          change={stats?.ordersChange || 0}
          icon={ShoppingCart}
          format="number"
        />
        <StatsCard
          title="Total Customers"
          value={stats?.totalCustomers || 0}
          change={stats?.customersChange || 0}
          icon={Users}
          format="number"
        />
        <StatsCard
          title="Products Sold"
          value={stats?.productsSold || 0}
          change={stats?.productsSoldChange || 0}
          icon={Package}
          format="number"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2">
          <SalesChart 
            data={salesData} 
            loading={salesLoading}
            dateRange={dateRange}
          />
        </div>
        
        {/* Recent Orders */}
        <RecentOrders 
          orders={recentOrders} 
          loading={ordersLoading}
        />
        
        {/* Top Products */}
        <TopProducts 
          products={topProducts} 
          loading={productsLoading}
        />
      </div>
    </div>
  );
}