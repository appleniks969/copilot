/**
 * Service for handling metric-related business logic
 */
import { Metric, MetricValue, TrendDirection, createMetric } from '../../domain/entities/Metric';
import { IMetricRepository, MetricFilter } from '../../domain/repositories/MetricRepository';

export class MetricService {
  constructor(private metricRepository: IMetricRepository) {}

  /**
   * Get a metric by its ID
   */
  async getMetricById(id: string): Promise<Metric | null> {
    return this.metricRepository.getById(id);
  }

  /**
   * Get all metrics with optional filtering
   */
  async getAllMetrics(filter?: MetricFilter): Promise<Metric[]> {
    return this.metricRepository.getAll(filter);
  }

  /**
   * Create a new metric
   */
  async createMetric(
    key: string,
    name: string,
    type: Metric['type'],
    period: Metric['period'],
    initialValue: number,
    description?: string,
    thresholds?: Metric['thresholds']
  ): Promise<Metric> {
    const metric = createMetric(key, name, type, period, initialValue);
    
    if (description) {
      metric.metadata.description = description;
    }
    
    if (thresholds) {
      metric.thresholds = thresholds;
    }
    
    return this.metricRepository.save(metric);
  }

  /**
   * Update a metric's value and calculate trends
   */
  async updateMetricValue(id: string, newValue: number): Promise<Metric> {
    const metric = await this.metricRepository.getById(id);
    if (!metric) {
      throw new Error(`Metric with ID ${id} not found`);
    }

    // Calculate trend
    const previousValue = metric.currentValue;
    const changePercentage = previousValue !== 0 
      ? ((newValue - previousValue) / Math.abs(previousValue)) * 100 
      : 0;

    let trend: TrendDirection = 'stable';
    if (changePercentage > 1) {
      trend = 'up';
    } else if (changePercentage < -1) {
      trend = 'down';
    }

    // Add new value to history
    const newHistoryEntry: MetricValue = {
      value: newValue,
      timestamp: new Date()
    };

    metric.previousValue = previousValue;
    metric.currentValue = newValue;
    metric.trend = trend;
    metric.changePercentage = changePercentage;
    metric.history.push(newHistoryEntry);
    metric.metadata.lastUpdated = new Date();

    return this.metricRepository.save(metric);
  }

  /**
   * Delete a metric
   */
  async deleteMetric(id: string): Promise<boolean> {
    return this.metricRepository.delete(id);
  }

  /**
   * Get metric values for a time range
   */
  async getMetricHistoryForTimeRange(id: string, fromDate: Date, toDate: Date): Promise<MetricValue[]> {
    return this.metricRepository.getMetricHistory(id, fromDate, toDate);
  }

  /**
   * Check if a metric has crossed any thresholds
   */
  async checkMetricThresholds(id: string): Promise<{ hasCrossedWarning: boolean; hasCrossedCritical: boolean }> {
    const metric = await this.metricRepository.getById(id);
    if (!metric || !metric.thresholds) {
      return { hasCrossedWarning: false, hasCrossedCritical: false };
    }

    return {
      hasCrossedWarning: metric.currentValue >= metric.thresholds.warning,
      hasCrossedCritical: metric.currentValue >= metric.thresholds.critical
    };
  }
}
