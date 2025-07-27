import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/helpers';
import Card from '../ui/Card';

const StatsCard = ({ title, value, change, icon: Icon, format = 'number' }) => {
  const formatValue = (val) => {
    switch (format) {
      case 'currency':
        return formatCurrency(val);
      case 'number':
        return formatNumber(val);
      default:
        return val;
    }
  };

  const isPositive = change >= 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatValue(value)}
          </p>
          <div className="flex items-center mt-2">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {Math.abs(change).toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>
        <div className="p-3 bg-primary-50 rounded-lg">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;