import axios, { AxiosInstance } from 'axios';
import { CopilotOrgUsage, CopilotTeamUsage } from '../../../domain/entities/github/CopilotUsage';
import { DateRangeFilter, GitHubRepository } from '../../../domain/repositories/github/GitHubRepository';

export class GitHubApiRepository implements GitHubRepository {
  private client: AxiosInstance;
  
  constructor(apiToken: string) {
    this.client = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Authorization: `token ${apiToken}`,
        Accept: 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
  }
  
  async getOrganizationCopilotUsage(orgName: string, dateRange?: DateRangeFilter): Promise<CopilotOrgUsage> {
    let url = `/copilot/usage/orgs/${orgName}`;
    
    // Add date range parameters if provided
    if (dateRange) {
      const params = new URLSearchParams();
      params.append('start_time', dateRange.startDate.toISOString());
      params.append('end_time', dateRange.endDate.toISOString());
      url += `?${params.toString()}`;
    }
    
    const response = await this.client.get(url);
    return response.data;
  }
  
  async getTeamCopilotUsage(teamId: number, dateRange?: DateRangeFilter): Promise<CopilotTeamUsage> {
    let url = `/copilot/usage/teams/${teamId}`;
    
    // Add date range parameters if provided
    if (dateRange) {
      const params = new URLSearchParams();
      params.append('start_time', dateRange.startDate.toISOString());
      params.append('end_time', dateRange.endDate.toISOString());
      url += `?${params.toString()}`;
    }
    
    const response = await this.client.get(url);
    return response.data;
  }
  
  async getUserOrganizations(): Promise<{ id: number; login: string; }[]> {
    const response = await this.client.get('/user/orgs');
    return response.data.map((org: any) => ({
      id: org.id,
      login: org.login
    }));
  }
  
  async getOrganizationTeams(orgName: string): Promise<{ id: number; name: string; }[]> {
    const response = await this.client.get(`/orgs/${orgName}/teams`);
    return response.data.map((team: any) => ({
      id: team.id,
      name: team.name
    }));
  }
}
