import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const BarChart = ({ data, options = {}, height = 350, ...props }) => {
  const defaultOptions = useMemo(() => ({
    chart: {
      height,
      type: 'bar',
      fontFamily: 'Inter, sans-serif',
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    plotOptions: {
      bar: {
        columnWidth: '60%',
        borderRadius: 4,
      },
    },
    grid: {
      show: true,
      strokeDashArray: 4,
    },
    xaxis: {
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
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
    },
    ...options,
  }), [height, options]);

  return (
    <Chart
      options={defaultOptions}
      series={data}
      type="bar"
      height={height}
      {...props}
    />
  );
};

export default BarChart;