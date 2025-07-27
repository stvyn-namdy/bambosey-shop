import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ORDER_STATUSES } from '../../utils/constants';

const OrderStatus = ({ isOpen, onClose, order, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      status: order?.status || '',
      notes: '',
      sendNotification: true,
    }
  });

  const watchedStatus = watch('status');

  const statusOptions = [
    { value: ORDER_STATUSES.PENDING, label: 'Pending', icon: Package, color: 'text-yellow-600' },
    { value: ORDER_STATUSES.PROCESSING, label: 'Processing', icon: Package, color: 'text-blue-600' },
    { value: ORDER_STATUSES.SHIPPED, label: 'Shipped', icon: Truck, color: 'text-purple-600' },
    { value: ORDER_STATUSES.DELIVERED, label: 'Delivered', icon: CheckCircle, color: 'text-green-600' },
    { value: ORDER_STATUSES.CANCELLED, label: 'Cancelled', icon: XCircle, color: 'text-red-600' },
    { value: ORDER_STATUSES.REFUNDED, label: 'Refunded', icon: XCircle, color: 'text-gray-600' },
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await onUpdate(order.id, data.status, {
        notes: data.notes,
        sendNotification: data.sendNotification,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case ORDER_STATUSES.PENDING:
        return 'Order has been placed and is awaiting processing.';
      case ORDER_STATUSES.PROCESSING:
        return 'Order is being prepared for shipment.';
      case ORDER_STATUSES.SHIPPED:
        return 'Order has been shipped and is on its way to the customer.';
      case ORDER_STATUSES.DELIVERED:
        return 'Order has been successfully delivered to the customer.';
      case ORDER_STATUSES.CANCELLED:
        return 'Order has been cancelled and will not be processed.';
      case ORDER_STATUSES.REFUNDED:
        return 'Order has been refunded to the customer.';
      default:
        return '';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Order Status"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Current Status */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Current Status</h4>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
              {order?.status}
            </span>
            <span className="text-sm text-gray-500">
              Since {new Date(order?.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* New Status Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select New Status
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {statusOptions.map((option) => {
              const Icon = option.icon;
              return (
                <label
                  key={option.value}
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    watchedStatus === option.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    {...register('status', { required: 'Please select a status' })}
                    className="sr-only"
                  />
                  <Icon className={`h-6 w-6 ${option.color} mr-3`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{option.label}</p>
                    <p className="text-sm text-gray-500">
                      {getStatusDescription(option.value)}
                    </p>
                  </div>
                  {watchedStatus === option.value && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="h-5 w-5 text-primary-600" />
                    </div>
                  )}
                </label>
              );
            })}
          </div>
          {errors.status && (
            <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes (Optional)
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="Add any additional notes about this status change..."
          />
        </div>

        {/* Notification Option */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="sendNotification"
            {...register('sendNotification')}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="sendNotification" className="ml-2 block text-sm text-gray-900">
            Send notification email to customer
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={!watchedStatus || watchedStatus === order?.status}
          >
            Update Status
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default OrderStatus;