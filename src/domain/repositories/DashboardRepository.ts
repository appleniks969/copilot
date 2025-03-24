/**
 * Repository interface for Dashboard entities
 */
import { Dashboard, Widget } from '../entities/Dashboard';

export interface DashboardFilter {
  owner?: string;
  search?: string;
  tags?: string[];
  isDefault?: boolean;
}

export interface IDashboardRepository {
  /**
   * Get a dashboard by its ID
   */
  getById(id: string): Promise<Dashboard | null>;
  
  /**
   * Get all dashboards with optional filtering
   */
  getAll(filter?: DashboardFilter): Promise<Dashboard[]>;
  
  /**
   * Save a dashboard (create or update)
   */
  save(dashboard: Dashboard): Promise<Dashboard>;
  
  /**
   * Delete a dashboard by its ID
   */
  delete(id: string): Promise<boolean>;
  
  /**
   * Add a widget to a dashboard
   */
  addWidget(dashboardId: string, widget: Widget): Promise<Dashboard>;
  
  /**
   * Update a widget on a dashboard
   */
  updateWidget(dashboardId: string, widget: Widget): Promise<Dashboard>;
  
  /**
   * Remove a widget from a dashboard
   */
  removeWidget(dashboardId: string, widgetId: string): Promise<Dashboard>;
  
  /**
   * Set a dashboard as the default for a user
   */
  setDefault(id: string, userId: string): Promise<boolean>;
}
