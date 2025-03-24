import { NextRequest, NextResponse } from 'next/server';
import { MockGitHubRepository } from '@/infrastructure/repositories/github/MockGitHubRepository';
// import { GitHubApiRepository } from '@/infrastructure/repositories/github/GitHubApiRepository';

// Initialize repository
// In production, use the real API repository with a token
// const gitHubRepo = new GitHubApiRepository(process.env.GITHUB_API_TOKEN || '');
const gitHubRepo = new MockGitHubRepository();

export async function GET(req: NextRequest) {
  try {
    const organizations = await gitHubRepo.getUserOrganizations();
    
    return NextResponse.json({ organizations });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch organizations' },
      { status: 500 }
    );
  }
}
