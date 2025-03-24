import { NextRequest, NextResponse } from 'next/server';
import { gitHubCopilotService } from '@/app/api/providers/dataProviders';

export async function GET(req: NextRequest) {
  try {
    console.log('Fetching GitHub organizations');
    
    const organizations = await gitHubCopilotService.getUserOrganizations();
    
    return NextResponse.json({ organizations });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    
    let errorMessage = 'Failed to fetch organizations';
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
