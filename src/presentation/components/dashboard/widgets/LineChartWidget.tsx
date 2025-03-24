import React from 'react';

interface LineChartWidgetProps {
  title: string;
  data: Array<Record<string, any>>;
  xKey: string;
  yKey: string;
  color?: string;
}

const LineChartWidget: React.FC<LineChartWidgetProps> = ({ 
  title, 
  data, 
  xKey, 
  yKey, 
  color = '#4C51BF' 
}) => {
  // Calculate chart dimensions and scales for SVG
  const chartWidth = 100;
  const chartHeight = 50;
  const padding = 5;
  
  // Find min and max y values
  const yValues = data.map(d => d[yKey]);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  
  // Create path for the line
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (chartWidth - padding * 2) + padding;
    const y = chartHeight - ((d[yKey] - minY) / (maxY - minY)) * (chartHeight - padding * 2) - padding;
    return `${x},${y}`;
  });
  
  const linePath = `M ${points.join(' L ')}`;
  
  // Calculate the trend (last value compared to first value)
  const trend = data[data.length - 1][yKey] > data[0][yKey] ? 'up' : 'down';
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span className="mr-2">Last 7 days</span>
          <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex items-end space-x-2">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {data[data.length - 1][yKey]}
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">ms</span>
        </div>
        
        <div className={`flex items-center ${trend === 'down' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'down' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
          )}
          <span className="ml-1 text-sm font-medium">
            {Math.abs(((data[data.length - 1][yKey] - data[0][yKey]) / data[0][yKey]) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
      
      <div className="mt-4">
        <svg width="100%" height="100" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
        {data.map((d, i) => (
          i % Math.ceil(data.length / 5) === 0 || i === data.length - 1 ? (
            <div key={i}>{d[xKey].toString().substring(5)}</div>
          ) : <div key={i}></div>
        ))}
      </div>
    </div>
  );
};

export default LineChartWidget;
