/**
 * Service for handling dashboard-related business logic
 */
import { Dashboard, Widget, createDashboard, createWidget } from '../../domain/entities/Dashboard';
import { IDashboardRepository, DashboardFilter } from '../../domain/repositories/DashboardRepository';
import { MetricService } from './MetricService';

export class DashboardService {
  constructor(
    private dashboardRepository: IDashboardRepository,
    private metricService: MetricService
  ) {}

  /**
   * Get a dashboard by its ID with its metrics data
   */
  async getDashboardById(id: string): Promise<Dashboard | null> {
    const dashboard = await this.dashboardRepository.getById(id);
    if (!dashboard) {
      return null;
    }
    
    return dashboard;
  }

  /**
   * Get all dashboards with optional filtering
   */
  async getAllDashboards(filter?: DashboardFilter): Promise<Dashboard[]> {
    return this.dashboardRepository.getAll(filter);
  }

  /**
   * Create a new dashboard
   */
  async createDashboard(name: string, description: string, owner: string): Promise<Dashboard> {
    const dashboard = createDashboard(name, description, owner);
    return this.dashboardRepository.save(dashboard);
  }

  /**
   * Update dashboard properties
   */
  async updateDashboard(id: string, updates: Partial<Dashboard>): Promise<Dashboard> {
    const dashboard = await this.dashboardRepository.getById(id);
    if (!dashboard) {
      throw new Error(`Dashboard with ID ${id} not found`);
    }
    
    const updatedDashboard: Dashboard = {
      ...dashboard,
      ...updates,
      updatedAt: new Date()
    };
    
    return this.dashboardRepository.save(updatedDashboard);
  }

  /**
   * Delete a dashboard
   */
  async deleteDashboard(id: string): Promise<boolean> {
    return this.dashboardRepository.delete(id);
  }

  /**
   * Add a widget to a dashboard
   */
  async addWidget(
    dashboardId: string,
    title: string,
    type: Widget['type'],
    size: Widget['size'],
    metricIds: string[],
    position: Widget['position']
  ): Promise<Dashboard> {
    const dashboard = await this.dashboardRepository.getById(dashboardId);
    if (!dashboard) {
      throw new Error(`Dashboard with ID ${dashboardId} not found`);
    }
    
    // Verify all metrics exist
    for (const metricId of metricIds) {
      const metric = await this.metricService.getMetricById(metricId);
      if (!metric) {
        throw new Error(`Metric with ID ${metricId} not found`);
      }
    }
    
    const widget = createWidget(title, type, size, metricIds, position);
    return this.dashboardRepository.addWidget(dashboardId, widget);
  }

  /**
   * Update a widget on a dashboard
   */
  async updateWidget(dashboardId: string, widgetId: string, updates: Partial<Widget>): Promise<Dashboard> {
    const dashboard = await this.dashboardRepository.getById(dashboardId);
    if (!dashboard) {
      throw new Error(`Dashboard with ID ${dashboardId} not found`);
    }
    
    const widgetIndex = dashboard.widgets.findIndex(w => w.id === widgetId);
    if (widgetIndex === -1) {
      throw new Error(`Widget with ID ${widgetId} not found on dashboard`);
    }
    
    const updatedWidget = {
      ...dashboard.widgets[widgetIndex],
      ...updates
    };
    
    return this.dashboardRepository.updateWidget(dashboardId, updatedWidget);
  }

  /**
   * Remove a widget from a dashboard
   */
  async removeWidget(dashboardId: string, widgetId: string): Promise<Dashboard> {
    return this.dashboardRepository.removeWidget(dashboardId, widgetId);
  }

  /**
   * Set a dashboard as the default for a user
   */
  async setAsDefault(id: string, userId: string): Promise<boolean> {
    return this.dashboardRepository.setDefault(id, userId);
  }
}
