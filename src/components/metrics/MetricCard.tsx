import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/react/24/solid';
import { Metric, MetricTrend } from '@/domain/models/Metric';
import Card from '../ui/Card';

interface MetricCardProps {
  metric: Metric;
  onClick?: (metric: Metric) => void;
  className?: string;
  showChart?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  onClick,
  className = '',
  showChart = false,
}) => {
  // Format the metric value
  const formattedValue = metric.formatValue(metric.value.current);
  const formattedChange = metric.formatValue(Math.abs(metric.value.change));
  const changePercent = metric.changePercentage.toFixed(1);
  
  // Determine if "up" is good or bad for this metric
  const isDownBetter =
    metric.name.toLowerCase().includes('error') ||
    metric.name.toLowerCase().includes('latency') ||
    metric.name.toLowerCase().includes('response time');
  
  // Determine trend color
  const getTrendColor = () => {
    if (metric.value.trend === MetricTrend.UP) {
      return isDownBetter ? 'text-red-500' : 'text-green-500';
    } else if (metric.value.trend === MetricTrend.DOWN) {
      return isDownBetter ? 'text-green-500' : 'text-red-500';
    }
    return 'text-gray-500';
  };
  
  // Get the trend icon
  const getTrendIcon = () => {
    switch (metric.value.trend) {
      case MetricTrend.UP:
        return <ArrowUpIcon className="h-4 w-4" />;
      case MetricTrend.DOWN:
        return <ArrowDownIcon className="h-4 w-4" />;
      default:
        return <MinusIcon className="h-4 w-4" />;
    }
  };

  return (
    <Card
      title={metric.name}
      subtitle={metric.description}
      className={`${className} ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={onClick ? () => onClick(metric) : undefined}
    >
      <div className="flex flex-col">
        {/* Value and trend */}
        <div className="flex justify-between items-baseline">
          <div className="text-2xl font-bold">{formattedValue}</div>
          <div className={`flex items-center ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="ml-1">{changePercent}%</span>
          </div>
        </div>
        
        {/* Previous period comparison */}
        <div className="mt-1 text-sm text-gray-500">
          {metric.value.trend === MetricTrend.UP && `+${formattedChange}`}
          {metric.value.trend === MetricTrend.DOWN && `-${formattedChange}`}
          {metric.value.trend === MetricTrend.NEUTRAL && `No change`}
          <span className="ml-1">vs previous period</span>
        </div>
        
        {/* Mini chart if enabled */}
        {showChart && metric.timeSeries.length > 0 && (
          <div className="h-16 mt-4">
            {/* Replace with your charting component */}
            <div className="w-full h-full bg-gray-100 rounded">
              {/* Chart placeholder */}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;
