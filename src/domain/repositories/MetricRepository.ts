/**
 * Repository interface for Metric entities
 */
import { Metric, MetricPeriod, MetricType } from '../entities/Metric';

export interface MetricFilter {
  types?: MetricType[];
  periods?: MetricPeriod[];
  search?: string;
  tags?: string[];
  fromDate?: Date;
  toDate?: Date;
}

export interface IMetricRepository {
  /**
   * Get a metric by its ID
   */
  getById(id: string): Promise<Metric | null>;
  
  /**
   * Get metrics by their IDs
   */
  getByIds(ids: string[]): Promise<Metric[]>;
  
  /**
   * Get all metrics with optional filtering
   */
  getAll(filter?: MetricFilter): Promise<Metric[]>;
  
  /**
   * Save a metric (create or update)
   */
  save(metric: Metric): Promise<Metric>;
  
  /**
   * Delete a metric by its ID
   */
  delete(id: string): Promise<boolean>;
  
  /**
   * Get historical data for a metric with optional time range
   */
  getMetricHistory(id: string, fromDate?: Date, toDate?: Date): Promise<Metric['history']>;
  
  /**
   * Update a metric with new value and calculate trend
   */
  updateMetricValue(id: string, newValue: number): Promise<Metric>;
}
