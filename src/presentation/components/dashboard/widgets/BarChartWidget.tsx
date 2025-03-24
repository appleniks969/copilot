import React from 'react';

interface BarChartWidgetProps {
  title: string;
  data: Array<Record<string, any>>;
  xKey: string;
  yKey: string;
  color?: string;
}

const BarChartWidget: React.FC<BarChartWidgetProps> = ({ 
  title, 
  data, 
  xKey, 
  yKey, 
  color = '#10B981' 
}) => {
  // Calculate chart dimensions for SVG
  const chartWidth = 100;
  const chartHeight = 60;
  const padding = 5;
  const barPadding = 0.2;
  
  // Find max y value for scaling
  const maxY = Math.max(...data.map(d => d[yKey]));
  
  // Calculate bar width based on number of bars
  const barWidth = (chartWidth / data.length) * (1 - barPadding);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
        <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
      
      <div className="mt-2">
        <svg width="100%" height="120" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
          {data.map((d, i) => {
            const barHeight = (d[yKey] / maxY) * (chartHeight - padding * 2);
            const xPos = (i * (chartWidth / data.length)) + (barPadding * (chartWidth / data.length) / 2);
            const yPos = chartHeight - barHeight - padding;
            
            return (
              <rect
                key={i}
                x={xPos}
                y={yPos}
                width={barWidth}
                height={barHeight}
                fill={color}
                rx="1"
                ry="1"
              />
            );
          })}
        </svg>
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
        {data.map((d, i) => (
          <div key={i} className="text-center" style={{ width: `${100 / data.length}%` }}>
            {d[xKey]}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-4 text-sm">
        <span className="text-gray-500 dark:text-gray-400">Total: {data.reduce((sum, d) => sum + d[yKey], 0)}</span>
        <span className="text-gray-500 dark:text-gray-400">Avg: {(data.reduce((sum, d) => sum + d[yKey], 0) / data.length).toFixed(0)}/day</span>
      </div>
    </div>
  );
};

export default BarChartWidget;
