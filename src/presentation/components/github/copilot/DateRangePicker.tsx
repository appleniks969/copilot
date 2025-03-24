import React from 'react';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateRangePickerProps {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  dateRange,
  onChange
}) => {
  const presetRanges = [
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 14 Days', days: 14 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'Last 90 Days', days: 90 },
    { label: 'Custom', days: 0 }
  ];
  
  const [activePreset, setActivePreset] = React.useState<number>(2); // Default to 30 days
  const [showCustomRange, setShowCustomRange] = React.useState<boolean>(false);
  
  const formatDateForInput = (date: Date) => {
    return date.toISOString().substring(0, 10); // YYYY-MM-DD format
  };
  
  const handlePresetClick = (preset: { label: string; days: number }, index: number) => {
    setActivePreset(index);
    
    if (preset.days === 0) {
      setShowCustomRange(true);
      return;
    }
    
    setShowCustomRange(false);
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - preset.days);
    
    onChange({ startDate, endDate });
  };
  
  const handleCustomRangeChange = (type: 'start' | 'end', e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    
    if (type === 'start') {
      onChange({
        startDate: newDate,
        endDate: dateRange.endDate
      });
    } else {
      onChange({
        startDate: dateRange.startDate,
        endDate: newDate
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date Range
        </label>
        <div className="flex flex-wrap gap-2">
          {presetRanges.map((preset, index) => (
            <button
              key={preset.label}
              onClick={() => handlePresetClick(preset, index)}
              className={`px-3 py-1 text-sm rounded-md ${
                activePreset === index
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
      
      {showCustomRange && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formatDateForInput(dateRange.startDate)}
              onChange={(e) => handleCustomRangeChange('start', e)}
              max={formatDateForInput(dateRange.endDate)}
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formatDateForInput(dateRange.endDate)}
              onChange={(e) => handleCustomRangeChange('end', e)}
              min={formatDateForInput(dateRange.startDate)}
              max={formatDateForInput(new Date())}
            />
          </div>
        </div>
      )}
      
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Showing data from {dateRange.startDate.toLocaleDateString()} to {dateRange.endDate.toLocaleDateString()}
      </div>
    </div>
  );
};

export default DateRangePicker;
