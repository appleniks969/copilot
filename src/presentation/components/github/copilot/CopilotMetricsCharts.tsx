import React from 'react';
import { CopilotOrgUsage, CopilotTeamUsage } from '@/domain/entities/github/CopilotUsage';
import LineChartWidget from '../../dashboard/widgets/LineChartWidget';
import BarChartWidget from '../../dashboard/widgets/BarChartWidget';
import GaugeWidget from '../../dashboard/widgets/GaugeWidget';

interface CopilotMetricsChartsProps {
  data: CopilotOrgUsage | CopilotTeamUsage;
  metrics: any;
}

export const CopilotMetricsCharts: React.FC<CopilotMetricsChartsProps> = ({ 
  data, 
  metrics 
}) => {
  // Transform data for charts
  // Assuming data includes usage over time (we'll mock this since the actual API doesn't provide time series)
  const mockDailyData = generateMockDailyData(data);
  
  // Extract top repositories for bar chart
  const topRepoData = metrics.mostActiveRepositories.map((repo: any) => ({
    name: repo.repository_name,
    suggestions: repo.suggestions.shown,
    accepted: repo.suggestions.accepted
  }));
  
  // Repository acceptance rate chart data
  const repoAcceptanceData = metrics.mostEfficientRepositories.map((repo: any) => ({
    name: repo.repository_name,
    rate: (repo.suggestions.accepted / repo.suggestions.shown) * 100
  }));
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <LineChartWidget
            title="Daily Suggestions"
            data={mockDailyData}
            xKey="date"
            yKey="shown"
            color="#4f46e5"
          />
        </div>
        <div>
          <LineChartWidget
            title="Daily Acceptance Rate (%)"
            data={mockDailyData.map(item => ({
              date: item.date,
              value: item.accepted / item.shown * 100
            }))}
            xKey="date"
            yKey="value"
            color="#10b981"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <GaugeWidget
            title="Usage Rate"
            data={{
              value: metrics.usageRate,
              min: 0,
              max: 100,
              thresholds: [
                { value: 30, color: '#ef4444' }, // red
                { value: 50, color: '#f59e0b' }, // amber
                { value: 70, color: '#10b981' }, // green
              ]
            }}
            format={(value) => `${value.toFixed(1)}%`}
          />
        </div>
        <div>
          <GaugeWidget
            title="Acceptance Rate"
            data={{
              value: metrics.acceptanceRate,
              min: 0,
              max: 100,
              thresholds: [
                { value: 30, color: '#ef4444' }, // red
                { value: 50, color: '#f59e0b' }, // amber
                { value: 70, color: '#10b981' }, // green
              ]
            }}
            format={(value) => `${value.toFixed(1)}%`}
          />
        </div>
        <div>
          <GaugeWidget
            title="Active Users"
            data={{
              value: data.aggregated.active_users / data.aggregated.total_users * 100,
              min: 0,
              max: 100,
              thresholds: [
                { value: 30, color: '#ef4444' }, // red
                { value: 50, color: '#f59e0b' }, // amber
                { value: 70, color: '#10b981' }, // green
              ]
            }}
            format={(value) => `${value.toFixed(1)}%`}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <BarChartWidget
            title="Top Repositories by Suggestions"
            data={topRepoData.map(repo => ({
              date: repo.name,
              value: repo.suggestions
            }))}
            xKey="date"
            yKey="value"
            color="#6366f1"
          />
        </div>
        <div>
          <BarChartWidget
            title="Most Efficient Repositories"
            data={repoAcceptanceData.map(repo => ({
              date: repo.name,
              value: repo.rate
            }))}
            xKey="date"
            yKey="value"
            color="#8b5cf6"
          />
        </div>
      </div>
    </div>
  );
};

// Helper function to generate mock daily data
function generateMockDailyData(data: CopilotOrgUsage | CopilotTeamUsage) {
  const startDate = new Date(data.start_time);
  const endDate = new Date(data.end_time);
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // If there's too many days, limit to the last 30
  const daysToShow = Math.min(daysDiff, 30);
  
  // Get total suggestions and acceptances from the data
  const totalShown = data.aggregated.suggestions.shown;
  const totalAccepted = data.aggregated.suggestions.accepted;
  
  // Calculate average per day
  const avgShownPerDay = totalShown / daysDiff;
  const avgAcceptedPerDay = totalAccepted / daysDiff;
  
  // Generate daily data with some random variation
  const dailyData = [];
  for (let i = 0; i < daysToShow; i++) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - (daysToShow - i - 1));
    
    // Add random variation around the average
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    const shown = Math.round(avgShownPerDay * randomFactor);
    
    // Ensure acceptance rate stays reasonable
    const acceptanceRatio = avgAcceptedPerDay / avgShownPerDay;
    const accepted = Math.round(shown * acceptanceRatio * (0.9 + Math.random() * 0.2)); // Vary by ±10%
    
    dailyData.push({
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
      shown,
      accepted
    });
  }
  
  return dailyData;
}

export default CopilotMetricsCharts;
