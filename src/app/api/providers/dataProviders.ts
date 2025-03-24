import { InMemoryMetricRepository } from '@/infrastructure/repositories/InMemoryMetricRepository';
import { InMemoryDashboardRepository } from '@/infrastructure/repositories/InMemoryDashboardRepository';
import { MetricService } from '@/application/services/MetricService';
import { DashboardService } from '@/application/services/DashboardService';
import { Metric, createMetric } from '@/domain/entities/Metric';
import { Dashboard, createDashboard, createWidget } from '@/domain/entities/Dashboard';

// Instantiate repositories
const metricRepository = new InMemoryMetricRepository();
const dashboardRepository = new InMemoryDashboardRepository();

// Instantiate services
const metricService = new MetricService(metricRepository);
const dashboardService = new DashboardService(dashboardRepository, metricService);

// Initialize sample data

// Metrics
async function initializeSampleMetrics() {
  const metrics = [
    createMetric('api_calls', 'API Calls', 'count', 'daily', 2400000),
    createMetric('response_time', 'Average Response Time', 'duration', 'hourly', 245),
    createMetric('error_rate', 'Error Rate', 'percentage', 'daily', 0.07),
    createMetric('active_users', 'Active Users', 'count', 'daily', 45800),
    createMetric('cpu_usage', 'CPU Usage', 'percentage', 'hourly', 62),
    createMetric('memory_usage', 'Memory Usage', 'percentage', 'hourly', 78),
    createMetric('storage_usage', 'Storage Usage', 'percentage', 'daily', 45),
    createMetric('network_throughput', 'Network Throughput', 'count', 'hourly', 1250),
    createMetric('conversion_rate', 'Conversion Rate', 'percentage', 'daily', 3.2),
    createMetric('average_session_duration', 'Avg Session Duration', 'duration', 'daily', 320),
  ];

  // Add thresholds to some metrics
  metrics[2].thresholds = { warning: 0.05, critical: 0.1 }; // Error Rate
  metrics[4].thresholds = { warning: 75, critical: 90 }; // CPU Usage
  metrics[5].thresholds = { warning: 80, critical: 95 }; // Memory Usage
  metrics[6].thresholds = { warning: 75, critical: 90 }; // Storage Usage

  // Add history data
  metrics.forEach(metric => {
    const now = new Date();
    const history = [];
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      
      let value = metric.currentValue;
      
      // Add some random variation to make the charts interesting
      const randomFactor = 1 + (Math.random() * 0.4 - 0.2); // +/- 20%
      value = Math.round(value * randomFactor * 100) / 100;
      
      // Add seasonality - weekends have lower API calls and active users
      if (['api_calls', 'active_users'].includes(metric.key)) {
        const day = date.getDay();
        if (day === 0 || day === 6) { // Weekend
          value = value * 0.7; // 30% less on weekends
        }
      }
      
      history.push({
        value,
        timestamp: date
      });
    }
    
    metric.history = history;
  });

  // Save metrics
  for (const metric of metrics) {
    await metricRepository.save(metric);
  }
}

// Dashboards
async function initializeSampleDashboards() {
  // API Performance Dashboard
  const apiDashboard = createDashboard(
    'API Performance',
    'Monitor API performance and health',
    'admin@example.com'
  );
  
  // Get metric IDs
  const apiCallsMetric = await metricRepository.getAll({ search: 'API Calls' });
  const responseTimeMetric = await metricRepository.getAll({ search: 'Response Time' });
  const errorRateMetric = await metricRepository.getAll({ search: 'Error Rate' });
  
  const apiCallsWidget = createWidget(
    'API Calls Over Time',
    'lineChart',
    'large',
    apiCallsMetric.map(m => m.id),
    { x: 0, y: 0, width: 8, height: 4 }
  );
  
  const responseTimeWidget = createWidget(
    'Response Time',
    'lineChart',
    'medium',
    responseTimeMetric.map(m => m.id),
    { x: 0, y: 4, width: 4, height: 4 }
  );
  
  const errorRateWidget = createWidget(
    'Error Rate',
    'gauge',
    'medium',
    errorRateMetric.map(m => m.id),
    { x: 4, y: 4, width: 4, height: 4 }
  );
  
  apiDashboard.widgets = [apiCallsWidget, responseTimeWidget, errorRateWidget];
  await dashboardRepository.save(apiDashboard);
  
  // Infrastructure Dashboard
  const infraDashboard = createDashboard(
    'Infrastructure Health',
    'Monitor infrastructure health and performance',
    'admin@example.com'
  );
  
  const cpuMetric = await metricRepository.getAll({ search: 'CPU Usage' });
  const memoryMetric = await metricRepository.getAll({ search: 'Memory Usage' });
  const storageMetric = await metricRepository.getAll({ search: 'Storage Usage' });
  const networkMetric = await metricRepository.getAll({ search: 'Network' });
  
  const cpuWidget = createWidget(
    'CPU Usage',
    'gauge',
    'small',
    cpuMetric.map(m => m.id),
    { x: 0, y: 0, width: 3, height: 3 }
  );
  
  const memoryWidget = createWidget(
    'Memory Usage',
    'gauge',
    'small',
    memoryMetric.map(m => m.id),
    { x: 3, y: 0, width: 3, height: 3 }
  );
  
  const storageWidget = createWidget(
    'Storage Usage',
    'gauge',
    'small',
    storageMetric.map(m => m.id),
    { x: 6, y: 0, width: 3, height: 3 }
  );
  
  const networkWidget = createWidget(
    'Network Throughput',
    'lineChart',
    'large',
    networkMetric.map(m => m.id),
    { x: 0, y: 3, width: 9, height: 4 }
  );
  
  infraDashboard.widgets = [cpuWidget, memoryWidget, storageWidget, networkWidget];
  await dashboardRepository.save(infraDashboard);
  
  // User Engagement Dashboard
  const userDashboard = createDashboard(
    'User Engagement',
    'Track user engagement and behavior',
    'admin@example.com'
  );
  
  const activeUsersMetric = await metricRepository.getAll({ search: 'Active Users' });
  const conversionMetric = await metricRepository.getAll({ search: 'Conversion' });
  const sessionMetric = await metricRepository.getAll({ search: 'Session' });
  
  const usersWidget = createWidget(
    'Active Users',
    'lineChart',
    'large',
    activeUsersMetric.map(m => m.id),
    { x: 0, y: 0, width: 8, height: 4 }
  );
  
  const conversionWidget = createWidget(
    'Conversion Rate',
    'lineChart',
    'medium',
    conversionMetric.map(m => m.id),
    { x: 0, y: 4, width: 4, height: 4 }
  );
  
  const sessionWidget = createWidget(
    'Session Duration',
    'barChart',
    'medium',
    sessionMetric.map(m => m.id),
    { x: 4, y: 4, width: 4, height: 4 }
  );
  
  userDashboard.widgets = [usersWidget, conversionWidget, sessionWidget];
  await dashboardRepository.save(userDashboard);
}

// Initialize data when server starts
let initialized = false;

export async function ensureInitialized() {
  if (!initialized) {
    await initializeSampleMetrics();
    await initializeSampleDashboards();
    initialized = true;
  }
}

// Export services for API routes
export { metricService, dashboardService };
