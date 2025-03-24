import { Dashboard, SectionType } from '@/domain/models/Dashboard';
import { DashboardRepository } from '@/domain/repositories/DashboardRepository';
import apiClient from '../api/apiClient';
import { apiMetricRepository } from './ApiMetricRepository';

// Implementation of the DashboardRepository interface using the API client
export class ApiDashboardRepository implements DashboardRepository {
  async getAllDashboards(): Promise<Dashboard[]> {
    try {
      const data = await apiClient.get<any[]>('/dashboards');
      
      // Fetch metrics for each dashboard
      const dashboards = await Promise.all(
        data.map(async (dashboardData) => {
          const metrics = await apiMetricRepository.getAllMetrics();
          return Dashboard.fromRawData(dashboardData, metrics);
        })
      );
      
      return dashboards;
    } catch (error) {
      console.error('Error fetching dashboards:', error);
      
      // Fallback to mock data if API is unavailable
      return this.getMockDashboards();
    }
  }

  async getDashboardById(id: string): Promise<Dashboard | null> {
    try {
      const data = await apiClient.get<any>(`/dashboards/${id}`);
      
      // Fetch metrics for this dashboard
      const metrics = await apiMetricRepository.getAllMetrics();
      
      return Dashboard.fromRawData(data, metrics);
    } catch (error) {
      console.error(`Error fetching dashboard with ID ${id}:`, error);
      
      // Return the first mock dashboard as a fallback
      const mockDashboards = await this.getMockDashboards();
      return mockDashboards[0] || null;
    }
  }

  async getDashboardsByOwner(owner: string): Promise<Dashboard[]> {
    try {
      const data = await apiClient.get<any[]>(`/dashboards?owner=${owner}`);
      
      // Fetch metrics for each dashboard
      const dashboards = await Promise.all(
        data.map(async (dashboardData) => {
          const metrics = await apiMetricRepository.getAllMetrics();
          return Dashboard.fromRawData(dashboardData, metrics);
        })
      );
      
      return dashboards;
    } catch (error) {
      console.error(`Error fetching dashboards for owner ${owner}:`, error);
      throw error;
    }
  }

  async createDashboard(dashboard: Dashboard): Promise<Dashboard> {
    try {
      const data = await apiClient.post<any>('/dashboards', {
        title: dashboard.title,
        description: dashboard.description,
        sections: dashboard.sections,
        owner: dashboard.owner,
        metadata: dashboard.metadata,
      });
      
      // Fetch metrics for the new dashboard
      const metrics = await apiMetricRepository.getAllMetrics();
      
      return Dashboard.fromRawData(data, metrics);
    } catch (error) {
      console.error('Error creating dashboard:', error);
      throw error;
    }
  }

  async updateDashboard(dashboard: Dashboard): Promise<Dashboard> {
    try {
      const data = await apiClient.put<any>(`/dashboards/${dashboard.id}`, {
        id: dashboard.id,
        title: dashboard.title,
        description: dashboard.description,
        sections: dashboard.sections,
        owner: dashboard.owner,
        metadata: dashboard.metadata,
      });
      
      // Use the existing metrics from the dashboard
      return Dashboard.fromRawData(data, dashboard.metrics);
    } catch (error) {
      console.error(`Error updating dashboard ${dashboard.id}:`, error);
      throw error;
    }
  }

  async deleteDashboard(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/dashboards/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting dashboard ${id}:`, error);
      return false;
    }
  }

  // Fallback method for when the API is not available
  async getMockDashboards(): Promise<Dashboard[]> {
    // Get mock metrics
    const metrics = await apiMetricRepository.getMockMetrics();
    
    // Define mock dashboard sections
    const overviewSection = {
      id: 'section-1',
      name: 'Overview',
      type: SectionType.OVERVIEW,
      metrics: metrics.slice(0, 4).map(m => m.id),
      position: { x: 0, y: 0, width: 12, height: 1 },
    };
    
    const performanceSection = {
      id: 'section-2',
      name: 'Performance Metrics',
      type: SectionType.METRICS,
      metrics: metrics.slice(2, 5).map(m => m.id),
      position: { x: 0, y: 1, width: 6, height: 2 },
    };
    
    const usageSection = {
      id: 'section-3',
      name: 'Usage Metrics',
      type: SectionType.CHARTS,
      metrics: metrics.slice(0, 2).map(m => m.id).concat(metrics.slice(4, 6).map(m => m.id)),
      position: { x: 6, y: 1, width: 6, height: 2 },
    };
    
    // Create a mock dashboard
    const mockDashboard = {
      id: 'dashboard-1',
      title: 'Copilot Performance Dashboard',
      description: 'Key metrics for monitoring Copilot performance and usage',
      sections: [overviewSection, performanceSection, usageSection],
      owner: 'admin',
      lastUpdated: new Date(),
      metadata: {
        refreshInterval: 300, // 5 minutes
        version: '1.0',
      },
    };
    
    return [Dashboard.fromRawData(mockDashboard, metrics)];
  }
}

// Create and export a singleton instance
export const apiDashboardRepository = new ApiDashboardRepository();
