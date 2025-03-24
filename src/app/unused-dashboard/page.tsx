import React from 'react';
import Link from 'next/link';

export default function DashboardsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboards</h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm">
          Create Dashboard
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard Cards - These would come from the API in a real implementation */}
        <DashboardCard 
          id="1"
          title="API Performance"
          description="Monitor API performance and health metrics"
          widgetCount={3}
          lastUpdated="2 hours ago"
        />
        <DashboardCard 
          id="2"
          title="Infrastructure Health"
          description="System infrastructure metrics including CPU, memory, and storage"
          widgetCount={4}
          lastUpdated="1 hour ago"
        />
        <DashboardCard 
          id="3"
          title="User Engagement"
          description="Track user activity, sessions, and conversion metrics"
          widgetCount={3}
          lastUpdated="30 minutes ago"
        />
        
        {/* Create New Dashboard Card */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <p className="text-center font-medium">Create New Dashboard</p>
        </div>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  id: string;
  title: string;
  description: string;
  widgetCount: number;
  lastUpdated: string;
}

function DashboardCard({ id, title, description, widgetCount, lastUpdated }: DashboardCardProps) {
  return (
    <Link 
      href={`/dashboard/${id}`}
      className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-3 bg-indigo-600"></div>
      <div className="p-6">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{description}</p>
        <div className="mt-4 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>{widgetCount} widgets</span>
          <span>Updated {lastUpdated}</span>
        </div>
      </div>
    </Link>
  );
}
