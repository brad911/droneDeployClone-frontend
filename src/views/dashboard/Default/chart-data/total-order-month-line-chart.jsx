// ==============================|| DASHBOARD - TOTAL ORDER MONTH CHART ||============================== //

const chartData = {
  type: 'line',
  height: 90,
  options: {
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#fff'],
    fill: {
      type: 'solid',
      opacity: 1,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        show: false,
      },
    },
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: (seriesName) => 'Total Order',
        },
      },
      marker: {
        show: false,
      },
    },
  },
  series: [
    {
      name: 'series1',
      data: [45, 66, 41, 89, 25, 44, 9, 54],
    },
  ],
};

export default chartData;
