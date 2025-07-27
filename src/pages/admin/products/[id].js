import { useRouter } from 'next/router';
import { useState } from 'react';
import { useProduct, useProductVariants, useUpdateProduct } from '../../hooks/useProducts';
import { Edit, ArrowLeft, Eye, Package } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import ProductVariants from '../../components/products/ProductVariants';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState('overview');

  const { data: product, isLoading } = useProduct(id);
  const { data: variants, isLoading: variantsLoading } = useProductVariants(id);
  const updateProductMutation = useUpdateProduct();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        <p className="text-gray-600 mt-2">The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'variants', label: 'Variants' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600">SKU: {product.sku}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={() => router.push(`/products/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Product
          </Button>
        </div>
      </div>

      {/* Product Info Card */}
      <Card>
        <Card.Content className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Product Image */}
            <div className="lg:col-span-1">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Price</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(product.price)}
                  </p>
                  {product.compareAtPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      {formatCurrency(product.compareAtPrice)}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge variant={getStatusColor(product.status)} className="mt-1">
                    {product.status}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Stock</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {product.totalStock || 0}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="text-sm text-gray-900">
                    {product.category?.name || 'Uncategorized'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created</h3>
                  <p className="text-sm text-gray-900">
                    {formatDate(product.createdAt)}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="text-sm text-gray-900">
                    {formatDate(product.updatedAt)}
                  </p>
                </div>
              </div>

              {product.description && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                  <p className="text-gray-900">{product.description}</p>
                </div>
              )}
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
      {activeTab === 'variants' && (
        <ProductVariants
          variants={variants}
          loading={variantsLoading}
          onUpdate={(variantId, data) => {
            // Handle variant update
          }}
          onDelete={(variantId) => {
            // Handle variant delete
          }}
          onAdd={(data) => {
            // Handle variant add
          }}
        />
      )}

      {activeTab === 'overview' && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900">Product Overview</h3>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">SEO Title</h4>
                <p className="text-sm text-gray-900">{product.seoTitle || 'Not set'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">SEO Description</h4>
                <p className="text-sm text-gray-900">{product.seoDescription || 'Not set'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Tags</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
} 