import React from 'react';

interface StatusData {
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  uptime: string;
}

interface StatusCardProps {
  title: string;
  data: StatusData[];
}

const StatusCard: React.FC<StatusCardProps> = ({ title, data }) => {
  const getStatusIcon = (status: StatusData['status']) => {
    switch (status) {
      case 'healthy':
        return (
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
        );
      case 'warning':
        return (
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
        );
      case 'critical':
        return (
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
        );
      default:
        return (
          <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span className="mr-2">Last updated: 2 minutes ago</span>
          <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {data.map((item, index) => (
          <div 
            key={index}
            className="px-4 py-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div className="flex items-center">
              {getStatusIcon(item.status)}
              <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">
                Uptime: {item.uptime}
              </span>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                item.status === 'healthy' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                  : item.status === 'warning'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                  : item.status === 'critical'
                  ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {data.filter(item => item.status === 'healthy').length} of {data.length} services healthy
          </span>
          <a href="#" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
            View details
          </a>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
