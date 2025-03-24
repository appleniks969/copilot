import { useState, useEffect, useCallback } from 'react';
import { Dashboard, SectionType, Position } from '@/domain/models/Dashboard';
import { dashboardService } from '@/application/services/DashboardService';

// Hook for working with dashboards
export function useDashboard(dashboardId?: string) {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [analytics, setAnalytics] = useState({
    totalMetrics: 0,
    metricsImproving: 0,
    metricsDeclining: 0,
    averageChangePercentage: 0,
  });

  // Fetch all dashboards
  const fetchDashboards = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dashboardService.getAllDashboards();
      setDashboards(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch dashboards'));
      console.error('Error fetching dashboards:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a specific dashboard
  const fetchDashboard = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await dashboardService.getDashboard(id);
      setDashboard(data);
      
      if (data) {
        // Get analytics for the dashboard
        const analyticsData = await dashboardService.getDashboardAnalytics(id);
        setAnalytics(analyticsData);
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch dashboard with ID ${id}`));
      console.error(`Error fetching dashboard with ID ${id}:`, err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new dashboard
  const createDashboard = useCallback(
    async (
      title: string,
      description: string,
      owner: string,
      metricIds: string[] = [],
      metadata?: Record<string, any>
    ) => {
      try {
        const newDashboard = await dashboardService.createDashboard(
          title,
          description,
          owner,
          metricIds,
          metadata
        );
        
        // Update the dashboards list
        setDashboards((prev) => [...prev, newDashboard]);
        
        return newDashboard;
      } catch (err) {
        console.error('Error creating dashboard:', err);
        throw err;
      }
    },
    []
  );

  // Update a dashboard
  const updateDashboard = useCallback(async (updatedDashboard: Dashboard) => {
    try {
      const result = await dashboardService.updateDashboard(updatedDashboard);
      
      // Update the state if this is the currently selected dashboard
      if (dashboard && dashboard.id === result.id) {
        setDashboard(result);
      }
      
      // Update the dashboards list
      setDashboards((prev) =>
        prev.map((d) => (d.id === result.id ? result : d))
      );
      
      return result;
    } catch (err) {
      console.error(`Error updating dashboard ${updatedDashboard.id}:`, err);
      throw err;
    }
  }, [dashboard]);

  // Delete a dashboard
  const deleteDashboard = useCallback(async (id: string) => {
    try {
      const result = await dashboardService.deleteDashboard(id);
      
      if (result) {
        // Remove from the dashboards list
        setDashboards((prev) => prev.filter((d) => d.id !== id));
        
        // Clear the current dashboard if it was deleted
        if (dashboard && dashboard.id === id) {
          setDashboard(null);
        }
      }
      
      return result;
    } catch (err) {
      console.error(`Error deleting dashboard ${id}:`, err);
      throw err;
    }
  }, [dashboard]);

  // Add a section to the dashboard
  const addSection = useCallback(
    async (
      name: string,
      type: SectionType,
      metricIds: string[],
      position: Position
    ) => {
      if (!dashboard) {
        throw new Error('No dashboard selected');
      }
      
      try {
        const result = await dashboardService.addSection(
          dashboard.id,
          name,
          type,
          metricIds,
          position
        );
        
        if (result) {
          setDashboard(result);
        }
        
        return result;
      } catch (err) {
        console.error(`Error adding section to dashboard ${dashboard.id}:`, err);
        throw err;
      }
    },
    [dashboard]
  );

  // Remove a section from the dashboard
  const removeSection = useCallback(
    async (sectionId: string) => {
      if (!dashboard) {
        throw new Error('No dashboard selected');
      }
      
      try {
        const result = await dashboardService.removeSection(dashboard.id, sectionId);
        
        if (result) {
          setDashboard(result);
        }
        
        return result;
      } catch (err) {
        console.error(`Error removing section ${sectionId} from dashboard ${dashboard.id}:`, err);
        throw err;
      }
    },
    [dashboard]
  );

  // Add metrics to the dashboard
  const addMetricsToDashboard = useCallback(
    async (metricIds: string[]) => {
      if (!dashboard) {
        throw new Error('No dashboard selected');
      }
      
      try {
        const result = await dashboardService.addMetricsToDashboard(
          dashboard.id,
          metricIds
        );
        
        if (result) {
          setDashboard(result);
        }
        
        return result;
      } catch (err) {
        console.error(`Error adding metrics to dashboard ${dashboard.id}:`, err);
        throw err;
      }
    },
    [dashboard]
  );

  // Load dashboards on component mount
  useEffect(() => {
    fetchDashboards();
  }, [fetchDashboards]);

  // Load specific dashboard if ID is provided
  useEffect(() => {
    if (dashboardId) {
      fetchDashboard(dashboardId);
    }
  }, [dashboardId, fetchDashboard]);

  return {
    dashboard,
    dashboards,
    loading,
    error,
    analytics,
    createDashboard,
    updateDashboard,
    deleteDashboard,
    addSection,
    removeSection,
    addMetricsToDashboard,
    refreshDashboard: dashboardId ? () => fetchDashboard(dashboardId) : undefined,
    refreshDashboards: fetchDashboards,
  };
}
