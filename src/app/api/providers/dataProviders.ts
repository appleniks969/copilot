import { GitHubApiRepository } from '@/infrastructure/repositories/github/GitHubApiRepository';
import { MockGitHubRepository } from '@/infrastructure/repositories/github/MockGitHubRepository';
import { GitHubCopilotService } from '@/application/services/github/GitHubCopilotService';

// Get environment variables
const apiToken = process.env.GITHUB_API_TOKEN;
const apiUrl = process.env.GITHUB_API_URL || 'https://api.github.com';
const apiVersion = process.env.GITHUB_API_VERSION || '2022-11-28';
const organization = process.env.GITHUB_ORGANIZATION;

// Determine whether to use mock data - useful for development and testing
const useMockData = process.env.USE_MOCK_DATA === 'true';

// Log the current configuration
console.log(`API Configuration:
  - Using mock data: ${useMockData ? 'YES' : 'NO'}
  - Organization: ${organization || 'Not set'}
  - API URL: ${apiUrl}
  - API Version: ${apiVersion}
  - Token set: ${apiToken ? 'YES' : 'NO'}
`);

// Initialize GitHub repository
let gitHubRepo;

if (useMockData || !apiToken || !organization) {
  console.log('Using mock GitHub repository for data');
  gitHubRepo = new MockGitHubRepository();
} else {
  console.log('Using real GitHub API repository for data');
  gitHubRepo = new GitHubApiRepository(
    apiToken, 
    apiUrl, 
    apiVersion, 
    organization
  );
}

// Initialize GitHub Copilot service with the repository
const gitHubCopilotService = new GitHubCopilotService(gitHubRepo);

export { gitHubCopilotService };
