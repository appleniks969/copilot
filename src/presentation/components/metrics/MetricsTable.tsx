import React from 'react';

// Mock data for metrics table
const mockMetricsData = [
  {
    id: '1',
    key: 'api_calls',
    name: 'API Calls',
    type: 'count',
    period: 'daily',
    currentValue: 2400000,
    trend: 'up',
    changePercentage: 12.5,
    lastUpdated: '2023-01-07T12:34:56Z',
    owner: 'api-team'
  },
  {
    id: '2',
    key: 'response_time',
    name: 'Average Response Time',
    type: 'duration',
    period: 'hourly',
    currentValue: 245,
    trend: 'down',
    changePercentage: -8.3,
    lastUpdated: '2023-01-07T13:12:45Z',
    owner: 'api-team'
  },
  {
    id: '3',
    key: 'error_rate',
    name: 'Error Rate',
    type: 'percentage',
    period: 'daily',
    currentValue: 0.07,
    trend: 'up',
    changePercentage: 0.2,
    lastUpdated: '2023-01-07T12:56:30Z',
    owner: 'api-team'
  },
  {
    id: '4',
    key: 'active_users',
    name: 'Active Users',
    type: 'count',
    period: 'daily',
    currentValue: 45800,
    trend: 'up',
    changePercentage: 5.2,
    lastUpdated: '2023-01-07T14:22:15Z',
    owner: 'user-team'
  },
  {
    id: '5',
    key: 'cpu_usage',
    name: 'CPU Usage',
    type: 'percentage',
    period: 'hourly',
    currentValue: 62,
    trend: 'stable',
    changePercentage: 0.5,
    lastUpdated: '2023-01-07T14:45:10Z',
    owner: 'infra-team'
  },
  {
    id: '6',
    key: 'memory_usage',
    name: 'Memory Usage',
    type: 'percentage',
    period: 'hourly',
    currentValue: 78,
    trend: 'up',
    changePercentage: 3.1,
    lastUpdated: '2023-01-07T14:45:22Z',
    owner: 'infra-team'
  },
  {
    id: '7',
    key: 'storage_usage',
    name: 'Storage Usage',
    type: 'percentage',
    period: 'daily',
    currentValue: 45,
    trend: 'up',
    changePercentage: 2.3,
    lastUpdated: '2023-01-07T10:12:18Z',
    owner: 'infra-team'
  },
  {
    id: '8',
    key: 'network_throughput',
    name: 'Network Throughput',
    type: 'count',
    period: 'hourly',
    currentValue: 1250,
    trend: 'down',
    changePercentage: -4.8,
    lastUpdated: '2023-01-07T14:48:33Z',
    owner: 'infra-team'
  },
  {
    id: '9',
    key: 'conversion_rate',
    name: 'Conversion Rate',
    type: 'percentage',
    period: 'daily',
    currentValue: 3.2,
    trend: 'up',
    changePercentage: 0.3,
    lastUpdated: '2023-01-07T13:34:20Z',
    owner: 'marketing-team'
  },
  {
    id: '10',
    key: 'average_session_duration',
    name: 'Avg Session Duration',
    type: 'duration',
    period: 'daily',
    currentValue: 320,
    trend: 'up',
    changePercentage: 2.8,
    lastUpdated: '2023-01-07T13:55:42Z',
    owner: 'user-team'
  }
];

const MetricsTable: React.FC = () => {
  // Format value based on metric type
  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'percentage':
        return `${(value * 100).toFixed(2)}%`;
      case 'duration':
        return `${value}ms`;
      case 'count':
        return value.toLocaleString();
      default:
        return value.toString();
    }
  };
  
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Get trend icon and color
  const getTrendElement = (trend: string, changePercentage: number) => {
    let icon;
    let colorClass;
    
    if (trend === 'up') {
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
        </svg>
      );
      colorClass = 'text-green-500';
    } else if (trend === 'down') {
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
        </svg>
      );
      colorClass = 'text-red-500';
    } else {
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a1 1 0 01-1 1H3a1 1 0 110-2h14a1 1 0 011 1z" clipRule="evenodd" />
        </svg>
      );
      colorClass = 'text-gray-500';
    }
    
    return (
      <div className={`flex items-center ${colorClass}`}>
        {icon}
        <span className="ml-1">{Math.abs(changePercentage).toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-medium text-gray-900 dark:text-white">All Metrics</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">10 metrics</span>
          <div className="border-l border-gray-300 dark:border-gray-600 h-6 mx-2"></div>
          <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg>
          </button>
          <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Key
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Period
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Current Value
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Trend
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last Updated
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Owner
              </th>
              <th scope="col" className="px-4 py-3 relative">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {mockMetricsData.map((metric) => (
              <tr key={metric.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {metric.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {metric.key}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    {metric.type}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {metric.period}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatValue(metric.currentValue, metric.type)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {getTrendElement(metric.trend, metric.changePercentage)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(metric.lastUpdated)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {metric.owner}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">View</button>
                  <span className="mx-1 text-gray-300 dark:text-gray-600">|</span>
                  <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900 text-sm text-gray-500 dark:text-gray-400">
        <div>
          Showing <span className="font-medium text-gray-900 dark:text-white">1-10</span> of <span className="font-medium text-gray-900 dark:text-white">10</span> metrics
        </div>
        <div className="flex space-x-1">
          <button className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300" disabled>
            Previous
          </button>
          <button className="px-3 py-1 rounded bg-indigo-600 text-white">
            1
          </button>
          <button className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetricsTable;
