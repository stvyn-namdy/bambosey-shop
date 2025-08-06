import { useState } from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import { Search, UserPlus, Download } from 'lucide-react';
import Button from '@/components/admin/ui/Button';
import CustomerTable from '@/components/admin/customers/CustomerTable';
import { debounce } from '@/utils/helpers';

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '30d',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
  });

  const { data, isLoading, error } = useCustomers({
    search,
    ...filters,
    page: pagination.page,
    limit: pagination.limit,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer base</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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

      {/* Customers Table */}
      <CustomerTable
        customers={data || []}
        loading={isLoading}
        error={error}
        pagination={{
          ...pagination,
          total: data?.length || 0,
          totalPages: Math.ceil((data?.length || 0) / pagination.limit),
        }}
        onPaginationChange={setPagination}
      />
    </div>
  );
}