import { CopilotOrgUsage, CopilotTeamUsage } from '../../../domain/entities/github/CopilotUsage';
import { DateRangeFilter, GitHubRepository } from '../../../domain/repositories/github/GitHubRepository';

export class MockGitHubRepository implements GitHubRepository {
  async getOrganizationCopilotUsage(orgName?: string, dateRange?: DateRangeFilter): Promise<CopilotOrgUsage> {
    // Generate mock data that resembles real GitHub Copilot usage data
    console.log(`[MOCK] Fetching organization Copilot usage for: ${orgName || 'default org'}`);
    
    const now = new Date();
    const start = dateRange?.startDate || new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Default to 30 days ago
    const end = dateRange?.endDate || now;
    
    // Create active and inactive users
    const activeUsers = Array.from({ length: 15 }, (_, i) => ({
      id: 1000 + i,
      login: `active-user-${i}`,
      name: `Active User ${i}`,
      last_activity_at: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      last_activity_editor: ['VS Code', 'Visual Studio', 'JetBrains', 'Vim', 'Neovim'][Math.floor(Math.random() * 5)],
      active: true
    }));
    
    const inactiveUsers = Array.from({ length: 8 }, (_, i) => ({
      id: 2000 + i,
      login: `inactive-user-${i}`,
      name: `Inactive User ${i}`,
      last_activity_at: new Date(now.getTime() - (30 + Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString(),
      active: false
    }));
    
    // Create repositories
    const repositories = [
      { id: 1, name: 'frontend-app' },
      { id: 2, name: 'backend-api' },
      { id: 3, name: 'shared-libs' },
      { id: 4, name: 'internal-tools' },
      { id: 5, name: 'docs-site' },
      { id: 6, name: 'mobile-app' },
    ];
    
    // Generate repository stats
    const repoStats = repositories.map(repo => {
      const shown = Math.floor(1000 + Math.random() * 10000);
      const accepted = Math.floor(shown * (0.3 + Math.random() * 0.5)); // 30-80% acceptance rate
      
      return {
        repository_id: repo.id,
        repository_name: repo.name,
        suggestions: {
          shown,
          accepted
        },
        active_users: Math.floor(1 + Math.random() * activeUsers.length)
      };
    });
    
    // Generate user stats
    const userStats = activeUsers.map(user => {
      const userRepos = [];
      const numRepos = Math.floor(1 + Math.random() * 4); // Each user works on 1-4 repos
      
      // Randomly select repos for this user
      const shuffledRepos = [...repositories].sort(() => 0.5 - Math.random());
      for (let i = 0; i < numRepos; i++) {
        const repo = shuffledRepos[i];
        const shown = Math.floor(100 + Math.random() * 2000);
        const accepted = Math.floor(shown * (0.3 + Math.random() * 0.5)); // 30-80% acceptance rate
        
        userRepos.push({
          repository_id: repo.id,
          repository_name: repo.name,
          suggestions: {
            shown,
            accepted
          }
        });
      }
      
      // Calculate total suggestion stats for this user
      const totalShown = userRepos.reduce((sum, repo) => sum + repo.suggestions.shown, 0);
      const totalAccepted = userRepos.reduce((sum, repo) => sum + repo.suggestions.accepted, 0);
      
      return {
        user_id: user.id,
        user_login: user.login,
        suggestions: {
          shown: totalShown,
          accepted: totalAccepted
        },
        repositories: userRepos
      };
    });
    
    // Calculate aggregated stats
    const totalShown = userStats.reduce((sum, user) => sum + user.suggestions.shown, 0);
    const totalAccepted = userStats.reduce((sum, user) => sum + user.suggestions.accepted, 0);
    
    return {
      org: orgName || 'mock-organization',
      total_users_with_access: activeUsers.length + inactiveUsers.length,
      active_users: activeUsers,
      inactive_users: inactiveUsers,
      aggregated: {
        suggestions: {
          shown: totalShown,
          accepted: totalAccepted
        },
        active_users: activeUsers.length,
        total_users: activeUsers.length + inactiveUsers.length,
        inactive_users: inactiveUsers.length,
        repositories: repoStats
      },
      users: userStats,
      start_time: start.toISOString(),
      end_time: end.toISOString()
    };
  }
  
  async getTeamCopilotUsage(teamSlug: string, dateRange?: DateRangeFilter): Promise<CopilotTeamUsage> {
    // Generate mock data for team usage
    console.log(`[MOCK] Fetching team Copilot usage for: ${teamSlug}`);
    
    const orgData = await this.getOrganizationCopilotUsage('mock-org', dateRange);
    
    // Use a subset of the organization data for team
    const activeMembers = orgData.active_users.slice(0, 5);
    const inactiveMembers = orgData.inactive_users.slice(0, 3);
    const teamUsers = orgData.users.filter(user => 
      activeMembers.some(member => member.id === user.user_id)
    );
    
    // Calculate team aggregates
    const totalShown = teamUsers.reduce((sum, user) => sum + user.suggestions.shown, 0);
    const totalAccepted = teamUsers.reduce((sum, user) => sum + user.suggestions.accepted, 0);
    
    // Filter repositories to just those accessed by team members
    const teamRepoIds = new Set<number>();
    teamUsers.forEach(user => {
      user.repositories.forEach(repo => {
        teamRepoIds.add(repo.repository_id);
      });
    });
    
    const teamRepos = orgData.aggregated.repositories.filter(repo => 
      teamRepoIds.has(repo.repository_id)
    );
    
    return {
      team_id: 101,
      team_name: teamSlug || 'Mock Team',
      team_slug: teamSlug || 'mock-team',
      total_members_with_access: activeMembers.length + inactiveMembers.length,
      active_members: activeMembers,
      inactive_members: inactiveMembers,
      aggregated: {
        suggestions: {
          shown: totalShown,
          accepted: totalAccepted
        },
        active_users: activeMembers.length,
        total_users: activeMembers.length + inactiveMembers.length,
        inactive_users: inactiveMembers.length,
        repositories: teamRepos
      },
      users: teamUsers,
      start_time: orgData.start_time,
      end_time: orgData.end_time
    };
  }
  
  async getOrganizationTeams(): Promise<{ id: string; slug: string; name: string; }[]> {
    // Generate mock team data
    console.log('[MOCK] Fetching teams for organization');
    
    return [
      { id: '101', slug: 'engineering', name: 'Engineering' },
      { id: '102', slug: 'design', name: 'Design' },
      { id: '103', slug: 'product', name: 'Product' },
      { id: '104', slug: 'platform', name: 'Platform' },
      { id: '105', slug: 'devops', name: 'DevOps' }
    ];
  }
}
