import { NextRequest, NextResponse } from 'next/server';
import { GitHubCopilotService } from '@/application/services/github/GitHubCopilotService';
import { MockGitHubRepository } from '@/infrastructure/repositories/github/MockGitHubRepository';
// import { GitHubApiRepository } from '@/infrastructure/repositories/github/GitHubApiRepository';
import { z } from 'zod';

// Initialize service with mock repository for development
// In production, use the real API repository with a token
// const gitHubRepo = new GitHubApiRepository(process.env.GITHUB_API_TOKEN || '');
const gitHubRepo = new MockGitHubRepository();
const gitHubCopilotService = new GitHubCopilotService(gitHubRepo);

// Schema for validating query parameters
const QuerySchema = z.object({
  start_time: z.string().optional(),
  end_time: z.string().optional(),
});

interface Params {
  params: {
    org: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { org } = params;
    
    // Parse and validate query parameters
    const searchParams = req.nextUrl.searchParams;
    const queryParams = {
      start_time: searchParams.get('start_time') || undefined,
      end_time: searchParams.get('end_time') || undefined,
    };
    
    const validatedParams = QuerySchema.parse(queryParams);
    
    // Create date range filter if provided
    const dateRange = validatedParams.start_time && validatedParams.end_time
      ? {
          startDate: new Date(validatedParams.start_time),
          endDate: new Date(validatedParams.end_time),
        }
      : undefined;
    
    // Get Copilot usage data
    const usageData = await gitHubCopilotService.getOrganizationCopilotUsage(org, dateRange);
    
    // Calculate additional metrics
    const metrics = gitHubCopilotService.calculateOrganizationMetrics(usageData);
    
    return NextResponse.json({ 
      usageData,
      metrics
    });
  } catch (error) {
    console.error(`Error fetching Copilot usage for org ${params.org}:`, error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch Copilot usage data' },
      { status: 500 }
    );
  }
}
