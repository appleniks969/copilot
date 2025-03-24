import { GitHubApiRepository } from '@/infrastructure/repositories/github/GitHubApiRepository';
import { MockGitHubRepository } from '@/infrastructure/repositories/github/MockGitHubRepository';
import { GitHubCopilotService } from '@/application/services/github/GitHubCopilotService';

// Determine whether to use mock data or real API
const useMockApi = process.env.NEXT_PUBLIC_ENABLE_MOCK_API === 'true';

// Initialize GitHub repository
let gitHubRepo;
if (useMockApi) {
  console.log('Using mock GitHub repository');
  gitHubRepo = new MockGitHubRepository();
} else {
  console.log('Using real GitHub API repository');
  
  // Get the API token from environment variables
  const apiToken = process.env.GITHUB_API_TOKEN;
  
  if (!apiToken) {
    console.error('GitHub API token is not set. Set GITHUB_API_TOKEN in .env.local file.');
    // Fallback to mock repository if token is not available
    gitHubRepo = new MockGitHubRepository();
  } else {
    gitHubRepo = new GitHubApiRepository(apiToken);
  }
}

// Initialize GitHub Copilot service with the repository
const gitHubCopilotService = new GitHubCopilotService(gitHubRepo);

export { gitHubCopilotService };
