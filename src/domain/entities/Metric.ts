/**
 * Metric entity represents a measurable value in our system
 * This is the core domain entity for our metrics dashboard
 */
export type MetricType = 'count' | 'percentage' | 'duration' | 'monetary';
export type MetricPeriod = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type TrendDirection = 'up' | 'down' | 'stable';

export interface MetricValue {
  value: number;
  timestamp: Date;
}

export interface MetricThreshold {
  warning: number;
  critical: number;
}

export interface MetricMetadata {
  name: string;
  description: string;
  unit?: string;
  owner?: string;
  dataSource?: string;
  lastUpdated?: Date;
}

export interface Metric {
  id: string;
  key: string;
  type: MetricType;
  period: MetricPeriod;
  currentValue: number;
  previousValue?: number;
  trend?: TrendDirection;
  changePercentage?: number;
  history: MetricValue[];
  thresholds?: MetricThreshold;
  metadata: MetricMetadata;
  targetValue?: number;
}

/**
 * Factory function to create a new Metric with default values
 */
export function createMetric(
  key: string,
  name: string,
  type: MetricType,
  period: MetricPeriod,
  currentValue: number
): Metric {
  return {
    id: crypto.randomUUID(),
    key,
    type,
    period,
    currentValue,
    history: [{
      value: currentValue,
      timestamp: new Date()
    }],
    metadata: {
      name,
      description: '',
      lastUpdated: new Date()
    }
  };
}
