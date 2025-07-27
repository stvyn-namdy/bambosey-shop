import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { productService } from '../../services';
import { Plus, Search, Filter } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ProductTable from '../../components/products/ProductTable';
import { debounce } from '../../utils/helpers';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    inStock: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
  });

  const { data, isLoading, error } = useQuery(
    ['products', search, filters, pagination],
    () => productService.getProducts({
      search,
      ...filters,
      page: pagination.page,
      limit: pagination.limit,
    }),
    {
      keepPreviousData: true,
    }
  );

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Link href="/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              onChange={handleSearchChange}
            />
          </div>
          
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">All Categories</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="shoes">Shoes</option>
          </select>
          
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          
          <select
            value={filters.inStock}
            onChange={(e) => handleFilterChange('inStock', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">All Stock</option>
            <option value="true">In Stock</option>
            <option value="false">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <ProductTable
        products={data?.products || []}
        loading={isLoading}
        error={error}
        pagination={{
          ...pagination,
          total: data?.total || 0,
          totalPages: data?.totalPages || 0,
        }}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
