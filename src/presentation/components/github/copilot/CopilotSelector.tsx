'use client';

import React, { useEffect, useState } from 'react';

interface Team {
  id: string;
  slug: string;
  name: string;
}

interface CopilotSelectorProps {
  onTeamChange: (teamSlug: string) => void;
  selectedTeamSlug?: string;
}

export const CopilotSelector: React.FC<CopilotSelectorProps> = ({
  onTeamChange,
  selectedTeamSlug
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const organization = process.env.NEXT_PUBLIC_GITHUB_ORGANIZATION || 'Your Organization';
  
  // Fetch teams on component mount
  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/github/teams');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch teams');
        }
        
        const data = await response.json();
        setTeams(data.teams || []);
        
        // Auto-select first team if none is selected
        if (!selectedTeamSlug && data.teams && data.teams.length > 0) {
          onTeamChange(data.teams[0].slug);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeams();
  }, []);
  
  // Handle team change
  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTeamChange(e.target.value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full">
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="org-display" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Organization
            </label>
            {error && (
              <span className="text-xs text-red-500">{error}</span>
            )}
          </div>
          
          <div id="org-display" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-200">
            {organization}
          </div>
        </div>
        
        <div className="w-full">
          <label htmlFor="team-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Team
          </label>
          <select
            id="team-select"
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedTeamSlug}
            onChange={handleTeamChange}
            disabled={loading || teams.length === 0}
          >
            {teams.length === 0 ? (
              <option value="">No teams found</option>
            ) : (
              teams.map(team => (
                <option key={team.id} value={team.slug}>
                  {team.name}
                </option>
              ))
            )}
          </select>
        </div>
      </div>
      
      {loading && (
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading teams...
        </div>
      )}
    </div>
  );
};

export default CopilotSelector;
