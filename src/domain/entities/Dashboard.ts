/**
 * Dashboard entity represents a collection of widgets displaying metrics
 */
import { Metric } from './Metric';

export type WidgetSize = 'small' | 'medium' | 'large';
export type WidgetType = 'counter' | 'gauge' | 'lineChart' | 'barChart' | 'table' | 'statusCard';

export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  size: WidgetSize;
  metricIds: string[];
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  config?: Record<string, any>;
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: Widget[];
  owner: string;
  isDefault?: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Factory function to create a new Dashboard
 */
export function createDashboard(name: string, description: string, owner: string): Dashboard {
  return {
    id: crypto.randomUUID(),
    name,
    description,
    widgets: [],
    owner,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

/**
 * Factory function to create a new Widget
 */
export function createWidget(
  title: string,
  type: WidgetType,
  size: WidgetSize,
  metricIds: string[],
  position: { x: number; y: number; width: number; height: number }
): Widget {
  return {
    id: crypto.randomUUID(),
    title,
    type,
    size,
    metricIds,
    position,
    config: {}
  };
}
