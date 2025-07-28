import { useState } from 'react';
import { useInventory, useLowStockAlerts } from '@/hooks/useInventory';
import InventoryManager from '@/components/admin/products/InventoryManager';
import Card from '@/components/admin/ui/Card';
import Badge from '@/components/admin/ui/Badge';
import { AlertTriangle, Package, TrendingDown } from 'lucide-react';

export default function InventoryPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
  });

  const { data: inventory, isLoading } = useInventory({
    page: pagination.page,
    limit: pagination.limit,
  });

  const { data: lowStockAlerts } = useLowStockAlerts();

  const handleUpdateStock = (itemId) => {
    // Handle individual stock update
    console.log('Update stock for item:', itemId);
  };

  const handleBulkUpdate = (itemIds, action) => {
    // Handle bulk update
    console.log('Bulk update:', { itemIds, action });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Monitor and manage your product inventory levels</p>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockAlerts && lowStockAlerts.length > 0 && (
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <h3 className="text-lg font-medium text-gray-900">Low Stock Alerts</h3>
              <Badge variant="warning">{lowStockAlerts.length}</Badge>
            </div>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              {lowStockAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {alert.productVariant?.product?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {alert.productVariant?.color?.name} - {alert.productVariant?.size?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-yellow-600">
                      {alert.quantity} units left
                    </p>
                    <p className="text-xs text-gray-500">
                      Threshold: {alert.lowStockThreshold}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Inventory Table */}
      <InventoryManager
        inventory={inventory?.items || []}
        loading={isLoading}
        onUpdateStock={handleUpdateStock}
        onBulkUpdate={handleBulkUpdate}
        pagination={{
          ...pagination,
          total: inventory?.total || 0,
          totalPages: inventory?.totalPages || 0,
        }}
        onPaginationChange={setPagination}
      />
    </div>
  );
}