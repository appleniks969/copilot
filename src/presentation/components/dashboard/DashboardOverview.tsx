import React from 'react';
import LineChartWidget from './widgets/LineChartWidget';
import BarChartWidget from './widgets/BarChartWidget';
import GaugeWidget from './widgets/GaugeWidget';
import TableWidget from './widgets/TableWidget';

export const DashboardOverview: React.FC = () => {
  // This would come from our application services in a real app
  const apiResponseTimeData = [
    { date: '2023-01-01', value: 280 },
    { date: '2023-01-02', value: 250 },
    { date: '2023-01-03', value: 310 },
    { date: '2023-01-04', value: 290 },
    { date: '2023-01-05', value: 260 },
    { date: '2023-01-06', value: 245 },
    { date: '2023-01-07', value: 240 },
  ];

  const userSignupsData = [
    { date: 'Mon', value: 120 },
    { date: 'Tue', value: 180 },
    { date: 'Wed', value: 200 },
    { date: 'Thu', value: 250 },
    { date: 'Fri', value: 280 },
    { date: 'Sat', value: 220 },
    { date: 'Sun', value: 190 },
  ];

  const errorRateGaugeData = {
    value: 0.07,
    min: 0,
    max: 1,
    thresholds: [
      { value: 0.05, color: 'green' },
      { value: 0.1, color: 'yellow' },
      { value: 0.2, color: 'red' },
    ]
  };

  const apiEndpointPerformanceData = [
    { endpoint: '/api/users', calls: 45280, avgResponseTime: '127ms', errorRate: '0.02%', p95: '215ms' },
    { endpoint: '/api/products', calls: 38156, avgResponseTime: '165ms', errorRate: '0.05%', p95: '320ms' },
    { endpoint: '/api/orders', calls: 27893, avgResponseTime: '210ms', errorRate: '0.09%', p95: '450ms' },
    { endpoint: '/api/checkout', calls: 12467, avgResponseTime: '310ms', errorRate: '0.15%', p95: '580ms' },
    { endpoint: '/api/auth', calls: 54390, avgResponseTime: '95ms', errorRate: '0.03%', p95: '180ms' },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <LineChartWidget
          title="API Response Time (ms)"
          data={apiResponseTimeData}
          xKey="date"
          yKey="value"
          color="#4f46e5"
        />
      </div>
      <div>
        <BarChartWidget
          title="User Signups by Day"
          data={userSignupsData}
          xKey="date"
          yKey="value"
          color="#10b981"
        />
      </div>
      <div>
        <GaugeWidget
          title="Error Rate"
          data={errorRateGaugeData}
          format={(value) => `${(value * 100).toFixed(2)}%`}
        />
      </div>
      <div className="lg:col-span-2">
        <TableWidget
          title="API Endpoint Performance"
          data={apiEndpointPerformanceData}
          columns={[
            { key: 'endpoint', label: 'Endpoint' },
            { key: 'calls', label: 'Total Calls' },
            { key: 'avgResponseTime', label: 'Avg. Response' },
            { key: 'errorRate', label: 'Error Rate' },
            { key: 'p95', label: 'P95 Latency' },
          ]}
        />
      </div>
    </div>
  );
};
