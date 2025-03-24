import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format } from 'date-fns';
import { Metric, MetricType } from '@/domain/models/Metric';

interface MetricChartProps {
  metric: Metric;
  height?: number | string;
  showGrid?: boolean;
  showLegend?: boolean;
  className?: string;
}

const MetricChart: React.FC<MetricChartProps> = ({
  metric,
  height = 300,
  showGrid = true,
  showLegend = true,
  className = '',
}) => {
  // Format the data for the chart
  const chartData = useMemo(() => {
    return metric.timeSeries.map((point) => ({
      date: format(point.timestamp, 'MMM dd'),
      timestamp: point.timestamp,
      value: point.value,
    }));
  }, [metric.timeSeries]);

  // Get the line color based on metric type
  const getLineColor = () => {
    switch (metric.type) {
      case MetricType.PERCENTAGE:
        return '#8884d8';
      case MetricType.DURATION:
        return '#82ca9d';
      case MetricType.MONETARY:
        return '#ffc658';
      default:
        return '#8884d8';
    }
  };

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded border border-gray-200">
          <p className="font-semibold">{label}</p>
          <p className="text-[#8884d8]">
            {metric.formatValue(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Format the y-axis values based on metric type
  const formatYAxis = (value: number) => {
    return metric.formatValue(value);
  };

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#e0e0e0' }}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          <Line
            type="monotone"
            dataKey="value"
            name={metric.name}
            stroke={getLineColor()}
            activeDot={{ r: 6 }}
            dot={{ r: 3 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricChart;
