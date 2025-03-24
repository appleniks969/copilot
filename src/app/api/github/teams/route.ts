import { NextRequest, NextResponse } from 'next/server';
import { gitHubCopilotService } from '@/app/api/providers/dataProviders';

export async function GET(req: NextRequest) {
  try {
    console.log('Fetching GitHub teams');
    
    const teams = await gitHubCopilotService.getOrganizationTeams();
    
    return NextResponse.json({ teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    
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
