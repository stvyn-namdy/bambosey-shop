import { useRouter } from 'next/router';
import { useOrder, useUpdateOrderStatus, useCancelOrder } from '@/hooks/useOrders';
import OrderDetails from '@/components/admin/orders/OrderDetails';
import LoadingSpinner from '@/components/admin/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data: order, isLoading } = useOrder(id);
  const updateStatusMutation = useUpdateOrderStatus();
  const cancelOrderMutation = useCancelOrder();

  const handleUpdateStatus = async (orderId, status, options = {}) => {
    try {
      await updateStatusMutation.mutateAsync({ id: orderId, status });
      if (options.sendNotification) {
        toast.success('Status updated and customer notified');
      } else {
        toast.success('Status updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      try {
        await cancelOrderMutation.mutateAsync(orderId);
      } catch (error) {
        toast.error('Failed to cancel order');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
        <p className="text-gray-600 mt-2">The order you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <OrderDetails
      order={order}
      loading={isLoading}
      onUpdateStatus={handleUpdateStatus}
      onCancel={handleCancelOrder}
    />
  );
}