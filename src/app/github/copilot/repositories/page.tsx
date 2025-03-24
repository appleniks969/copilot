'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CopilotRepositoryStats } from '@/domain/entities/github/CopilotUsage';
import CopilotSelector from '@/presentation/components/github/copilot/CopilotSelector';
import DateRangePicker from '@/presentation/components/github/copilot/DateRangePicker';

export default function CopilotRepositoriesPage() {
  // State for org/team selection
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(undefined);
  const [viewType, setViewType] = useState<'organization' | 'team'>('organization');
  
  // State for date range
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date()
  });
  
  // State for repository data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<CopilotRepositoryStats[]>([]);
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedOrg && viewType === 'organization') return;
      if (!selectedTeamId && viewType === 'team') return;
      
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams({
          start_time: dateRange.startDate.toISOString(),
          end_time: dateRange.endDate.toISOString()
        });
        
        const endpoint = viewType === 'organization'
          ? `/api/github/copilot/org/${selectedOrg}?${params.toString()}`
          : `/api/github/copilot/team/${selectedTeamId}?${params.toString()}`;
        
        const response = await fetch(endpoint);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch data');
        }
        
        // Set repository data
        setRepositories(data.usageData.aggregated.repositories || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedOrg, selectedTeamId, viewType, dateRange]);
  
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
  
  // Calculate repository analytics
  const calculateRepoAnalytics = () => {
    if (repositories.length === 0) return null;
    
    const totalSuggestions = repositories.reduce((sum, repo) => sum + repo.suggestions.shown, 0);
    const totalAccepted = repositories.reduce((sum, repo) => sum + repo.suggestions.accepted, 0);
    const totalUsers = repositories.reduce((sum, repo) => sum + repo.active_users, 0);
    
    // Find repositories with highest and lowest acceptance rates
    const sortedByAcceptance = [...repositories]
      .filter(repo => repo.suggestions.shown > 100) // Filter out repos with low sample size
      .sort((a, b) => {
        const aRate = a.suggestions.accepted / a.suggestions.shown;
        const bRate = b.suggestions.accepted / b.suggestions.shown;
        return bRate - aRate;
      });
    
    const highestAcceptance = sortedByAcceptance.length > 0 ? sortedByAcceptance[0] : null;
    const lowestAcceptance = sortedByAcceptance.length > 1 ? sortedByAcceptance[sortedByAcceptance.length - 1] : null;
    
    return {
      totalSuggestions,
      totalAccepted,
      totalUsers,
      averageAcceptanceRate: totalSuggestions > 0 ? (totalAccepted / totalSuggestions) * 100 : 0,
      repoCount: repositories.length,
      highestAcceptance,
      lowestAcceptance
    };
  };
  
  const analytics = calculateRepoAnalytics();
  
  // Format numbers
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };
  
  // Format percentages
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };
  
  // Calculate acceptance rate
  const getAcceptanceRate = (repo: CopilotRepositoryStats) => {
    if (repo.suggestions.shown === 0) return 0;
    return (repo.suggestions.accepted / repo.suggestions.shown) * 100;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Repository Copilot Usage</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track GitHub Copilot usage across repositories
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/github/copilot"
            className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md shadow-sm"
          >
            Back to Dashboard
          </Link>
        </div>
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
          <p className="mt-2 text-gray-500 dark:text-gray-400">Loading repository data...</p>
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
        </div>
      )}
      
      {!loading && !error && analytics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">Repositories</div>
              <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.repoCount}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">Active Users</div>
              <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(analytics.totalUsers)}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Suggestions</div>
              <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(analytics.totalSuggestions)}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">Avg Acceptance Rate</div>
              <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {formatPercentage(analytics.averageAcceptanceRate)}
              </div>
            </div>
          </div>
          
          {analytics.highestAcceptance && analytics.lowestAcceptance && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Highest Acceptance Rate
                </h3>
                <div className="flex items-center">
                  <div className="h-12 w-12 flex-shrink-0 rounded-md bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {analytics.highestAcceptance.repository_name}
                    </div>
                    <div className="mt-1 flex items-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatPercentage(getAcceptanceRate(analytics.highestAcceptance))}
                      </div>
                      <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        acceptance rate
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {formatNumber(analytics.highestAcceptance.suggestions.accepted)} of {formatNumber(analytics.highestAcceptance.suggestions.shown)} suggestions accepted
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Lowest Acceptance Rate
                </h3>
                <div className="flex items-center">
                  <div className="h-12 w-12 flex-shrink-0 rounded-md bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-600 dark:text-red-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {analytics.lowestAcceptance.repository_name}
                    </div>
                    <div className="mt-1 flex items-center">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {formatPercentage(getAcceptanceRate(analytics.lowestAcceptance))}
                      </div>
                      <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        acceptance rate
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {formatNumber(analytics.lowestAcceptance.suggestions.accepted)} of {formatNumber(analytics.lowestAcceptance.suggestions.shown)} suggestions accepted
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                Repository Usage
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {repositories.length} repositories
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Repository
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Active Users
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Shown
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Accepted
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Acceptance Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {repositories.length > 0 ? (
                    repositories
                      .sort((a, b) => b.suggestions.shown - a.suggestions.shown)
                      .map((repo) => (
                        <tr key={repo.repository_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 rounded-md bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {repo.repository_name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  ID: {repo.repository_id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                            {repo.active_users}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                            {formatNumber(repo.suggestions.shown)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                            {formatNumber(repo.suggestions.accepted)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end">
                              <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    getAcceptanceRate(repo) >= 70 ? 'bg-green-500' :
                                    getAcceptanceRate(repo) >= 50 ? 'bg-indigo-500' :
                                    getAcceptanceRate(repo) >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${Math.min(100, getAcceptanceRate(repo))}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-900 dark:text-white">
                                {formatPercentage(getAcceptanceRate(repo))}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No repository data available. Please select an organization or team.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
