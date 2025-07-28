import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { preorderService } from '@/services';
import { Search, Package, Calendar, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import Button from '@/components/admin/ui/Button';
import Table from '@/components/admin/ui/Table';
import Badge from '@/components/admin/ui/Badge';
import Card from '@/components/admin/ui/Card';
import LoadingSpinner from '@/components/admin/ui/LoadingSpinner';
import Modal from '@/components/admin/ui/Modal';
import { formatCurrency, formatDate, getStatusColor, debounce } from '@/utils/helpers';
import { toast } from 'react-hot-toast';

export default function PreordersPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '30d',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
  });
  const [selectedPreorder, setSelectedPreorder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const queryClient = useQueryClient();

  // Updated to React Query v5 syntax
  const { data, isLoading, error } = useQuery({
    queryKey: ['preorders', search, filters, pagination],
    queryFn: () => preorderService.getPreorders({
      search,
      ...filters,
      page: pagination.page,
      limit: pagination.limit,
    }),
    keepPreviousData: true,
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => preorderService.updatePreorderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preorders'] });
      toast.success('Preorder status updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update preorder status');
    },
  });

  const convertToOrderMutation = useMutation({
    mutationFn: preorderService.convertToOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['preorders'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success(`Preorder converted to order #${data.orderNumber}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to convert preorder');
    },
  });

  const cancelPreorderMutation = useMutation({
    mutationFn: preorderService.cancelPreorder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preorders'] });
      toast.success('Preorder cancelled');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to cancel preorder');
    },
  });

  const debouncedSearch = debounce((value) => {
    setSearch(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, 300);

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusUpdate = (preorderId, status) => {
    updateStatusMutation.mutate({ id: preorderId, status });
  };

  const handleConvertToOrder = (preorderId) => {
    if (confirm('Are you sure you want to convert this preorder to an order?')) {
      convertToOrderMutation.mutate(preorderId);
    }
  };

  const handleCancelPreorder = (preorderId) => {
    if (confirm('Are you sure you want to cancel this preorder?')) {
      cancelPreorderMutation.mutate(preorderId);
    }
  };

  const handleViewDetails = (preorder) => {
    setSelectedPreorder(preorder);
    setShowModal(true);
  };

  const getPreorderStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'warning', icon: Calendar, label: 'Pending Confirmation' };
      case 'confirmed':
        return { color: 'primary', icon: CheckCircle, label: 'Confirmed' };
      case 'ready':
        return { color: 'success', icon: Package, label: 'Ready to Ship' };
      case 'converted':
        return { color: 'success', icon: ArrowRight, label: 'Converted to Order' };
      case 'cancelled':
        return { color: 'danger', icon: XCircle, label: 'Cancelled' };
      default:
        return { color: 'secondary', icon: Calendar, label: status };
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Preorders</h1>
            <p className="text-gray-600">Manage customer preorders and deposits</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Preorders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data?.total || 0}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ready to Ship</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data?.readyToShip || 0}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data?.pending || 0}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(data?.totalValue || 0)}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search preorders..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                onChange={handleSearchChange}
              />
            </div>
            
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="ready">Ready to Ship</option>
              <option value="converted">Converted</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Preorders Table */}
        <Card>
          <Card.Content className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="large" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                Error loading preorders: {error.message}
              </div>
            ) : (
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Preorder ID</Table.Head>
                    <Table.Head>Customer</Table.Head>
                    <Table.Head>Product</Table.Head>
                    <Table.Head>Quantity</Table.Head>
                    <Table.Head>Deposit</Table.Head>
                    <Table.Head>Status</Table.Head>
                    <Table.Head>Date</Table.Head>
                    <Table.Head>Actions</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data?.preorders?.map((preorder) => {
                    const statusInfo = getPreorderStatusInfo(preorder.status);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <Table.Row key={preorder.id}>
                        <Table.Cell>
                          <span className="font-mono text-sm">#{preorder.id}</span>
                        </Table.Cell>
                        <Table.Cell>
                          <div>
                            <p className="font-medium text-gray-900">
                              {preorder.customer?.firstName} {preorder.customer?.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{preorder.customer?.email}</p>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <div>
                            <p className="font-medium text-gray-900">
                              {preorder.product?.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {preorder.productVariant?.color?.name} - {preorder.productVariant?.size?.name}
                            </p>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="font-medium">{preorder.quantity}</span>
                        </Table.Cell>
                        <Table.Cell>
                          {formatCurrency(preorder.depositAmount)}
                        </Table.Cell>
                        <Table.Cell>
                          <Badge variant={statusInfo.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          {formatDate(preorder.createdAt)}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(preorder)}
                            >
                              View
                            </Button>
                            {preorder.status === 'confirmed' && (
                              <Button
                                size="sm"
                                onClick={() => handleConvertToOrder(preorder.id)}
                                loading={convertToOrderMutation.isPending}
                              >
                                Convert
                              </Button>
                            )}
                            {preorder.status === 'pending' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate(preorder.id, 'confirmed')}
                                loading={updateStatusMutation.isPending}
                              >
                                Confirm
                              </Button>
                            )}
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            )}

            {data?.preorders?.length === 0 && (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No preorders found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Preorders will appear here when customers place them.
                </p>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Preorder Detail Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Preorder Details"
        size="lg"
      >
        {selectedPreorder && (
          <div className="space-y-6">
            {/* Preorder Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Preorder ID</h4>
                <p className="font-mono">#{selectedPreorder.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Status</h4>
                <Badge variant={getPreorderStatusInfo(selectedPreorder.status).color}>
                  {getPreorderStatusInfo(selectedPreorder.status).label}
                </Badge>
              </div>
            </div>

            {/* Customer & Product Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Customer</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">
                    {selectedPreorder.customer?.firstName} {selectedPreorder.customer?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{selectedPreorder.customer?.email}</p>
                  {selectedPreorder.customer?.phone && (
                    <p className="text-sm text-gray-600">{selectedPreorder.customer.phone}</p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Product</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{selectedPreorder.product?.name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedPreorder.productVariant?.color?.name} - {selectedPreorder.productVariant?.size?.name}
                  </p>
                  <p className="text-sm text-gray-600">SKU: {selectedPreorder.productVariant?.sku}</p>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Quantity</h4>
                <p className="text-lg font-medium">{selectedPreorder.quantity}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Deposit Amount</h4>
                <p className="text-lg font-medium">{formatCurrency(selectedPreorder.depositAmount)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Date Created</h4>
                <p className="text-sm text-gray-600">{formatDate(selectedPreorder.createdAt)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              {selectedPreorder.status === 'pending' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleCancelPreorder(selectedPreorder.id);
                      setShowModal(false);
                    }}
                  >
                    Cancel Preorder
                  </Button>
                  <Button
                    onClick={() => {
                      handleStatusUpdate(selectedPreorder.id, 'confirmed');
                      setShowModal(false);
                    }}
                  >
                    Confirm Preorder
                  </Button>
                </>
              )}
              
              {selectedPreorder.status === 'confirmed' && (
                <Button
                  onClick={() => {
                    handleConvertToOrder(selectedPreorder.id);
                    setShowModal(false);
                  }}
                >
                  Convert to Order
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}