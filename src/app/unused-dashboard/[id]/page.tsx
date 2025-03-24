import React from 'react';
import Link from 'next/link';
import { DashboardContainer } from '@/presentation/components/dashboard/DashboardContainer';

interface DashboardPageProps {
  params: {
    id: string;
  };
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const { id } = params;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">ID: {id}</p>
        </div>
        
        <div className="flex space-x-3">
          <button className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md shadow-sm">
            Edit
          </button>
          <button className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md shadow-sm">
            Share
          </button>
          <select 
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 shadow-sm"
            defaultValue="7d"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="custom">Custom Range</option>
          </select>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm">
            Add Widget
          </button>
        </div>
      </div>
      
      {/* This would fetch data based on the dashboard ID in a real implementation */}
      <DashboardContainer dashboardId={id} />
    </div>
  );
}
