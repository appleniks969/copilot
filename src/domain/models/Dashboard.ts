import { Metric } from './Metric';

// Enum for dashboard section types
export enum SectionType {
  OVERVIEW = 'overview',
  METRICS = 'metrics',
  CHARTS = 'charts',
  CUSTOM = 'custom',
}

// Interface for layout positions
export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Interface for dashboard section
export interface DashboardSection {
  id: string;
  name: string;
  type: SectionType;
  metrics: string[]; // Metric IDs included in this section
  position: Position;
  metadata?: Record<string, any>;
}

// Core Dashboard class
export class Dashboard {
  constructor(
    private readonly _id: string,
    private readonly _title: string,
    private readonly _description: string,
    private readonly _sections: DashboardSection[],
    private readonly _metrics: Metric[],
    private readonly _owner: string,
    private readonly _lastUpdated: Date,
    private readonly _metadata?: Record<string, any>
  ) {}

  // Getters for immutable properties
  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get sections(): DashboardSection[] {
    return [...this._sections]; // Return a copy to maintain immutability
  }

  get metrics(): Metric[] {
    return [...this._metrics]; // Return a copy to maintain immutability
  }

  get owner(): string {
    return this._owner;
  }

  get lastUpdated(): Date {
    return new Date(this._lastUpdated);
  }

  get metadata(): Record<string, any> | undefined {
    return this._metadata ? { ...this._metadata } : undefined;
  }

  // Get metrics for a specific section
  getMetricsBySection(sectionId: string): Metric[] {
    const section = this._sections.find((s) => s.id === sectionId);
    if (!section) return [];

    return this._metrics.filter((metric) => section.metrics.includes(metric.id));
  }

  // Update metrics in the dashboard
  withUpdatedMetrics(updatedMetrics: Metric[]): Dashboard {
    // Create a map of existing metrics by ID
    const metricsMap = new Map(this._metrics.map((m) => [m.id, m]));

    // Update the map with new metrics
    updatedMetrics.forEach((metric) => {
      metricsMap.set(metric.id, metric);
    });

    // Create a new array of metrics
    const newMetrics = Array.from(metricsMap.values());

    return new Dashboard(
      this._id,
      this._title,
      this._description,
      this._sections,
      newMetrics,
      this._owner,
      new Date(), // Update the lastUpdated timestamp
      this._metadata
    );
  }

  // Create a dashboard with updated sections
  withUpdatedSections(updatedSections: DashboardSection[]): Dashboard {
    return new Dashboard(
      this._id,
      this._title,
      this._description,
      updatedSections,
      this._metrics,
      this._owner,
      new Date(), // Update the lastUpdated timestamp
      this._metadata
    );
  }

  // Static method to create a dashboard from raw data
  static fromRawData(data: any, metrics: Metric[]): Dashboard {
    return new Dashboard(
      data.id,
      data.title,
      data.description || '',
      data.sections || [],
      metrics,
      data.owner || 'Unknown',
      new Date(data.lastUpdated || Date.now()),
      data.metadata
    );
  }
}
