import React from 'react';
import { CopilotOrgUsage } from '@/domain/entities/github/CopilotUsage';

interface CopilotUsageOverviewProps {
  data: CopilotOrgUsage;
  metrics: any;
  type: 'organization' | 'team';
}

export const CopilotUsageOverview: React.FC<CopilotUsageOverviewProps> = ({ 
  data, 
  metrics,
  type 
}) => {
  const entityLabel = type === 'organization' ? 'Organization' : 'Team';
  const memberLabel = type === 'organization' ? 'Users' : 'Members';
  
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };
  
  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };
  
  const formatDateRange = () => {
    const start = new Date(data.start_time);
    const end = new Date(data.end_time);
    return `${start.toLocaleDateString()} to ${end.toLocaleDateString()}`;
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {type === 'organization' ? data.org : data.team_name} - GitHub Copilot Summary
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatDateRange()}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total {memberLabel}</div>
            <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(data.aggregated.total_users)}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Active {memberLabel}</div>
            <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(data.aggregated.active_users)}
            </div>
            <div className="mt-1 text-sm text-green-500">
              {formatPercentage(metrics.usageRate)} of total
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Suggestions</div>
            <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(data.aggregated.suggestions.shown)}
            </div>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {formatNumber(Math.round(metrics.suggestionsPerActiveUser))} per active user
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Acceptance Rate</div>
            <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {formatPercentage(metrics.acceptanceRate)}
            </div>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {formatNumber(data.aggregated.suggestions.accepted)} accepted
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Most Active Repositories
            </h3>
          </div>
          <div className="p-6">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Repository</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Suggestions</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Accepted</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {metrics.mostActiveRepositories.map((repo: any) => (
                  <tr key={repo.repository_id}>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{repo.repository_name}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white text-right">{formatNumber(repo.suggestions.shown)}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white text-right">{formatNumber(repo.suggestions.accepted)}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white text-right">
                      {formatPercentage((repo.suggestions.accepted / repo.suggestions.shown) * 100)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Most Active Users
            </h3>
          </div>
          <div className="p-6">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Suggestions</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Accepted</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {metrics.mostActiveUsers.map((user: any) => (
                  <tr key={user.user_id}>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{user.user_login}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white text-right">{formatNumber(user.suggestions.shown)}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white text-right">{formatNumber(user.suggestions.accepted)}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white text-right">
                      {formatPercentage((user.suggestions.accepted / user.suggestions.shown) * 100)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopilotUsageOverview;
