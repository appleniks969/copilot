// Enum for different types of metrics
export enum MetricType {
  COUNT = 'count',
  PERCENTAGE = 'percentage',
  DURATION = 'duration',
  MONETARY = 'monetary',
  RATE = 'rate',
  CUSTOM = 'custom',
}

// Enum for metric trends
export enum MetricTrend {
  UP = 'up',
  DOWN = 'down',
  NEUTRAL = 'neutral',
}

// Interface for metric value aggregates
export interface MetricAggregate {
  current: number;
  previous: number;
  change: number;
  trend: MetricTrend;
}

// Interface for time series data points
export interface TimeSeriesPoint {
  timestamp: Date;
  value: number;
}

// Core Metric class - immutable by design
export class Metric {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _description: string,
    private readonly _type: MetricType,
    private readonly _value: MetricAggregate,
    private readonly _unit: string,
    private readonly _timeSeries: TimeSeriesPoint[],
    private readonly _dimensions?: Record<string, string>,
    private readonly _metadata?: Record<string, any>
  ) {}

  // Getters for immutable properties
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get type(): MetricType {
    return this._type;
  }

  get value(): MetricAggregate {
    return this._value;
  }

  get unit(): string {
    return this._unit;
  }

  get timeSeries(): TimeSeriesPoint[] {
    return [...this._timeSeries]; // Return a copy to maintain immutability
  }

  get dimensions(): Record<string, string> | undefined {
    return this._dimensions ? { ...this._dimensions } : undefined;
  }

  get metadata(): Record<string, any> | undefined {
    return this._metadata ? { ...this._metadata } : undefined;
  }

  // Calculate change percentage
  get changePercentage(): number {
    if (this._value.previous === 0) {
      return this._value.current > 0 ? 100 : 0;
    }
    return (this._value.change / this._value.previous) * 100;
  }

  // Format value based on metric type
  formatValue(value: number): string {
    switch (this._type) {
      case MetricType.PERCENTAGE:
        return `${value.toFixed(2)}%`;
      case MetricType.MONETARY:
        return `$${value.toFixed(2)}`;
      case MetricType.DURATION:
        // Format duration based on unit (seconds, minutes, etc.)
        return `${value.toFixed(2)} ${this._unit}`;
      case MetricType.RATE:
        return `${value.toFixed(2)} ${this._unit}`;
      default:
        return `${value.toFixed(2)} ${this._unit}`;
    }
  }

  // Derive a trend indication from the change
  deriveTrend(change: number): MetricTrend {
    if (change > 0) return MetricTrend.UP;
    if (change < 0) return MetricTrend.DOWN;
    return MetricTrend.NEUTRAL;
  }

  // Create a new Metric with updated values
  withUpdatedValues(newValue: number, newTimeSeries: TimeSeriesPoint[]): Metric {
    const previous = this._value.current;
    const change = newValue - previous;
    const trend = this.deriveTrend(change);

    return new Metric(
      this._id,
      this._name,
      this._description,
      this._type,
      {
        current: newValue,
        previous,
        change,
        trend,
      },
      this._unit,
      [...newTimeSeries],
      this._dimensions,
      this._metadata
    );
  }

  // Static method to create a metric from raw data
  static fromRawData(data: any): Metric {
    const timeSeries = (data.timeSeries || []).map((point: any) => ({
      timestamp: new Date(point.timestamp),
      value: point.value,
    }));

    const current = data.value?.current || 0;
    const previous = data.value?.previous || 0;
    const change = data.value?.change || (current - previous);
    const trend = data.value?.trend || (change > 0 ? MetricTrend.UP : change < 0 ? MetricTrend.DOWN : MetricTrend.NEUTRAL);

    return new Metric(
      data.id,
      data.name,
      data.description || '',
      data.type || MetricType.COUNT,
      {
        current,
        previous, 
        change,
        trend,
      },
      data.unit || '',
      timeSeries,
      data.dimensions,
      data.metadata
    );
  }
}
