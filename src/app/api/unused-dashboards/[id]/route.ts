import { NextRequest, NextResponse } from 'next/server';
import { dashboardService, ensureInitialized } from '../../providers/dataProviders';
import { z } from 'zod';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    // Ensure data is initialized
    await ensureInitialized();
    
    const { id } = params;
    const dashboard = await dashboardService.getDashboardById(id);
    
    if (!dashboard) {
      return NextResponse.json(
        { error: `Dashboard with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ dashboard });
  } catch (error) {
    console.error(`Error fetching dashboard ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard' },
      { status: 500 }
    );
  }
}

// Schema for updating a dashboard
const UpdateDashboardSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    // Ensure data is initialized
    await ensureInitialized();
    
    const { id } = params;
    const body = await req.json();
    const validatedData = UpdateDashboardSchema.parse(body);
    
    // Check if dashboard exists
    const existingDashboard = await dashboardService.getDashboardById(id);
    if (!existingDashboard) {
      return NextResponse.json(
        { error: `Dashboard with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    const updatedDashboard = await dashboardService.updateDashboard(id, validatedData);
    
    return NextResponse.json({ dashboard: updatedDashboard });
  } catch (error) {
    console.error(`Error updating dashboard ${params.id}:`, error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update dashboard' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    // Ensure data is initialized
    await ensureInitialized();
    
    const { id } = params;
    const deleted = await dashboardService.deleteDashboard(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: `Dashboard with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting dashboard ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete dashboard' },
      { status: 500 }
    );
  }
}
