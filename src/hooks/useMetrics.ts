import { useState, useEffect, useCallback } from 'react';
import { Metric, MetricType } from '@/domain/models/Metric';
import { metricService } from '@/application/services/MetricService';

// Hook for working with metrics
export function useMetrics(initialFilters?: {
  types?: MetricType[];
  search?: string;
  minValue?: number;
  maxValue?: number;
  trend?: string;
  dimensions?: Record<string, string>;
}) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [filteredMetrics, setFilteredMetrics] = useState<Metric[]>([]);
  const [filters, setFilters] = useState(initialFilters || {});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState({
    totalCount: 0,
    averageValue: 0,
    minValue: 0,
    maxValue: 0,
    medianValue: 0,
    upTrendCount: 0,
    downTrendCount: 0,
    neutralTrendCount: 0,
  });

  // Fetch metrics
  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const data = await metricService.getAllMetrics();
      setMetrics(data);
      
      // Apply filters if any
      if (Object.keys(filters).length > 0) {
        const filtered = await metricService.filterMetrics(filters);
        setFilteredMetrics(filtered);
      } else {
        setFilteredMetrics(data);
      }
      
      // Calculate statistics
      const statsData = metricService.calculateAggregatedStats(
        Object.keys(filters).length > 0 ? filteredMetrics : data
      );
      setStats(statsData);
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch metrics'));
      console.error('Error fetching metrics:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Update filters
  const updateFilters = useCallback(
    async (newFilters: typeof filters) => {
      setFilters(newFilters);
      
      try {
        const filtered = await metricService.filterMetrics(newFilters);
        setFilteredMetrics(filtered);
        
        // Update statistics for filtered metrics
        const statsData = metricService.calculateAggregatedStats(filtered);
        setStats(statsData);
      } catch (err) {
        console.error('Error applying filters:', err);
      }
    },
    []
  );

  // Get a specific metric
  const getMetric = useCallback(async (id: string) => {
    try {
      return await metricService.getMetric(id);
    } catch (err) {
      console.error(`Error fetching metric with ID ${id}:`, err);
      return null;
    }
  }, []);

  // Get time series data for a metric
  const getMetricTimeSeries = useCallback(
    async (metricId: string, startDate: Date, endDate: Date, granularity: string) => {
      try {
        return await metricService.getMetricTimeSeries(
          metricId,
          startDate,
          endDate,
          granularity
        );
      } catch (err) {
        console.error(`Error fetching time series for metric ${metricId}:`, err);
        return null;
      }
    },
    []
  );

  // Compare metric between two periods
  const compareMetricPeriods = useCallback(
    async (
      metricId: string,
      currentStart: Date,
      currentEnd: Date,
      previousStart: Date,
      previousEnd: Date,
      granularity: string
    ) => {
      try {
        return await metricService.compareMetricPeriods(
          metricId,
          currentStart,
          currentEnd,
          previousStart,
          previousEnd,
          granularity
        );
      } catch (err) {
        console.error(`Error comparing metric periods for ${metricId}:`, err);
        return null;
      }
    },
    []
  );

  // Load metrics on component mount or when filters change
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    filteredMetrics,
    loading,
    error,
    stats,
    filters,
    updateFilters,
    getMetric,
    getMetricTimeSeries,
    compareMetricPeriods,
    refreshMetrics: fetchMetrics,
  };
}
