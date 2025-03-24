import { NextRequest, NextResponse } from 'next/server';
import { MockGitHubRepository } from '@/infrastructure/repositories/github/MockGitHubRepository';
// import { GitHubApiRepository } from '@/infrastructure/repositories/github/GitHubApiRepository';

// Initialize repository
// In production, use the real API repository with a token
// const gitHubRepo = new GitHubApiRepository(process.env.GITHUB_API_TOKEN || '');
const gitHubRepo = new MockGitHubRepository();

interface Params {
  params: {
    org: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { org } = params;
    
    const teams = await gitHubRepo.getOrganizationTeams(org);
    
    return NextResponse.json({ teams });
  } catch (error) {
    console.error(`Error fetching teams for org ${params.org}:`, error);
    
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}
