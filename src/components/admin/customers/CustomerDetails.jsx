import { useState } from 'react';
import { Edit, Mail, Phone, MapPin, Calendar, ShoppingBag } from 'lucide-react';
import { formatDate, formatCurrency, formatDateTime } from '../../utils/helpers';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Table from '../ui/Table';
import LoadingSpinner from '../ui/LoadingSpinner';

const CustomerDetails = ({ customer, orders, loading }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders', label: 'Orders' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'activity', label: 'Activity' },
  ];

  return (
    <div className="space-y-6">
      {/* Customer Header */}
      <Card>
        <Card.Content className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold text-xl">
                  {customer.firstName?.[0]}{customer.lastName?.[0]}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {customer.firstName} {customer.lastName}
                </h1>
                <p className="text-gray-600">{customer.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant={customer.isActive ? 'success' : 'secondary'}>
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Customer since {formatDate(customer.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Customer
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Stats */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <Card.Content className="p-6">
                  <div className="flex items-center">
                    <ShoppingBag className="h-8 w-8 text-primary-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {customer._count?.orders || 0}
                      </p>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Content className="p-6">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(customer.totalSpent || 0)}
                      </p>
                    </div>
                  </div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Content className="p-6">
                  <div className="flex items-center">
                    <MapPin className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Average Order</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(customer.averageOrderValue || 0)}
                      </p>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
              </Card.Header>
              <Card.Content className="p-0">
                {orders && orders.length > 0 ? (
                  <Table>
                    <Table.Header>
                      <Table.Row>
                        <Table.Head>Order</Table.Head>
                        <Table.Head>Status</Table.Head>
                        <Table.Head>Total</Table.Head>
                        <Table.Head>Date</Table.Head>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {orders.slice(0, 5).map((order) => (
                        <Table.Row key={order.id}>
                          <Table.Cell>
                            <span className="font-medium">#{order.orderNumber}</span>
                          </Table.Cell>
                          <Table.Cell>
                            <Badge variant={order.status === 'delivered' ? 'success' : 'primary'}>
                              {order.status}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell>{formatCurrency(order.total)}</Table.Cell>
                          <Table.Cell>{formatDate(order.createdAt)}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No orders found</p>
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>

          {/* Customer Info */}
          <div className="space-y-6">
            <Card>
              <Card.Header>
                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-900">{customer.email}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-900">{customer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      Joined {formatDate(customer.createdAt)}
                    </span>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <h3 className="text-lg font-medium text-gray-900">Default Address</h3>
              </Card.Header>
              <Card.Content>
                {customer.defaultAddress ? (
                  <div className="text-sm text-gray-900">
                    <p>{customer.defaultAddress.street}</p>
                    <p>
                      {customer.defaultAddress.city}, {customer.defaultAddress.state}{' '}
                      {customer.defaultAddress.zipCode}
                    </p>
                    <p>{customer.defaultAddress.country}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No default address set</p>
                )}
              </Card.Content>
            </Card>
          </div>
        </div>
      )}

      {/* Other tab contents would go here */}
      {activeTab === 'orders' && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900">All Orders</h3>
          </Card.Header>
          <Card.Content>
            <p className="text-gray-500">Order history content would go here</p>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default CustomerDetails;