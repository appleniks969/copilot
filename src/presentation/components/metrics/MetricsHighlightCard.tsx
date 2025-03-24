import React from 'react';

interface MetricsHighlightCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  isGoodTrend?: boolean;
}

const MetricsHighlightCard: React.FC<MetricsHighlightCardProps> = ({ 
  title, 
  value, 
  change, 
  trend,
  isGoodTrend 
}) => {
  // If isGoodTrend is not specified, assume up is good
  const effectiveIsGoodTrend = isGoodTrend === undefined ? trend === 'up' : isGoodTrend;
  
  // Determine if the current trend is positive or negative
  const isPositiveTrend = (trend === 'up' && effectiveIsGoodTrend) || (trend === 'down' && !effectiveIsGoodTrend);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
      <div className="flex items-center justify-between mt-2">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        
        <div className={`flex items-center ${isPositiveTrend ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
          )}
          {trend === 'down' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
            </svg>
          )}
          {trend === 'stable' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a1 1 0 01-1 1H3a1 1 0 110-2h14a1 1 0 011 1z" clipRule="evenodd" />
            </svg>
          )}
          <span className="ml-1 text-sm font-medium">{change}</span>
        </div>
      </div>
    </div>
  );
};

export default MetricsHighlightCard;
