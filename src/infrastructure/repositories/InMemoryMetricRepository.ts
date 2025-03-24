/**
 * In-memory implementation of IMetricRepository for development and testing
 */
import { Metric, MetricValue } from '../../domain/entities/Metric';
import { IMetricRepository, MetricFilter } from '../../domain/repositories/MetricRepository';

export class InMemoryMetricRepository implements IMetricRepository {
  private metrics: Map<string, Metric> = new Map();

  async getById(id: string): Promise<Metric | null> {
    const metric = this.metrics.get(id);
    return metric ? { ...metric } : null;
  }

  async getByIds(ids: string[]): Promise<Metric[]> {
    return ids
      .map(id => this.metrics.get(id))
      .filter((metric): metric is Metric => metric !== undefined)
      .map(metric => ({ ...metric }));
  }

  async getAll(filter?: MetricFilter): Promise<Metric[]> {
    let metrics = Array.from(this.metrics.values()).map(metric => ({ ...metric }));

    if (filter) {
      // Apply filters
      if (filter.types?.length) {
        metrics = metrics.filter(metric => filter.types?.includes(metric.type));
      }

      if (filter.periods?.length) {
        metrics = metrics.filter(metric => filter.periods?.includes(metric.period));
      }

      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        metrics = metrics.filter(
          metric =>
            metric.key.toLowerCase().includes(searchLower) ||
            metric.metadata.name.toLowerCase().includes(searchLower) ||
            metric.metadata.description.toLowerCase().includes(searchLower)
        );
      }

      if (filter.fromDate || filter.toDate) {
        metrics = metrics.filter(metric => {
          const lastUpdated = metric.metadata.lastUpdated;
          if (!lastUpdated) return true;

          if (filter.fromDate && lastUpdated < filter.fromDate) return false;
          if (filter.toDate && lastUpdated > filter.toDate) return false;
          return true;
        });
      }
    }

    return metrics;
  }

  async save(metric: Metric): Promise<Metric> {
    this.metrics.set(metric.id, { ...metric });
    return { ...metric };
  }

  async delete(id: string): Promise<boolean> {
    return this.metrics.delete(id);
  }

  async getMetricHistory(id: string, fromDate?: Date, toDate?: Date): Promise<MetricValue[]> {
    const metric = this.metrics.get(id);
    if (!metric) return [];

    let history = [...metric.history];

    if (fromDate || toDate) {
      history = history.filter(entry => {
        if (fromDate && entry.timestamp < fromDate) return false;
        if (toDate && entry.timestamp > toDate) return false;
        return true;
      });
    }

    return history;
  }

  async updateMetricValue(id: string, newValue: number): Promise<Metric> {
    const metric = this.metrics.get(id);
    if (!metric) {
      throw new Error(`Metric with ID ${id} not found`);
    }

    const updatedMetric: Metric = {
      ...metric,
      previousValue: metric.currentValue,
      currentValue: newValue,
      history: [
        ...metric.history,
        {
          value: newValue,
          timestamp: new Date()
        }
      ],
      metadata: {
        ...metric.metadata,
        lastUpdated: new Date()
      }
    };

    // Calculate trend
    const changePercentage = metric.currentValue !== 0 
      ? ((newValue - metric.currentValue) / Math.abs(metric.currentValue)) * 100 
      : 0;

    if (Math.abs(changePercentage) > 1) {
      updatedMetric.trend = changePercentage > 0 ? 'up' : 'down';
    } else {
      updatedMetric.trend = 'stable';
    }

    updatedMetric.changePercentage = changePercentage;

    this.metrics.set(id, updatedMetric);
    return { ...updatedMetric };
  }
}
