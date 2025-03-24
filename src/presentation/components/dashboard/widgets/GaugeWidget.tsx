import React from 'react';

interface GaugeThreshold {
  value: number;
  color: string;
}

interface GaugeWidgetProps {
  title: string;
  data: {
    value: number;
    min: number;
    max: number;
    thresholds: GaugeThreshold[];
  };
  format?: (value: number) => string;
}

const GaugeWidget: React.FC<GaugeWidgetProps> = ({ 
  title, 
  data,
  format = (value) => value.toString()
}) => {
  const { value, min, max, thresholds } = data;
  
  // Calculate percentage for gauge positioning
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  
  // Calculate rotation for the gauge needle (0 is straight down, 180 is straight up)
  const needleRotation = -90 + (percentage * 1.8); // 180 degrees of motion
  
  // Get color based on thresholds
  const getColor = () => {
    const activeThreshold = thresholds
      .slice()
      .sort((a, b) => a.value - b.value)
      .find(threshold => value <= threshold.value);
      
    return activeThreshold ? activeThreshold.color : thresholds[thresholds.length - 1].color;
  };
  
  const color = getColor();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
        <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-20 overflow-hidden mt-2">
          {/* Semi-circle background */}
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-t-full"></div>
          
          {/* Colored arc based on value */}
          <div 
            className="absolute inset-0 rounded-t-full"
            style={{
              background: `conic-gradient(
                ${color} 0deg,
                ${color} ${percentage * 1.8}deg,
                transparent ${percentage * 1.8}deg,
                transparent 180deg
              )`,
              transform: 'rotate(-90deg)',
              transformOrigin: 'center bottom'
            }}
          ></div>
          
          {/* Gauge needle */}
          <div 
            className="absolute bottom-0 left-1/2 w-1 h-16 bg-gray-800 dark:bg-gray-200"
            style={{
              transformOrigin: 'bottom center',
              transform: `translateX(-50%) rotate(${needleRotation}deg)`
            }}
          >
            <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-gray-800 dark:bg-gray-200"></div>
          </div>
          
          {/* Center point */}
          <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-2 border-gray-800 dark:border-gray-200 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="flex justify-between w-full px-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>{format(min)}</span>
          {thresholds.map((threshold, i) => (
            <span 
              key={i} 
              className="absolute" 
              style={{ 
                left: `${((threshold.value - min) / (max - min)) * 100}%`,
                transform: 'translateX(-50%)'
              }}
            >
              |
            </span>
          ))}
          <span>{format(max)}</span>
        </div>
        
        <div className="mt-4 text-2xl font-bold" style={{ color }}>
          {format(value)}
        </div>
      </div>
    </div>
  );
};

export default GaugeWidget;
