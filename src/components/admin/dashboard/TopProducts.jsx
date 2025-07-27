import { formatNumber } from '@/utils/helpers';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';

const TopProducts = ({ products, loading }) => {
  if (loading) {
    return (
      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
        </Card.Header>
        <Card.Content>
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
      </Card.Header>
      <Card.Content className="p-0">
        {products && products.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {products.map((product, index) => (
              <div key={product.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-600">
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span>{formatNumber(product.sold)} sold</span>
                      <span className="mx-2">•</span>
                      <span>${product.revenue?.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(product.sold / products[0]?.sold) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No product data available</p>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default TopProducts;