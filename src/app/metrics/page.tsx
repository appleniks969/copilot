import React from 'react';
import MetricsTable from '@/presentation/components/metrics/MetricsTable';
import MetricsFilterPanel from '@/presentation/components/metrics/MetricsFilterPanel';

export default function MetricsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Metrics</h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm">
          Create Metric
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4">
          <MetricsFilterPanel />
        </div>
        
        <div className="lg:w-3/4">
          <MetricsTable />
        </div>
      </div>
    </div>
  );
}
