'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CopilotUser, CopilotUserStats } from '@/domain/entities/github/CopilotUsage';
import CopilotSelector from '@/presentation/components/github/copilot/CopilotSelector';
import DateRangePicker from '@/presentation/components/github/copilot/DateRangePicker';

export default function CopilotUsersPage() {
  // State for team selection
  const [selectedTeamSlug, setSelectedTeamSlug] = useState<string>(
    process.env.NEXT_PUBLIC_GITHUB_DEFAULT_TEAM_SLUG || ''
  );
  
  // State for date range
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date()
  });
  
  // State for user data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<CopilotUser[]>([]);
  const [inactiveUsers, setInactiveUsers] = useState<CopilotUser[]>([]);
  const [userStats, setUserStats] = useState<CopilotUserStats[]>([]);
  
  // Fetch data
  useEffect(() => {
    if (!selectedTeamSlug) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams({
          start_time: dateRange.startDate.toISOString(),
          end_time: dateRange.endDate.toISOString()
        });
        
        const response = await fetch(`/api/github/copilot/team/${selectedTeamSlug}?${params.toString()}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch data');
        }
        
        const data = await response.json();
        
        // Set active users
        setActiveUsers(data.usageData.active_members || []);
        setInactiveUsers(data.usageData.inactive_members || []);
        setUserStats(data.usageData.users || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedTeamSlug, dateRange]);
  
  // Handle team change
  const handleTeamChange = (teamSlug: string) => {
    setSelectedTeamSlug(teamSlug);
  };
  
  // Handle date range change
  const handleDateRangeChange = (range: { startDate: Date; endDate: Date }) => {
    setDateRange(range);
  };
  
  // Format time since last activity
  const formatTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
    
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (diffHours > 0) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  };
  
  // Calculate total row count
  const totalRows = activeUsers.length + inactiveUsers.length;
  
  // Calculate acceptance rates for users
  const getUserAcceptanceRate = (user: CopilotUserStats) => {
    if (!user.suggestions || user.suggestions.shown === 0) return 0;
    return (user.suggestions.accepted / user.suggestions.shown) * 100;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">GitHub Copilot Users</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View user activity and adoption across your team
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
          onTeamChange={handleTeamChange}
          selectedTeamSlug={selectedTeamSlug}
        />
        
        <DateRangePicker
          dateRange={dateRange}
          onChange={handleDateRangeChange}
        />
      </div>
      
      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <div className="flex justify-center">
            <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Loading user data...</p>
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
      
      {!loading && !error && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                User Activity
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {totalRows} users
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Last Activity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Editor
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Suggestions
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Acceptance Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {/* Active users first */}
                  {activeUsers.map((user) => {
                    // Find the stats for this user
                    const userStat = userStats.find(stat => stat.user_id === user.id);
                    const suggestions = userStat?.suggestions?.shown || 0;
                    const acceptanceRate = userStat ? getUserAcceptanceRate(userStat) : 0;
                    
                    return (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                              {(user.login || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.name || user.login}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                @{user.login}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.active
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {user.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatTimeSince(user.last_activity_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.last_activity_editor || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                          {suggestions.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end">
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-indigo-600 h-2.5 rounded-full" 
                                style={{ width: `${Math.min(100, acceptanceRate)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900 dark:text-white">
                              {acceptanceRate.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  
                  {/* Inactive users next */}
                  {inactiveUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 bg-gray-50 dark:bg-gray-900">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                            {(user.login || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name || user.login}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              @{user.login}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Inactive
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatTimeSince(user.last_activity_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.last_activity_editor || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                        0
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                            <div className="bg-gray-400 h-2.5 rounded-full w-0"></div>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            0.0%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {activeUsers.length === 0 && inactiveUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No user data available. Please select a team.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Most Active Users
                </h3>
              </div>
              <div className="p-6">
                {userStats.length > 0 ? (
                  <div className="space-y-4">
                    {userStats
                      .sort((a, b) => (b.suggestions?.shown || 0) - (a.suggestions?.shown || 0))
                      .slice(0, 5)
                      .map((user, index) => (
                        <div key={user.user_id} className="flex items-center">
                          <div className="w-8 text-center text-gray-500 dark:text-gray-400">
                            {index + 1}
                          </div>
                          <div className="h-8 w-8 flex-shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 ml-2">
                            {user.user_login.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              @{user.user_login}
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                              <div 
                                className="bg-indigo-600 h-1.5 rounded-full" 
                                style={{ 
                                  width: `${Math.min(100, (user.suggestions?.shown || 0) / (userStats[0].suggestions?.shown || 1) * 100)}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                            {(user.suggestions?.shown || 0).toLocaleString()}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No data available
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Highest Acceptance Rates
                </h3>
              </div>
              <div className="p-6">
                {userStats.length > 0 ? (
                  <div className="space-y-4">
                    {userStats
                      .filter(user => (user.suggestions?.shown || 0) > 50) // Only consider users with a significant number of suggestions
                      .sort((a, b) => {
                        const aRate = (a.suggestions?.accepted || 0) / (a.suggestions?.shown || 1);
                        const bRate = (b.suggestions?.accepted || 0) / (b.suggestions?.shown || 1);
                        return bRate - aRate;
                      })
                      .slice(0, 5)
                      .map((user, index) => {
                        const acceptanceRate = (user.suggestions?.accepted || 0) / (user.suggestions?.shown || 1) * 100;
                        
                        return (
                          <div key={user.user_id} className="flex items-center">
                            <div className="w-8 text-center text-gray-500 dark:text-gray-400">
                              {index + 1}
                            </div>
                            <div className="h-8 w-8 flex-shrink-0 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-300 ml-2">
                              {user.user_login.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                @{user.user_login}
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                                <div 
                                  className="bg-green-500 h-1.5 rounded-full" 
                                  style={{ width: `${Math.min(100, acceptanceRate)}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                              {acceptanceRate.toFixed(1)}%
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
