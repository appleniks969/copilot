import { NextRequest, NextResponse } from 'next/server';
import { metricService, ensureInitialized } from '../../providers/dataProviders';
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
    const metric = await metricService.getMetricById(id);
    
    if (!metric) {
      return NextResponse.json(
        { error: `Metric with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ metric });
  } catch (error) {
    console.error(`Error fetching metric ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch metric' },
      { status: 500 }
    );
  }
}

// Schema for updating a metric
const UpdateMetricSchema = z.object({
  value: z.number(),
});

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    // Ensure data is initialized
    await ensureInitialized();
    
    const { id } = params;
    const body = await req.json();
    const validatedData = UpdateMetricSchema.parse(body);
    
    const updatedMetric = await metricService.updateMetricValue(id, validatedData.value);
    
    return NextResponse.json({ metric: updatedMetric });
  } catch (error) {
    console.error(`Error updating metric ${params.id}:`, error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update metric' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    // Ensure data is initialized
    await ensureInitialized();
    
    const { id } = params;
    const deleted = await metricService.deleteMetric(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: `Metric with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting metric ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete metric' },
      { status: 500 }
    );
  }
}
