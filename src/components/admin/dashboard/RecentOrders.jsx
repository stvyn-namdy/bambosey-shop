import Link from 'next/link';
import { formatCurrency, formatDateTime, getStatusColor } from '@/utils/helpers';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import LoadingSpinner from '../ui/LoadingSpinner';

const RecentOrders = ({ orders, loading }) => {
  if (loading) {
    return (
      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
        </Card.Header>
        <Card.Content>
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
          <Link href="/orders" className="text-sm text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>
      </Card.Header>
      <Card.Content className="p-0">
        <div className="overflow-hidden">
          {orders && orders.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Order #{order.orderNumber}
                        </p>
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span>{order.customer?.firstName} {order.customer?.lastName}</span>
                        <span className="mx-2">•</span>
                        <span>{formatCurrency(order.total)}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No recent orders</p>
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

export default RecentOrders;