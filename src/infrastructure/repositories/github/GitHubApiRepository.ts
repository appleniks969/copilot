import axios, { AxiosInstance } from 'axios';
import { CopilotOrgUsage, CopilotTeamUsage } from '../../../domain/entities/github/CopilotUsage';
import { DateRangeFilter, GitHubRepository } from '../../../domain/repositories/github/GitHubRepository';

export class GitHubApiRepository implements GitHubRepository {
  private client: AxiosInstance;
  
  constructor(apiToken: string) {
    this.client = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
  }
  
  async getOrganizationCopilotUsage(orgName: string, dateRange?: DateRangeFilter): Promise<CopilotOrgUsage> {
    let url = `/orgs/${orgName}/copilot/usage`;
    
    // Add date range parameters if provided
    const params: Record<string, string> = {};
    if (dateRange) {
      if (dateRange.startDate) {
        params.start_time = dateRange.startDate.toISOString();
      }
      if (dateRange.endDate) {
        params.end_time = dateRange.endDate.toISOString();
      }
    }
    
    try {
      const response = await this.client.get(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching organization Copilot usage:', error);
      throw error;
    }
  }
  
  async getTeamCopilotUsage(teamId: number, dateRange?: DateRangeFilter): Promise<CopilotTeamUsage> {
    let url = `/teams/${teamId}/copilot/usage`;
    
    // Add date range parameters if provided
    const params: Record<string, string> = {};
    if (dateRange) {
      if (dateRange.startDate) {
        params.start_time = dateRange.startDate.toISOString();
      }
      if (dateRange.endDate) {
        params.end_time = dateRange.endDate.toISOString();
      }
    }
    
    try {
      const response = await this.client.get(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching team Copilot usage:', error);
      throw error;
    }
  }
  
  async getUserOrganizations(): Promise<{ id: number; login: string; }[]> {
    try {
      const response = await this.client.get('/user/orgs');
      return response.data.map((org: any) => ({
        id: org.id,
        login: org.login
      }));
    } catch (error) {
      console.error('Error fetching user organizations:', error);
      throw error;
    }
  }
  
  async getOrganizationTeams(orgName: string): Promise<{ id: number; name: string; }[]> {
    try {
      const response = await this.client.get(`/orgs/${orgName}/teams`);
      return response.data.map((team: any) => ({
        id: team.id,
        name: team.name
      }));
    } catch (error) {
      console.error(`Error fetching teams for org ${orgName}:`, error);
      throw error;
    }
  }
}
