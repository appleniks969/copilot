/**
 * In-memory implementation of IDashboardRepository for development and testing
 */
import { Dashboard, Widget } from '../../domain/entities/Dashboard';
import { IDashboardRepository, DashboardFilter } from '../../domain/repositories/DashboardRepository';

export class InMemoryDashboardRepository implements IDashboardRepository {
  private dashboards: Map<string, Dashboard> = new Map();
  private userDefaultDashboards: Map<string, string> = new Map();

  async getById(id: string): Promise<Dashboard | null> {
    const dashboard = this.dashboards.get(id);
    return dashboard ? { ...dashboard } : null;
  }

  async getAll(filter?: DashboardFilter): Promise<Dashboard[]> {
    let dashboards = Array.from(this.dashboards.values()).map(dashboard => ({ ...dashboard }));

    if (filter) {
      // Apply filters
      if (filter.owner) {
        dashboards = dashboards.filter(dashboard => dashboard.owner === filter.owner);
      }

      if (filter.isDefault !== undefined) {
        dashboards = dashboards.filter(dashboard => dashboard.isDefault === filter.isDefault);
      }

      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        dashboards = dashboards.filter(
          dashboard =>
            dashboard.name.toLowerCase().includes(searchLower) ||
            dashboard.description.toLowerCase().includes(searchLower)
        );
      }

      if (filter.tags?.length) {
        dashboards = dashboards.filter(dashboard =>
          dashboard.tags?.some(tag => filter.tags?.includes(tag))
        );
      }
    }

    return dashboards;
  }

  async save(dashboard: Dashboard): Promise<Dashboard> {
    const updatedDashboard = {
      ...dashboard,
      updatedAt: new Date()
    };
    
    this.dashboards.set(dashboard.id, updatedDashboard);
    return { ...updatedDashboard };
  }

  async delete(id: string): Promise<boolean> {
    // Remove from user defaults if it's set as default
    for (const [userId, dashboardId] of this.userDefaultDashboards.entries()) {
      if (dashboardId === id) {
        this.userDefaultDashboards.delete(userId);
      }
    }
    
    return this.dashboards.delete(id);
  }

  async addWidget(dashboardId: string, widget: Widget): Promise<Dashboard> {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) {
      throw new Error(`Dashboard with ID ${dashboardId} not found`);
    }

    const updatedDashboard: Dashboard = {
      ...dashboard,
      widgets: [...dashboard.widgets, widget],
      updatedAt: new Date()
    };

    this.dashboards.set(dashboardId, updatedDashboard);
    return { ...updatedDashboard };
  }

  async updateWidget(dashboardId: string, widget: Widget): Promise<Dashboard> {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) {
      throw new Error(`Dashboard with ID ${dashboardId} not found`);
    }

    const widgetIndex = dashboard.widgets.findIndex(w => w.id === widget.id);
    if (widgetIndex === -1) {
      throw new Error(`Widget with ID ${widget.id} not found on dashboard`);
    }

    const updatedWidgets = [...dashboard.widgets];
    updatedWidgets[widgetIndex] = widget;

    const updatedDashboard: Dashboard = {
      ...dashboard,
      widgets: updatedWidgets,
      updatedAt: new Date()
    };

    this.dashboards.set(dashboardId, updatedDashboard);
    return { ...updatedDashboard };
  }

  async removeWidget(dashboardId: string, widgetId: string): Promise<Dashboard> {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) {
      throw new Error(`Dashboard with ID ${dashboardId} not found`);
    }

    const updatedDashboard: Dashboard = {
      ...dashboard,
      widgets: dashboard.widgets.filter(w => w.id !== widgetId),
      updatedAt: new Date()
    };

    this.dashboards.set(dashboardId, updatedDashboard);
    return { ...updatedDashboard };
  }

  async setDefault(id: string, userId: string): Promise<boolean> {
    const dashboard = this.dashboards.get(id);
    if (!dashboard) {
      return false;
    }

    this.userDefaultDashboards.set(userId, id);
    return true;
  }
}
