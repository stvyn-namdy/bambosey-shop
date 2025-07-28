import { useState } from 'react';
import { Package, Truck, MapPin, CreditCard, User, Calendar, Edit } from 'lucide-react';
import { formatCurrency, formatDateTime, getStatusColor } from '@/utils/helpers';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Table from '../ui/Table';
import LoadingSpinner from '../ui/LoadingSpinner';
import OrderStatus from './OrderStatus';

const OrderDetails = ({ order, loading, onUpdateStatus, onCancel }) => {
  const [showStatusModal, setShowStatusModal] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Package className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <Package className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Order Header */}
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Order #{order.orderNumber}
                </h1>
                <p className="text-gray-600">
                  Placed on {formatDateTime(order.createdAt)}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant={getStatusColor(order.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </div>
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Order ID: {order.id}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowStatusModal(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Update Status
                </Button>
                {order.status !== 'cancelled' && (
                  <Button
                    variant="danger"
                    onClick={() => onCancel?.(order.id)}
                  >
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          </Card.Content>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <Card.Header>
                <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
              </Card.Header>
              <Card.Content className="p-0">
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.Head>Product</Table.Head>
                      <Table.Head>Quantity</Table.Head>
                      <Table.Head>Price</Table.Head>
                      <Table.Head>Total</Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {order.items?.map((item) => (
                      <Table.Row key={item.id}>
                        <Table.Cell>
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0">
                              {item.productVariant?.product?.images?.[0] ? (
                                <img
                                  src={item.productVariant.product.images[0]}
                                  alt={item.productVariant.product.name}
                                  className="w-12 h-12 rounded-md object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded-md" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {item.productVariant?.product?.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {item.productVariant?.color?.name} - {item.productVariant?.size?.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                SKU: {item.productVariant?.sku}
                              </p>
                            </div>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="font-medium">{item.quantity}</span>
                        </Table.Cell>
                        <Table.Cell>
                          {formatCurrency(item.price)}
                        </Table.Cell>
                        <Table.Cell>
                          <span className="font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Card.Content>
            </Card>

            {/* Order Timeline */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-medium text-gray-900">Order Timeline</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {order.timeline?.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        {getStatusIcon(event.status)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {event.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDateTime(event.createdAt)}
                        </p>
                        {event.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Order Summary & Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">{formatCurrency(order.shippingCost || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">{formatCurrency(order.tax || 0)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="text-green-600">-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <hr />
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* Customer Information */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-medium text-gray-900">Customer</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.customer?.firstName} {order.customer?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{order.customer?.email}</p>
                    </div>
                  </div>
                  {order.customer?.phone && (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5" />
                      <p className="text-sm text-gray-600">{order.customer.phone}</p>
                    </div>
                  )}
                </div>
              </Card.Content>
            </Card>

            {/* Shipping Address */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-medium text-gray-900">Shipping Address</h3>
              </Card.Header>
              <Card.Content>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="text-sm text-gray-900">
                    <p>{order.shippingAddress?.name}</p>
                    <p>{order.shippingAddress?.street}</p>
                    <p>
                      {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                      {order.shippingAddress?.zipCode}
                    </p>
                    <p>{order.shippingAddress?.country}</p>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* Payment Information */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-medium text-gray-900">Payment</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.payment?.method || 'Credit Card'}
                      </p>
                      <p className="text-sm text-gray-500">
                        **** **** **** {order.payment?.last4 || '****'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={order.payment?.status === 'paid' ? 'success' : 'warning'}>
                    {order.payment?.status || 'pending'}
                  </Badge>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      <OrderStatus
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        order={order}
        onUpdate={onUpdateStatus}
      />
    </>
  );
};

export default OrderDetails;