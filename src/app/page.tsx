import Link from 'next/link';
import MetricsHighlightCard from '../presentation/components/metrics/MetricsHighlightCard';

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">GitHub Copilot Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Link
            href="/github/copilot"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center"
          >
            Go to Dashboard
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsHighlightCard 
          title="Active Copilot Users" 
          value="15 / 23" 
          change="+8.7%"
          trend="up"
        />
        <MetricsHighlightCard 
          title="Suggestion Acceptance Rate" 
          value="63.2%" 
          change="+5.3%"
          trend="up"
          isGoodTrend={true}
        />
        <MetricsHighlightCard 
          title="Total Suggestions" 
          value="24.8K" 
          change="+12.5%"
          trend="up"
        />
        <MetricsHighlightCard 
          title="Repositories Using Copilot" 
          value="6" 
          change="+2"
          trend="up"
        />
      </div>
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Get detailed insights into your GitHub Copilot usage
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Understand how your teams are using GitHub Copilot with detailed metrics, analytics, and reporting.
          Track usage across organizations and teams to maximize the value of your GitHub Copilot investment.
        </p>
        <Link
          href="/github/copilot"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md shadow-sm inline-flex items-center"
        >
          Go to Copilot Dashboard
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
