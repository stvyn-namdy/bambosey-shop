import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const SalesChart = ({ data, loading, dateRange }) => {
  const chartOptions = useMemo(() => ({
    chart: {
      height: 350,
      type: 'area',
      fontFamily: 'Inter, sans-serif',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: 0,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    colors: ['#0ea5e9', '#10b981'],
    xaxis: {
      type: 'datetime',
      categories: data?.dates || [],
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px',
        },
        formatter: (value) => `$${value.toLocaleString()}`,
      },
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy',
      },
      y: {
        formatter: (value) => `$${value.toLocaleString()}`,
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
    },
  }), [data]);

  const series = useMemo(() => [
    {
      name: 'Revenue',
      data: data?.revenue || [],
    },
    {
      name: 'Orders Value',
      data: data?.ordersValue || [],
    },
  ], [data]);

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Sales Overview</h3>
          <div className="text-sm text-gray-500">
            Last {dateRange === '7d' ? '7 days' : dateRange === '30d' ? '30 days' : dateRange === '90d' ? '90 days' : 'year'}
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <Chart
            options={chartOptions}
            series={series}
            type="area"
            height={350}
          />
        )}
      </Card.Content>
    </Card>
  );
};

export default SalesChart;