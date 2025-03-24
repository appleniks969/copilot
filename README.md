# GitHub Copilot Metrics Dashboard

A powerful, data-driven dashboard for tracking GitHub Copilot usage across your organization using the official GitHub API.

## Features

- **Real-time Copilot Usage Data**: Integrates with GitHub's official Copilot usage API
- **Organization-wide Analytics**: View usage patterns across your entire organization
- **Team-specific Insights**: Analyze how different teams are using Copilot
- **User Activity Tracking**: See which users are actively using Copilot and their efficiency
- **Repository Analysis**: Identify which repositories benefit most from Copilot
- **Interactive UI**: Filter by date ranges, organizations, and teams

## API Integration

This dashboard integrates with the GitHub API to fetch real Copilot usage data:

- [Copilot Usage for Organization Members API](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28#get-a-summary-of-copilot-usage-for-organization-members)
- [Copilot Usage for Team API](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28#get-a-summary-of-copilot-usage-for-a-team)

For detailed setup instructions, see [SETUP.md](./SETUP.md).

## Getting Started

### Prerequisites

- Node.js 16.x or newer
- GitHub account with admin access to an organization using Copilot
- Personal Access Token with appropriate permissions (see Setup Guide)

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd metrics-dashboard
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create your configuration
   ```
   cp .env.example .env.local
   ```
   Then edit `.env.local` to add your GitHub API token.

4. Run the development server
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Dashboard Overview

### Main Dashboard
The main dashboard provides an at-a-glance view of your organization's Copilot usage, including:

- Active vs. inactive user counts
- Suggestion acceptance rates
- Total suggestions generated
- Most active repositories
- Usage trends over time

### User Activity
The Users view allows you to:

- See which users are actively using Copilot
- Track individual acceptance rates
- Identify power users and those who might need training
- Monitor usage patterns by user

### Repository Analytics
The Repositories view shows:

- Which codebases benefit most from Copilot
- Acceptance rates by repository
- Most active repositories
- Opportunities for increased adoption

## Technology Stack

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Domain-Driven Design**: Clean architecture separating business logic from infrastructure
- **GitHub API**: Real-time data from GitHub's official API

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- GitHub for providing the Copilot usage API
- Microsoft for the original Copilot Metrics Dashboard concept

For detailed setup instructions, particularly for GitHub API integration, see [SETUP.md](./SETUP.md).
