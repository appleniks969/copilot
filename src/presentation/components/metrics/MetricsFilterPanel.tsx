import React from 'react';

const MetricsFilterPanel: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Filters</h3>
      
      <div className="space-y-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 pl-10 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search metrics..."
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Metric Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Metric Types
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="type-count"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="type-count" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Count
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="type-percentage"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="type-percentage" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Percentage
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="type-duration"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="type-duration" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Duration
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="type-monetary"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="type-monetary" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Monetary
              </label>
            </div>
          </div>
        </div>
        
        {/* Time Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Time Period
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="period-hourly"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="period-hourly" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Hourly
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="period-daily"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="period-daily" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Daily
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="period-weekly"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="period-weekly" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Weekly
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="period-monthly"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="period-monthly" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Monthly
              </label>
            </div>
          </div>
        </div>
        
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date Range
          </label>
          <div className="space-y-2">
            <div>
              <label htmlFor="from-date" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                From
              </label>
              <input
                type="date"
                id="from-date"
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="to-date" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                To
              </label>
              <input
                type="date"
                id="to-date"
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
        
        {/* Filter Actions */}
        <div className="pt-2 flex space-x-2">
          <button className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm">
            Apply Filters
          </button>
          <button className="w-1/2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-md text-sm">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetricsFilterPanel;
