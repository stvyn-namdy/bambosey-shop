import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const AreaChart = ({ data, options = {}, height = 350, ...props }) => {
  const defaultOptions = useMemo(() => ({
    chart: {
      height,
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
      width: 2,
    },
    grid: {
      show: true,
      strokeDashArray: 4,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
      },
    },
    colors: ['#0ea5e9'],
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
    ...options,
  }), [height, options]);

  return (
    <Chart
      options={defaultOptions}
      series={data}
      type="area"
      height={height}
      {...props}
    />
  );
};

export default AreaChart;