import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const PieChart = ({ data, options = {}, height = 350, ...props }) => {
  const defaultOptions = useMemo(() => ({
    chart: {
      height,
      type: 'pie',
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`,
    },
    legend: {
      show: true,
      position: 'bottom',
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    ...options,
  }), [height, options]);

  return (
    <Chart
      options={defaultOptions}
      series={data}
      type="pie"
      height={height}
      {...props}
    />
  );
};

export default PieChart;