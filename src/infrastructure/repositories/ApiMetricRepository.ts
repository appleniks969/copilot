import { Metric, MetricType, MetricTrend } from '@/domain/models/Metric';
import { MetricRepository } from '@/domain/repositories/MetricRepository';
import apiClient from '../api/apiClient';

// Implementation of the MetricRepository interface using the API client
export class ApiMetricRepository implements MetricRepository {
  async getAllMetrics(): Promise<Metric[]> {
    try {
      const data = await apiClient.get<any[]>('/metrics');
      return data.map((item) => Metric.fromRawData(item));
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  }

  async getMetricById(id: string): Promise<Metric | null> {
    try {
      const data = await apiClient.get<any>(`/metrics/${id}`);
      return Metric.fromRawData(data);
    } catch (error) {
      console.error(`Error fetching metric with ID ${id}:`, error);
      return null;
    }
  }

  async getMetricsByType(type: string): Promise<Metric[]> {
    try {
      const data = await apiClient.get<any[]>(`/metrics?type=${type}`);
      return data.map((item) => Metric.fromRawData(item));
    } catch (error) {
      console.error(`Error fetching metrics of type ${type}:`, error);
      throw error;
    }
  }

  async getMetricsWithFilters(filters: Record<string, any>): Promise<Metric[]> {
    try {
      // Convert filters to query parameters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });

      const data = await apiClient.get<any[]>(`/metrics?${queryParams.toString()}`);
      return data.map((item) => Metric.fromRawData(item));
    } catch (error) {
      console.error('Error fetching metrics with filters:', error);
      throw error;
    }
  }

  async getMetricTimeSeries(
    metricId: string,
    startDate: Date,
    endDate: Date,
    granularity: string
  ): Promise<Metric> {
    try {
      const data = await apiClient.get<any>(`/metrics/${metricId}/timeseries`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          granularity,
        },
      });
      
      return Metric.fromRawData(data);
    } catch (error) {
      console.error(`Error fetching time series data for metric ${metricId}:`, error);
      throw error;
    }
  }

  async updateMetric(metric: Metric): Promise<Metric> {
    try {
      const data = await apiClient.put<any>(`/metrics/${metric.id}`, {
        id: metric.id,
        name: metric.name,
        description: metric.description,
        type: metric.type,
        value: metric.value,
        unit: metric.unit,
        dimensions: metric.dimensions,
        metadata: metric.metadata,
      });
      
      return Metric.fromRawData(data);
    } catch (error) {
      console.error(`Error updating metric ${metric.id}:`, error);
      throw error;
    }
  }

  // Fallback method for when the API is not available
  async getMockMetrics(): Promise<Metric[]> {
    const now = new Date();
    
    // Generate mock time series data
    const generateTimeSeries = (baseValue: number, count: number) => {
      return Array.from({ length: count }, (_, i) => ({
        timestamp: new Date(now.getTime() - (count - i) * 24 * 60 * 60 * 1000),
        value: baseValue + Math.random() * baseValue * 0.4 - baseValue * 0.2,
      }));
    };
    
    // Sample metrics
    const mockMetrics = [
      {
        id: 'metric-1',
        name: 'Successful Completions',
        description: 'Number of successful code completions',
        type: MetricType.COUNT,
        value: {
          current: 1254,
          previous: 1102,
          change: 152,
          trend: MetricTrend.UP,
        },
        unit: 'completions',
        timeSeries: generateTimeSeries(1200, 30),
      },
      {
        id: 'metric-2',
        name: 'Acceptance Rate',
        description: 'Percentage of suggested completions accepted by users',
        type: MetricType.PERCENTAGE,
        value: {
          current: 87.5,
          previous: 85.2,
          change: 2.3,
          trend: MetricTrend.UP,
        },
        unit: '%',
        timeSeries: generateTimeSeries(85, 30),
      },
      {
        id: 'metric-3',
        name: 'Average Response Time',
        description: 'Average time to generate a completion',
        type: MetricType.DURATION,
        value: {
          current: 0.45,
          previous: 0.52,
          change: -0.07,
          trend: MetricTrend.DOWN, // Down is good for response time
        },
        unit: 'seconds',
        timeSeries: generateTimeSeries(0.5, 30),
      },
      {
        id: 'metric-4',
        name: 'Cost Savings',
        description: 'Estimated developer time saved',
        type: MetricType.MONETARY,
        value: {
          current: 12450,
          previous: 10200,
          change: 2250,
          trend: MetricTrend.UP,
        },
        unit: 'USD',
        timeSeries: generateTimeSeries(11000, 30),
      },
      {
        id: 'metric-5',
        name: 'API Calls',
        description: 'Number of API calls to the service',
        type: MetricType.COUNT,
        value: {
          current: 58723,
          previous: 55210,
          change: 3513,
          trend: MetricTrend.UP,
        },
        unit: 'calls',
        timeSeries: generateTimeSeries(56000, 30),
      },
      {
        id: 'metric-6',
        name: 'Error Rate',
        description: 'Percentage of failed completions',
        type: MetricType.PERCENTAGE,
        value: {
          current: 1.2,
          previous: 1.8,
          change: -0.6,
          trend: MetricTrend.DOWN, // Down is good for error rate
        },
        unit: '%',
        timeSeries: generateTimeSeries(1.5, 30),
      },
    ];
    
    return mockMetrics.map((item) => Metric.fromRawData(item));
  }
}

// Create and export a singleton instance
export const apiMetricRepository = new ApiMetricRepository();
