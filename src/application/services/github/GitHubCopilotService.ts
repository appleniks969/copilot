import { CopilotOrgUsage, CopilotRepositoryStats, CopilotTeamUsage, CopilotUserStats } from '../../../domain/entities/github/CopilotUsage';
import { DateRangeFilter, GitHubRepository } from '../../../domain/repositories/github/GitHubRepository';

export class GitHubCopilotService {
  constructor(private gitHubRepository: GitHubRepository) {}

  /**
   * Get Copilot usage data for an organization
   */
  async getOrganizationCopilotUsage(orgName?: string, dateRange?: DateRangeFilter): Promise<CopilotOrgUsage> {
    return this.gitHubRepository.getOrganizationCopilotUsage(orgName, dateRange);
  }

  /**
   * Get Copilot usage data for a team
   */
  async getTeamCopilotUsage(teamSlug: string, dateRange?: DateRangeFilter): Promise<CopilotTeamUsage> {
    return this.gitHubRepository.getTeamCopilotUsage(teamSlug, dateRange);
  }

  /**
   * Get a list of teams in the organization
   */
  async getOrganizationTeams() {
    return this.gitHubRepository.getOrganizationTeams();
  }

  /**
   * Calculate additional metrics from organization usage data
   */
  calculateOrganizationMetrics(orgUsage: CopilotOrgUsage) {
    return {
      // Usage rate - percentage of users who are active
      usageRate: orgUsage.total_users_with_access > 0 
        ? (orgUsage.active_users.length / orgUsage.total_users_with_access) * 100 
        : 0,
      
      // Acceptance rate - percentage of suggestions accepted
      acceptanceRate: orgUsage.aggregated.suggestions.shown > 0 
        ? (orgUsage.aggregated.suggestions.accepted / orgUsage.aggregated.suggestions.shown) * 100 
        : 0,
      
      // Suggestions per active user
      suggestionsPerActiveUser: orgUsage.active_users.length > 0 
        ? orgUsage.aggregated.suggestions.shown / orgUsage.active_users.length 
        : 0,
      
      // Accepted suggestions per active user
      acceptedSuggestionsPerActiveUser: orgUsage.active_users.length > 0 
        ? orgUsage.aggregated.suggestions.accepted / orgUsage.active_users.length 
        : 0,
      
      // Most active repositories
      mostActiveRepositories: [...orgUsage.aggregated.repositories]
        .sort((a, b) => b.suggestions.shown - a.suggestions.shown)
        .slice(0, 5),
      
      // Most efficient repositories (highest acceptance rate)
      mostEfficientRepositories: [...orgUsage.aggregated.repositories]
        .filter(repo => repo.suggestions.shown > 100) // Filter for statistical significance
        .sort((a, b) => {
          const aRate = a.suggestions.accepted / a.suggestions.shown;
          const bRate = b.suggestions.accepted / b.suggestions.shown;
          return bRate - aRate;
        })
        .slice(0, 5),
      
      // Most active users
      mostActiveUsers: [...orgUsage.users]
        .sort((a, b) => b.suggestions.shown - a.suggestions.shown)
        .slice(0, 5),
      
      // Most efficient users (highest acceptance rate)
      mostEfficientUsers: [...orgUsage.users]
        .filter(user => user.suggestions.shown > 100) // Filter for statistical significance
        .sort((a, b) => {
          const aRate = a.suggestions.accepted / a.suggestions.shown;
          const bRate = b.suggestions.accepted / b.suggestions.shown;
          return bRate - aRate;
        })
        .slice(0, 5)
    };
  }

  /**
   * Calculate additional metrics from team usage data
   */
  calculateTeamMetrics(teamUsage: CopilotTeamUsage) {
    return {
      // Usage rate - percentage of team members who are active
      usageRate: teamUsage.total_members_with_access > 0 
        ? (teamUsage.active_members.length / teamUsage.total_members_with_access) * 100 
        : 0,
      
      // Acceptance rate - percentage of suggestions accepted
      acceptanceRate: teamUsage.aggregated.suggestions.shown > 0 
        ? (teamUsage.aggregated.suggestions.accepted / teamUsage.aggregated.suggestions.shown) * 100 
        : 0,
      
      // Suggestions per active member
      suggestionsPerActiveMember: teamUsage.active_members.length > 0 
        ? teamUsage.aggregated.suggestions.shown / teamUsage.active_members.length 
        : 0,
      
      // Accepted suggestions per active member
      acceptedSuggestionsPerActiveMember: teamUsage.active_members.length > 0 
        ? teamUsage.aggregated.suggestions.accepted / teamUsage.active_members.length 
        : 0,
      
      // Most active repositories
      mostActiveRepositories: [...teamUsage.aggregated.repositories]
        .sort((a, b) => b.suggestions.shown - a.suggestions.shown)
        .slice(0, 5),
      
      // Most efficient repositories (highest acceptance rate)
      mostEfficientRepositories: [...teamUsage.aggregated.repositories]
        .filter(repo => repo.suggestions.shown > 100) // Filter for statistical significance
        .sort((a, b) => {
          const aRate = a.suggestions.accepted / a.suggestions.shown;
          const bRate = b.suggestions.accepted / b.suggestions.shown;
          return bRate - aRate;
        })
        .slice(0, 5),
      
      // Most active users
      mostActiveUsers: [...teamUsage.users]
        .sort((a, b) => b.suggestions.shown - a.suggestions.shown)
        .slice(0, 5),
      
      // Most efficient users (highest acceptance rate)
      mostEfficientUsers: [...teamUsage.users]
        .filter(user => user.suggestions.shown > 100) // Filter for statistical significance
        .sort((a, b) => {
          const aRate = a.suggestions.accepted / a.suggestions.shown;
          const bRate = b.suggestions.accepted / b.suggestions.shown;
          return bRate - aRate;
        })
        .slice(0, 5)
    };
  }
}
