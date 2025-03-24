import { NextRequest, NextResponse } from 'next/server';
import { gitHubCopilotService } from '@/app/api/providers/dataProviders';
import { z } from 'zod';

// Schema for validating query parameters
const QuerySchema = z.object({
  start_time: z.string().optional(),
  end_time: z.string().optional(),
});

interface Params {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const teamId = parseInt(params.id);
    
    if (isNaN(teamId)) {
      return NextResponse.json(
        { error: 'Invalid team ID' },
        { status: 400 }
      );
    }
    
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
    
    console.log(`Fetching Copilot usage for team ${teamId} with date range:`, dateRange);
    
    // Get Copilot usage data
    const usageData = await gitHubCopilotService.getTeamCopilotUsage(teamId, dateRange);
    
    // Calculate additional metrics
    const metrics = gitHubCopilotService.calculateTeamMetrics(usageData);
    
    return NextResponse.json({ 
      usageData,
      metrics
    });
  } catch (error) {
    console.error(`Error fetching Copilot usage for team ${params.id}:`, error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.errors },
        { status: 400 }
      );
    }
    
    let errorMessage = 'Failed to fetch Copilot usage data';
    let statusCode = 500;
    
    // Handle specific API errors
    if (error.response) {
      errorMessage = `GitHub API error: ${error.response.data?.message || 'Unknown error'}`;
      statusCode = error.response.status;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
