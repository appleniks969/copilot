import { NextRequest, NextResponse } from 'next/server';
import { dashboardService, ensureInitialized } from '../providers/dataProviders';
import { z } from 'zod';

// Schema for validating query parameters
const GetDashboardsQuerySchema = z.object({
  owner: z.string().optional(),
  search: z.string().optional(),
  tags: z.string().optional(), // Comma-separated list of tags
  isDefault: z.string().optional(), // 'true' or 'false'
});

export async function GET(req: NextRequest) {
  try {
    // Ensure data is initialized
    await ensureInitialized();

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams;
    const queryParams = {
      owner: searchParams.get('owner') || undefined,
      search: searchParams.get('search') || undefined,
      tags: searchParams.get('tags') || undefined,
      isDefault: searchParams.get('isDefault') || undefined,
    };

    const validatedParams = GetDashboardsQuerySchema.parse(queryParams);
    
    // Process array parameters and boolean conversion
    const filter: any = {
      owner: validatedParams.owner,
      search: validatedParams.search,
    };
    
    if (validatedParams.tags) {
      filter.tags = validatedParams.tags.split(',');
    }
    
    if (validatedParams.isDefault) {
      filter.isDefault = validatedParams.isDefault === 'true';
    }

    // Get dashboards based on filters
    const dashboards = await dashboardService.getAllDashboards(filter);
    
    return NextResponse.json({ dashboards });
  } catch (error) {
    console.error('Error fetching dashboards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboards' },
      { status: 500 }
    );
  }
}

// Schema for creating a new dashboard
const CreateDashboardSchema = z.object({
  name: z.string(),
  description: z.string(),
  owner: z.string(),
  tags: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Ensure data is initialized
    await ensureInitialized();

    const body = await req.json();
    const validatedData = CreateDashboardSchema.parse(body);
    
    const newDashboard = await dashboardService.createDashboard(
      validatedData.name,
      validatedData.description,
      validatedData.owner
    );
    
    // Add tags if provided
    if (validatedData.tags && validatedData.tags.length > 0) {
      await dashboardService.updateDashboard(newDashboard.id, {
        tags: validatedData.tags,
      });
    }
    
    return NextResponse.json(
      { dashboard: newDashboard },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating dashboard:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create dashboard' },
      { status: 500 }
    );
  }
}
