import { NextRequest, NextResponse } from 'next/server';
import { gitHubCopilotService } from '@/app/api/providers/dataProviders';

interface Params {
  params: {
    org: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { org } = params;
    
    console.log(`Fetching teams for organization ${org}`);
    
    const teams = await gitHubCopilotService.getOrganizationTeams(org);
    
    return NextResponse.json({ teams });
  } catch (error) {
    console.error(`Error fetching teams for org ${params.org}:`, error);
    
    let errorMessage = 'Failed to fetch teams';
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
