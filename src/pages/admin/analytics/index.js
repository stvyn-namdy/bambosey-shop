import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services';
import { Calendar, TrendingUp, Users, Package, DollarSign } from 'lucide-react';
import Card from '@/components/admin/ui/Card';
import StatsCard from '@/components/admin/dashboard/StatsCard';
import AreaChart from '@/components/admin/charts/AreaChart';
import BarChart from '@/components/admin/charts/BarChart';
import PieChart from '@/components/admin/charts/PieChart';
import LoadingSpinner from '@/components/admin/ui/LoadingSpinner';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d');

  // Updated to React Query v5 syntax
  const { data: salesData, isLoading: salesLoading } = useQuery({
    queryKey: ['sales-analytics', dateRange],
    queryFn: () => analyticsService.getSalesAnalytics({ range: dateRange }),
  });

  const { data: productData, isLoading: productLoading } = useQuery({
    queryKey: ['product-analytics', dateRange],
    queryFn: () => analyticsService.getProductPerformance({ range: dateRange }),
  });

  const { data: customerData, isLoading: customerLoading } = useQuery({
    queryKey: ['customer-analytics', dateRange],
    queryFn: () => analyticsService.getCustomerAnalytics({ range: dateRange }),
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['revenue-analytics', dateRange],
    queryFn: () => analyticsService.getRevenueAnalytics({ range: dateRange }),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Detailed insights into your business performance</p>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={salesData?.totalRevenue || 0}
          change={salesData?.revenueChange || 0}
          icon={DollarSign}
          format="currency"
        />
        <StatsCard
          title="Total Orders"
          value={salesData?.totalOrders || 0}
          change={salesData?.ordersChange || 0}
          icon={Package}
          format="number"
        />
        <StatsCard
          title="New Customers"
          value={customerData?.newCustomers || 0}
          change={customerData?.newCustomersChange || 0}
          icon={Users}
          format="number"
        />
        <StatsCard
          title="Conversion Rate"
          value={salesData?.conversionRate || 0}
          change={salesData?.conversionRateChange || 0}
          icon={TrendingUp}
          format="percentage"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900">Revenue Trend</h3>
          </Card.Header>
          <Card.Content>
            {revenueLoading ? (
              <div className="h-80 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <AreaChart
                data={revenueData?.chartData || []}
                height={300}
              />
            )}
          </Card.Content>
        </Card>

        {/* Top Products */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900">Top Products by Revenue</h3>
          </Card.Header>
          <Card.Content>
            {productLoading ? (
              <div className="h-80 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <BarChart
                data={productData?.topProductsChart || []}
                height={300}
              />
            )}
          </Card.Content>
        </Card>

        {/* Customer Acquisition */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900">Customer Acquisition</h3>
          </Card.Header>
          <Card.Content>
            {customerLoading ? (
              <div className="h-80 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <AreaChart
                data={customerData?.acquisitionChart || []}
                height={300}
              />
            )}
          </Card.Content>
        </Card>

        {/* Sales by Category */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900">Sales by Category</h3>
          </Card.Header>
          <Card.Content>
            {salesLoading ? (
              <div className="h-80 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <PieChart
                data={salesData?.categoryChart || []}
                height={300}
              />
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products Table */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900">Top Performing Products</h3>
          </Card.Header>
          <Card.Content className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Units Sold
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {productData?.topProducts?.map((product, index) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${product.revenue?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.unitsSold}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Content>
        </Card>

        {/* Customer Insights */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900">Customer Insights</h3>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Order Value</span>
                <span className="text-sm font-medium text-gray-900">
                  ${customerData?.averageOrderValue?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customer Lifetime Value</span>
                <span className="text-sm font-medium text-gray-900">
                  ${customerData?.lifetimeValue?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Repeat Purchase Rate</span>
                <span className="text-sm font-medium text-gray-900">
                  {customerData?.repeatPurchaseRate?.toFixed(1) || '0.0'}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Churn Rate</span>
                <span className="text-sm font-medium text-gray-900">
                  {customerData?.churnRate?.toFixed(1) || '0.0'}%
                </span>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}