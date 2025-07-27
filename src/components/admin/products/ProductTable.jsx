import { useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProductTable = ({ 
  products, 
  loading, 
  error, 
  pagination, 
  onPaginationChange 
}) => {
  const [selectedProducts, setSelectedProducts] = useState([]);

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
          Error loading products: {error.message}
        </div>
      </div>
    );
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Table Actions */}
      {selectedProducts.length > 0 && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {selectedProducts.length} products selected
            </span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Bulk Edit
              </Button>
              <Button variant="danger" size="sm">
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
                checked={selectedProducts.length === products.length && products.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </Table.Head>
            <Table.Head>Product</Table.Head>
            <Table.Head>Category</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>Stock</Table.Head>
            <Table.Head>Price</Table.Head>
            <Table.Head>Created</Table.Head>
            <Table.Head className="w-12"></Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {products.map((product) => (
            <Table.Row key={product.id}>
              <Table.Cell>
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-md flex-shrink-0">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <Link href={`/products/${product.id}`}>
                      <p className="font-medium text-gray-900 hover:text-primary-600">
                        {product.name}
                      </p>
                    </Link>
                    <p className="text-sm text-gray-500">{product.sku}</p>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell>
                <span className="text-sm text-gray-900">
                  {product.category?.name || 'Uncategorized'}
                </span>
              </Table.Cell>
              <Table.Cell>
                <Badge variant={getStatusColor(product.status)}>
                  {product.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <span className={`text-sm ${
                  product.totalStock > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product.totalStock || 0} units
                </span>
              </Table.Cell>
              <Table.Cell>
                <span className="text-sm text-gray-900">
                  {formatCurrency(product.price)}
                </span>
              </Table.Cell>
              <Table.Cell>
                <span className="text-sm text-gray-500">
                  {formatDate(product.createdAt)}
                </span>
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center space-x-2">
                  <Link href={`/products/${product.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/products/${product.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
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

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found</p>
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

export default ProductTable;