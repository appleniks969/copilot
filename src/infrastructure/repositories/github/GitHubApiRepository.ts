import axios, { AxiosInstance } from 'axios';
import { CopilotOrgUsage, CopilotTeamUsage } from '../../../domain/entities/github/CopilotUsage';
import { DateRangeFilter, GitHubRepository } from '../../../domain/repositories/github/GitHubRepository';

export class GitHubApiRepository implements GitHubRepository {
  private client: AxiosInstance;
  private organization: string;
  
  constructor(apiToken: string, apiUrl: string, apiVersion: string, organization: string) {
    this.organization = organization;
    
    this.client = axios.create({
      baseURL: apiUrl,
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': apiVersion,
      },
    });
  }
  
  async getOrganizationCopilotUsage(orgName: string = this.organization, dateRange?: DateRangeFilter): Promise<CopilotOrgUsage> {
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
      console.log(`Fetching Copilot usage for org: ${orgName}`);
      const response = await this.client.get(url, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching organization Copilot usage for ${orgName}:`, error);
      throw error;
    }
  }
  
  async getTeamCopilotUsage(teamSlug: string, dateRange?: DateRangeFilter): Promise<CopilotTeamUsage> {
    // In GitHub's API, team slugs are used in the URL with the organization
    let url = `/orgs/${this.organization}/teams/${teamSlug}/copilot/usage`;
    
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
      console.log(`Fetching Copilot usage for team: ${teamSlug} in org: ${this.organization}`);
      const response = await this.client.get(url, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching team Copilot usage for ${teamSlug}:`, error);
      throw error;
    }
  }
  
  async getOrganizationTeams(): Promise<{ id: string; slug: string; name: string; }[]> {
    try {
      console.log(`Fetching teams for organization: ${this.organization}`);
      const response = await this.client.get(`/orgs/${this.organization}/teams`);
      
      return response.data.map((team: any) => ({
        id: team.id,
        slug: team.slug,
        name: team.name
      }));
    } catch (error) {
      console.error(`Error fetching teams for organization ${this.organization}:`, error);
      throw error;
    }
  }
}
