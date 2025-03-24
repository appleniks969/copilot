import React, { useEffect, useState } from 'react';

interface Organization {
  id: number;
  login: string;
}

interface Team {
  id: number;
  name: string;
}

interface CopilotSelectorProps {
  onOrgChange: (org: string) => void;
  onTeamChange: (teamId: number) => void;
  selectedOrg?: string;
  selectedTeamId?: number;
}

export const CopilotSelector: React.FC<CopilotSelectorProps> = ({
  onOrgChange,
  onTeamChange,
  selectedOrg,
  selectedTeamId
}) => {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Fetch organizations on component mount
  useEffect(() => {
    const fetchOrgs = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/github/orgs');
        const data = await response.json();
        setOrgs(data.organizations);
        
        // Auto-select first org if none is selected
        if (!selectedOrg && data.organizations.length > 0) {
          onOrgChange(data.organizations[0].login);
        }
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrgs();
  }, []);
  
  // Fetch teams when org changes
  useEffect(() => {
    if (!selectedOrg) return;
    
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/github/orgs/${selectedOrg}/teams`);
        const data = await response.json();
        setTeams(data.teams);
        
        // Auto-select first team if none is selected
        if (!selectedTeamId && data.teams.length > 0) {
          onTeamChange(data.teams[0].id);
        }
      } catch (error) {
        console.error(`Error fetching teams for org ${selectedOrg}:`, error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeams();
  }, [selectedOrg]);
  
  const handleOrgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onOrgChange(e.target.value);
  };
  
  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTeamChange(parseInt(e.target.value));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <label htmlFor="org-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Organization
          </label>
          <select
            id="org-select"
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedOrg}
            onChange={handleOrgChange}
            disabled={loading || orgs.length === 0}
          >
            {orgs.length === 0 ? (
              <option value="">No organizations found</option>
            ) : (
              orgs.map(org => (
                <option key={org.id} value={org.login}>
                  {org.login}
                </option>
              ))
            )}
          </select>
        </div>
        
        <div className="w-full md:w-1/2">
          <label htmlFor="team-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Team
          </label>
          <select
            id="team-select"
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedTeamId}
            onChange={handleTeamChange}
            disabled={loading || teams.length === 0 || !selectedOrg}
          >
            {teams.length === 0 ? (
              <option value="">No teams found</option>
            ) : (
              teams.map(team => (
                <option key={team.id} value={team.id}>
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
          Loading...
        </div>
      )}
    </div>
  );
};

export default CopilotSelector;
