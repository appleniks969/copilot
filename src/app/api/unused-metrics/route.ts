import { NextRequest, NextResponse } from 'next/server';
import { metricService, ensureInitialized } from '../providers/dataProviders';
import { z } from 'zod';

// Schema for validating query parameters
const GetMetricsQuerySchema = z.object({
  search: z.string().optional(),
  types: z.string().optional(), // Comma-separated list of types
  periods: z.string().optional(), // Comma-separated list of periods
  fromDate: z.string().optional(), // ISO date string
  toDate: z.string().optional(), // ISO date string
});

export async function GET(req: NextRequest) {
  try {
    // Ensure data is initialized
    await ensureInitialized();

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams;
    const queryParams = {
      search: searchParams.get('search') || undefined,
      types: searchParams.get('types') || undefined,
      periods: searchParams.get('periods') || undefined,
      fromDate: searchParams.get('fromDate') || undefined,
      toDate: searchParams.get('toDate') || undefined,
    };

    const validatedParams = GetMetricsQuerySchema.parse(queryParams);
    
    // Process array parameters
    const filter: any = {
      search: validatedParams.search,
    };
    
    if (validatedParams.types) {
      filter.types = validatedParams.types.split(',');
    }
    
    if (validatedParams.periods) {
      filter.periods = validatedParams.periods.split(',');
    }
    
    if (validatedParams.fromDate) {
      filter.fromDate = new Date(validatedParams.fromDate);
    }
    
    if (validatedParams.toDate) {
      filter.toDate = new Date(validatedParams.toDate);
    }

    // Get metrics based on filters
    const metrics = await metricService.getAllMetrics(filter);
    
    return NextResponse.json({ metrics });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}

// Schema for creating a new metric
const CreateMetricSchema = z.object({
  key: z.string(),
  name: z.string(),
  type: z.enum(['count', 'percentage', 'duration', 'monetary']),
  period: z.enum(['hourly', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
  initialValue: z.number(),
  description: z.string().optional(),
  thresholds: z.object({
    warning: z.number(),
    critical: z.number(),
  }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Ensure data is initialized
    await ensureInitialized();

    const body = await req.json();
    const validatedData = CreateMetricSchema.parse(body);
    
    const newMetric = await metricService.createMetric(
      validatedData.key,
      validatedData.name,
      validatedData.type,
      validatedData.period,
      validatedData.initialValue,
      validatedData.description,
      validatedData.thresholds
    );
    
    return NextResponse.json(
      { metric: newMetric },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating metric:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create metric' },
      { status: 500 }
    );
  }
}
