import { useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Eye, MoreHorizontal, Mail, Phone } from 'lucide-react';
import { formatDate, formatCurrency } from '@/utils/helpers';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

const CustomerTable = ({ 
  customers, 
  loading, 
  error, 
  pagination, 
  onPaginationChange 
}) => {
  const [selectedCustomers, setSelectedCustomers] = useState([]);

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
          Error loading customers: {error.message}
        </div>
      </div>
    );
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCustomers(customers.map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId, checked) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerId]);
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Table Actions */}
      {selectedCustomers.length > 0 && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {selectedCustomers.length} customers selected
            </span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="danger" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-12">
              <input
                type="checkbox"
                checked={selectedCustomers.length === customers.length && customers.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </Table.Head>
            <Table.Head>Customer</Table.Head>
            <Table.Head>Email</Table.Head>
            <Table.Head>Orders</Table.Head>
            <Table.Head>Total Spent</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>Joined</Table.Head>
            <Table.Head className="w-12"></Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {customers.map((customer) => (
            <Table.Row key={customer.id}>
              <Table.Cell>
                <input
                  type="checkbox"
                  checked={selectedCustomers.includes(customer.id)}
                  onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">
                      {customer.firstName?.[0]}{customer.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <Link href={`/customers/${customer.id}`}>
                      <p className="font-medium text-gray-900 hover:text-primary-600">
                        {customer.firstName} {customer.lastName}
                      </p>
                    </Link>
                    {customer.phone && (
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                    )}
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell>
                <span className="text-sm text-gray-900">{customer.email}</span>
              </Table.Cell>
              <Table.Cell>
                <span className="text-sm text-gray-900">
                  {customer._count?.orders || 0} orders
                </span>
              </Table.Cell>
              <Table.Cell>
                <span className="font-medium text-gray-900">
                  {formatCurrency(customer.totalSpent || 0)}
                </span>
              </Table.Cell>
              <Table.Cell>
                <Badge variant={customer.isActive ? 'success' : 'secondary'}>
                  {customer.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <span className="text-sm text-gray-500">
                  {formatDate(customer.createdAt)}
                </span>
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center space-x-2">
                  <Link href={`/customers/${customer.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {customers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No customers found</p>
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

export default CustomerTable;