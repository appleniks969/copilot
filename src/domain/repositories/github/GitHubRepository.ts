import { CopilotOrgUsage, CopilotTeamUsage } from '../../entities/github/CopilotUsage';

export interface DateRangeFilter {
  startDate: Date;
  endDate: Date;
}

export interface GitHubRepository {
  /**
   * Get Copilot usage data for an organization
   * @param orgName Organization name (defaults to configured organization)
   * @param dateRange Optional date range filter
   */
  getOrganizationCopilotUsage(orgName?: string, dateRange?: DateRangeFilter): Promise<CopilotOrgUsage>;
  
  /**
   * Get Copilot usage data for a team
   * @param teamSlug Team slug identifier
   * @param dateRange Optional date range filter
   */
  getTeamCopilotUsage(teamSlug: string, dateRange?: DateRangeFilter): Promise<CopilotTeamUsage>;
  
  /**
   * Get a list of teams in the configured organization
   */
  getOrganizationTeams(): Promise<{id: string; slug: string; name: string}[]>;
}
