import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const LineChart = ({ data, options = {}, height = 350, ...props }) => {
  const defaultOptions = useMemo(() => ({
    chart: {
      height,
      type: 'line',
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
    },
    colors: ['#0ea5e9', '#10b981', '#f59e0b'],
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
      type="line"
      height={height}
      {...props}
    />
  );
};

export default LineChart;