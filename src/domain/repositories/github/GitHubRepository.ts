import { CopilotOrgUsage, CopilotTeamUsage } from '../../entities/github/CopilotUsage';

export interface DateRangeFilter {
  startDate: Date;
  endDate: Date;
}

export interface GitHubRepository {
  /**
   * Get Copilot usage data for an organization
   * @param orgName Organization name
   * @param dateRange Optional date range filter
   */
  getOrganizationCopilotUsage(orgName: string, dateRange?: DateRangeFilter): Promise<CopilotOrgUsage>;
  
  /**
   * Get Copilot usage data for a team
   * @param teamId Team ID
   * @param dateRange Optional date range filter
   */
  getTeamCopilotUsage(teamId: number, dateRange?: DateRangeFilter): Promise<CopilotTeamUsage>;
  
  /**
   * Get a list of organizations the authenticated user has access to
   */
  getUserOrganizations(): Promise<{id: number, login: string}[]>;
  
  /**
   * Get a list of teams in the specified organization
   * @param orgName Organization name
   */
  getOrganizationTeams(orgName: string): Promise<{id: number, name: string}[]>;
}
