'use client';

import React, { useState, useEffect } from 'react';
import { CopilotOrgUsage, CopilotTeamUsage } from '@/domain/entities/github/CopilotUsage';
import CopilotSelector from '@/presentation/components/github/copilot/CopilotSelector';
import DateRangePicker from '@/presentation/components/github/copilot/DateRangePicker';
import CopilotUsageOverview from '@/presentation/components/github/copilot/CopilotUsageOverview';
import CopilotMetricsCharts from '@/presentation/components/github/copilot/CopilotMetricsCharts';
import CopilotUserActivity from '@/presentation/components/github/copilot/CopilotUserActivity';

export default function CopilotDashboardPage() {
  // State for org/team selection
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(undefined);
  const [viewType, setViewType] = useState<'organization' | 'team'>('organization');
  
  // State for date range
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date()
  });
  
  // State for data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orgData, setOrgData] = useState<CopilotOrgUsage | null>(null);
  const [teamData, setTeamData] = useState<CopilotTeamUsage | null>(null);
  const [metrics, setMetrics] = useState<any | null>(null);
  
  // Fetch organization data
  useEffect(() => {
    if (!selectedOrg) return;
    
    const fetchOrgData = async () => {
      if (viewType !== 'organization') return;
      
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams({
          start_time: dateRange.startDate.toISOString(),
          end_time: dateRange.endDate.toISOString()
        });
        
        const response = await fetch(`/api/github/copilot/org/${selectedOrg}?${params.toString()}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch organization data');
        }
        
        setOrgData(data.usageData);
        setMetrics(data.metrics);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching organization data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrgData();
  }, [selectedOrg, dateRange, viewType]);
  
  // Fetch team data
  useEffect(() => {
    if (!selectedTeamId) return;
    
    const fetchTeamData = async () => {
      if (viewType !== 'team') return;
      
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams({
          start_time: dateRange.startDate.toISOString(),
          end_time: dateRange.endDate.toISOString()
        });
        
        const response = await fetch(`/api/github/copilot/team/${selectedTeamId}?${params.toString()}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch team data');
        }
        
        setTeamData(data.usageData);
        setMetrics(data.metrics);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching team data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeamData();
  }, [selectedTeamId, dateRange, viewType]);

  // Handle org change
  const handleOrgChange = (org: string) => {
    setSelectedOrg(org);
    setViewType('organization');
  };
  
  // Handle team change
  const handleTeamChange = (teamId: number) => {
    setSelectedTeamId(teamId);
  };
  
  // Handle view type change
  const handleViewTypeChange = (type: 'organization' | 'team') => {
    setViewType(type);
  };
  
  // Handle date range change
  const handleDateRangeChange = (range: { startDate: Date; endDate: Date }) => {
    setDateRange(range);
  };
  
  // Determine which data to use based on view type
  const currentData = viewType === 'organization' ? orgData : teamData;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">GitHub Copilot Usage Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CopilotSelector
          onOrgChange={handleOrgChange}
          onTeamChange={handleTeamChange}
          selectedOrg={selectedOrg}
          selectedTeamId={selectedTeamId}
        />
        
        <DateRangePicker
          dateRange={dateRange}
          onChange={handleDateRangeChange}
        />
      </div>
      
      <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow p-2">
        <button
          onClick={() => handleViewTypeChange('organization')}
          className={`flex-1 py-2 px-4 text-center text-sm font-medium rounded-md ${
            viewType === 'organization'
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
              : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          Organization View
        </button>
        <button
          onClick={() => handleViewTypeChange('team')}
          className={`flex-1 py-2 px-4 text-center text-sm font-medium rounded-md ${
            viewType === 'team'
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
              : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          disabled={!selectedTeamId}
        >
          Team View
        </button>
      </div>
      
      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <div className="flex justify-center">
            <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Loading Copilot usage data...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-lg font-medium">Error</h2>
          </div>
          <p className="mt-2 text-gray-700 dark:text-gray-300">{error}</p>
          <div className="mt-4">
            <button
              onClick={() => viewType === 'organization' ? handleOrgChange(selectedOrg) : handleTeamChange(selectedTeamId!)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      {!loading && !error && currentData && metrics && (
        <div className="space-y-6">
          <CopilotUsageOverview 
            data={currentData as any} 
            metrics={metrics} 
            type={viewType}
          />
          
          <CopilotMetricsCharts 
            data={currentData as any} 
            metrics={metrics}
          />
          
          <CopilotUserActivity
            activeUsers={currentData.active_users || currentData.active_members}
            inactiveUsers={currentData.inactive_users || currentData.inactive_members}
            type={viewType}
          />
        </div>
      )}
    </div>
  );
}
