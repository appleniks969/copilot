import React from 'react';
import LineChartWidget from './widgets/LineChartWidget';
import BarChartWidget from './widgets/BarChartWidget';
import GaugeWidget from './widgets/GaugeWidget';
import TableWidget from './widgets/TableWidget';
import StatusCard from './widgets/StatusCard';

interface DashboardContainerProps {
  dashboardId: string;
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({ dashboardId }) => {
  // In a real implementation, this would fetch the dashboard data from the API
  // For now, we'll use some sample data based on the dashboard ID
  
  // Different mock data based on dashboard ID
  const mockData = {
    // API Performance Dashboard
    '1': {
      title: 'API Performance',
      widgets: [
        {
          id: '1',
          type: 'lineChart',
          title: 'API Calls Over Time',
          data: [
            { date: '2023-01-01', value: 2100000 },
            { date: '2023-01-02', value: 2250000 },
            { date: '2023-01-03', value: 2320000 },
            { date: '2023-01-04', value: 2180000 },
            { date: '2023-01-05', value: 2290000 },
            { date: '2023-01-06', value: 2400000 },
            { date: '2023-01-07', value: 2150000 },
          ],
          position: { x: 0, y: 0, width: 8, height: 4 }
        },
        {
          id: '2',
          type: 'lineChart',
          title: 'Average Response Time (ms)',
          data: [
            { date: '2023-01-01', value: 265 },
            { date: '2023-01-02', value: 255 },
            { date: '2023-01-03', value: 290 },
            { date: '2023-01-04', value: 275 },
            { date: '2023-01-05', value: 260 },
            { date: '2023-01-06', value: 250 },
            { date: '2023-01-07', value: 245 },
          ],
          position: { x: 0, y: 4, width: 4, height: 4 }
        },
        {
          id: '3',
          type: 'gauge',
          title: 'Error Rate',
          data: {
            value: 0.07,
            min: 0,
            max: 0.5,
            thresholds: [
              { value: 0.05, color: 'green' },
              { value: 0.1, color: 'yellow' },
              { value: 0.2, color: 'red' },
            ]
          },
          position: { x: 4, y: 4, width: 4, height: 4 }
        },
        {
          id: '4',
          type: 'table',
          title: 'API Endpoint Performance',
          data: [
            { endpoint: '/api/users', calls: 45280, avgResponseTime: '127ms', errorRate: '0.02%', p95: '215ms' },
            { endpoint: '/api/products', calls: 38156, avgResponseTime: '165ms', errorRate: '0.05%', p95: '320ms' },
            { endpoint: '/api/orders', calls: 27893, avgResponseTime: '210ms', errorRate: '0.09%', p95: '450ms' },
            { endpoint: '/api/checkout', calls: 12467, avgResponseTime: '310ms', errorRate: '0.15%', p95: '580ms' },
            { endpoint: '/api/auth', calls: 54390, avgResponseTime: '95ms', errorRate: '0.03%', p95: '180ms' },
          ],
          columns: [
            { key: 'endpoint', label: 'Endpoint' },
            { key: 'calls', label: 'Total Calls' },
            { key: 'avgResponseTime', label: 'Avg. Response' },
            { key: 'errorRate', label: 'Error Rate' },
            { key: 'p95', label: 'P95 Latency' },
          ],
          position: { x: 0, y: 8, width: 8, height: 4 }
        }
      ]
    },
    // Infrastructure Health Dashboard
    '2': {
      title: 'Infrastructure Health',
      widgets: [
        {
          id: '1',
          type: 'gauge',
          title: 'CPU Usage',
          data: {
            value: 62,
            min: 0,
            max: 100,
            thresholds: [
              { value: 75, color: 'green' },
              { value: 90, color: 'yellow' },
              { value: 95, color: 'red' },
            ]
          },
          position: { x: 0, y: 0, width: 3, height: 3 }
        },
        {
          id: '2',
          type: 'gauge',
          title: 'Memory Usage',
          data: {
            value: 78,
            min: 0,
            max: 100,
            thresholds: [
              { value: 80, color: 'green' },
              { value: 90, color: 'yellow' },
              { value: 95, color: 'red' },
            ]
          },
          position: { x: 3, y: 0, width: 3, height: 3 }
        },
        {
          id: '3',
          type: 'gauge',
          title: 'Storage Usage',
          data: {
            value: 45,
            min: 0,
            max: 100,
            thresholds: [
              { value: 75, color: 'green' },
              { value: 90, color: 'yellow' },
              { value: 95, color: 'red' },
            ]
          },
          position: { x: 6, y: 0, width: 3, height: 3 }
        },
        {
          id: '4',
          type: 'lineChart',
          title: 'Network Throughput (Mbps)',
          data: [
            { date: '2023-01-01', value: 1150 },
            { date: '2023-01-02', value: 1220 },
            { date: '2023-01-03', value: 1340 },
            { date: '2023-01-04', value: 1190 },
            { date: '2023-01-05', value: 1280 },
            { date: '2023-01-06', value: 1250 },
            { date: '2023-01-07', value: 1190 },
          ],
          position: { x: 0, y: 3, width: 9, height: 4 }
        },
        {
          id: '5',
          type: 'statusCard',
          title: 'System Status',
          data: [
            { name: 'API Gateway', status: 'healthy', uptime: '99.99%' },
            { name: 'Auth Service', status: 'healthy', uptime: '99.95%' },
            { name: 'Database', status: 'healthy', uptime: '99.97%' },
            { name: 'Storage Service', status: 'warning', uptime: '99.87%' },
            { name: 'Cache Service', status: 'healthy', uptime: '99.99%' },
          ],
          position: { x: 0, y: 7, width: 9, height: 3 }
        }
      ]
    },
    // User Engagement Dashboard
    '3': {
      title: 'User Engagement',
      widgets: [
        {
          id: '1',
          type: 'lineChart',
          title: 'Active Users',
          data: [
            { date: '2023-01-01', value: 42500 },
            { date: '2023-01-02', value: 43200 },
            { date: '2023-01-03', value: 44100 },
            { date: '2023-01-04', value: 43800 },
            { date: '2023-01-05', value: 44600 },
            { date: '2023-01-06', value: 45200 },
            { date: '2023-01-07', value: 45800 },
          ],
          position: { x: 0, y: 0, width: 8, height: 4 }
        },
        {
          id: '2',
          type: 'lineChart',
          title: 'Conversion Rate (%)',
          data: [
            { date: '2023-01-01', value: 2.8 },
            { date: '2023-01-02', value: 2.9 },
            { date: '2023-01-03', value: 3.1 },
            { date: '2023-01-04', value: 3.0 },
            { date: '2023-01-05', value: 3.2 },
            { date: '2023-01-06', value: 3.1 },
            { date: '2023-01-07', value: 3.2 },
          ],
          position: { x: 0, y: 4, width: 4, height: 4 }
        },
        {
          id: '3',
          type: 'barChart',
          title: 'Avg Session Duration (sec)',
          data: [
            { date: 'Mon', value: 305 },
            { date: 'Tue', value: 315 },
            { date: 'Wed', value: 325 },
            { date: 'Thu', value: 310 },
            { date: 'Fri', value: 320 },
            { date: 'Sat', value: 300 },
            { date: 'Sun', value: 290 },
          ],
          position: { x: 4, y: 4, width: 4, height: 4 }
        }
      ]
    }
  };
  
  // Get dashboard data based on ID or show a default message
  const dashboard = mockData[dashboardId as keyof typeof mockData];
  
  if (!dashboard) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <h3 className="text-xl text-gray-700 dark:text-gray-300">Dashboard not found</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">The dashboard with ID {dashboardId} could not be found.</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="grid grid-cols-8 gap-4">
        {dashboard.widgets.map(widget => {
          // Calculate grid position
          const gridStyle = {
            gridColumn: `span ${widget.position.width}`,
            gridRow: `span ${widget.position.height}`,
          };
          
          return (
            <div key={widget.id} style={gridStyle}>
              {widget.type === 'lineChart' && (
                <LineChartWidget
                  title={widget.title}
                  data={widget.data}
                  xKey="date"
                  yKey="value"
                  color="#4f46e5"
                />
              )}
              {widget.type === 'barChart' && (
                <BarChartWidget
                  title={widget.title}
                  data={widget.data}
                  xKey="date"
                  yKey="value"
                  color="#10b981"
                />
              )}
              {widget.type === 'gauge' && (
                <GaugeWidget
                  title={widget.title}
                  data={widget.data}
                  format={(value) => 
                    widget.title.includes('Rate') ? 
                      `${(value * 100).toFixed(2)}%` : 
                      `${value.toFixed(1)}%`
                  }
                />
              )}
              {widget.type === 'table' && (
                <TableWidget
                  title={widget.title}
                  data={widget.data}
                  columns={widget.columns}
                />
              )}
              {widget.type === 'statusCard' && (
                <StatusCard
                  title={widget.title}
                  data={widget.data}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
