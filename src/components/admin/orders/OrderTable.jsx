import { useState } from 'react';
import Link from 'next/link';
import { Eye, MoreHorizontal, Package, Truck } from 'lucide-react';
import { formatCurrency, formatDateTime, getStatusColor } from '../../utils/helpers';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

const OrderTable = ({ 
  orders, 
  loading, 
  error, 
  pagination, 
  onPaginationChange 
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center text-red-600">
          Error loading orders: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Order</Table.Head>
            <Table.Head>Customer</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>Total</Table.Head>
            <Table.Head>Items</Table.Head>
            <Table.Head>Date</Table.Head>
            <Table.Head className="w-12"></Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {orders.map((order) => (
            <Table.Row key={order.id}>
              <Table.Cell>
                <Link href={`/orders/${order.id}`}>
                  <div className="hover:text-primary-600">
                    <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.id}</p>
                  </div>
                </Link>
              </Table.Cell>
              <Table.Cell>
                <div>
                  <p className="font-medium text-gray-900">
                    {order.customer?.firstName} {order.customer?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{order.customer?.email}</p>
                </div>
              </Table.Cell>
              <Table.Cell>
                <Badge variant={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <span className="font-medium text-gray-900">
                  {formatCurrency(order.total)}
                </span>
              </Table.Cell>
              <Table.Cell>
                <span className="text-sm text-gray-900">
                  {order.items?.length || 0} items
                </span>
              </Table.Cell>
              <Table.Cell>
                <span className="text-sm text-gray-500">
                  {formatDateTime(order.createdAt)}
                </span>
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center space-x-2">
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No orders found</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => onPaginationChange(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => onPaginationChange(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;