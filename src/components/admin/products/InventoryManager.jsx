import { useState } from 'react';
import { Package, AlertTriangle, TrendingUp, TrendingDown, Search } from 'lucide-react';
import { formatNumber, debounce } from '../../utils/helpers';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Table from '../ui/Table';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';

const InventoryManager = ({ 
  inventory, 
  loading, 
  onUpdateStock, 
  onBulkUpdate,
  pagination,
  onPaginationChange 
}) => {
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  const debouncedSearch = debounce((value) => {
    setSearch(value);
    onPaginationChange?.(prev => ({ ...prev, page: 1 }));
  }, 300);

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(inventory.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleBulkAction = () => {
    if (bulkAction && selectedItems.length > 0) {
      onBulkUpdate?.(selectedItems, bulkAction);
      setSelectedItems([]);
      setBulkAction('');
    }
  };

  const getStockStatus = (quantity, lowStockThreshold = 10) => {
    if (quantity === 0) return { status: 'Out of Stock', variant: 'danger' };
    if (quantity <= lowStockThreshold) return { status: 'Low Stock', variant: 'warning' };
    return { status: 'In Stock', variant: 'success' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(inventory?.length || 0)}
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(inventory?.filter(item => item.quantity > 0).length || 0)}
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(inventory?.filter(item => item.quantity > 0 && item.quantity <= 10).length || 0)}
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(inventory?.filter(item => item.quantity === 0).length || 0)}
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <Card.Header>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Inventory Management</h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
        </Card.Header>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                {selectedItems.length} items selected
              </span>
              <div className="flex items-center space-x-2">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value="">Bulk Actions</option>
                  <option value="update_stock">Update Stock</option>
                  <option value="set_low_stock">Set Low Stock Alert</option>
                  <option value="export">Export Selected</option>
                </select>
                <Button size="sm" onClick={handleBulkAction}>
                  Apply
                </Button>
              </div>
            </div>
          </div>
        )}

        <Card.Content className="p-0">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === inventory?.length && inventory?.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </Table.Head>
                <Table.Head>Product</Table.Head>
                <Table.Head>SKU</Table.Head>
                <Table.Head>Current Stock</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Low Stock Alert</Table.Head>
                <Table.Head>Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {inventory?.map((item) => {
                const stockInfo = getStockStatus(item.quantity, item.lowStockThreshold);
                return (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-md flex-shrink-0">
                          {item.productVariant?.product?.images?.[0] ? (
                            <img
                              src={item.productVariant.product.images[0]}
                              alt={item.productVariant.product.name}
                              className="w-10 h-10 rounded-md object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-md" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.productVariant?.product?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.productVariant?.color?.name} - {item.productVariant?.size?.name}
                          </p>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-mono text-sm">{item.productVariant?.sku}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-medium">{item.quantity}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant={stockInfo.variant}>
                        {stockInfo.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-sm text-gray-600">
                        {item.lowStockThreshold || 10} units
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateStock?.(item.id)}
                      >
                        Update Stock
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>

          {(!inventory || inventory.length === 0) && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No inventory found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding products to your inventory.
              </p>
            </div>
          )}
        </Card.Content>

        {/* Pagination */}
        {pagination?.totalPages > 1 && (
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
      </Card>
    </div>
  );
};

export default InventoryManager;