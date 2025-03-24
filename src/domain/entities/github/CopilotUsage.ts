/**
 * Domain entities for GitHub Copilot usage data
 * Based on the GitHub API:
 * - https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28#get-a-summary-of-copilot-usage-for-organization-members
 * - https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28#get-a-summary-of-copilot-usage-for-a-team
 */

export interface CopilotUser {
  id: number;
  login: string;
  name?: string;
  last_activity_at: string;
  last_activity_editor?: string;
  active: boolean;
}

export interface CopilotSuggestionStats {
  shown: number;
  accepted: number;
  acceptance_rate?: number; // Calculated field: accepted / shown
}

export interface CopilotRepositoryStats {
  repository_id: number;
  repository_name: string;
  suggestions: CopilotSuggestionStats;
  active_users: number;
}

export interface CopilotUserStats {
  user_id: number;
  user_login: string;
  suggestions: CopilotSuggestionStats;
  repositories: {
    repository_id: number;
    repository_name: string;
    suggestions: CopilotSuggestionStats;
  }[];
}

export interface CopilotAggregatedStats {
  suggestions: CopilotSuggestionStats;
  active_users: number;
  total_users: number;
  inactive_users: number;
  repositories: CopilotRepositoryStats[];
}

export interface CopilotOrgUsage {
  org: string;
  total_users_with_access: number;
  active_users: CopilotUser[];
  inactive_users: CopilotUser[];
  aggregated: CopilotAggregatedStats;
  users: CopilotUserStats[];
  start_time: string;
  end_time: string;
}

export interface CopilotTeamUsage {
  team_id: number;
  team_name: string;
  total_members_with_access: number;
  active_members: CopilotUser[];
  inactive_members: CopilotUser[];
  aggregated: CopilotAggregatedStats;
  users: CopilotUserStats[];
  start_time: string;
  end_time: string;
}
