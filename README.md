# Enhanced GitHub Copilot Metrics Dashboard

A powerful, extensible metrics visualization dashboard built with Next.js, TypeScript, and a domain-driven design architecture. This project provides comprehensive analytics for GitHub Copilot usage across your organization and teams.

## Features

- **GitHub Copilot Analytics**: Track Copilot usage, acceptance rates, and productivity metrics across your organization and teams
- **Domain-Driven Design Architecture**: Clear separation of concerns with domain entities, application services, and infrastructure layers
- **Interactive Dashboards**: Customizable dashboards with multiple visualization types
- **Comprehensive Analytics**: Detailed insights into user activity, repository usage, and suggestion acceptance rates
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatic dark mode based on system preferences
- **Filtering and Searching**: Filter data by organization, team, and date range
- **API-First Approach**: RESTful API for integrating with external systems

## GitHub Copilot Dashboard

The GitHub Copilot dashboard provides insights into how your organization is using GitHub Copilot, including:

- **Organization Overview**: View organization-wide Copilot usage metrics
- **Team View**: Analyze Copilot usage within specific teams
- **User Activity**: Track active and inactive Copilot users
- **Repository Usage**: See which repositories are getting the most benefit from Copilot
- **Acceptance Rate Analysis**: Identify which users and repositories have the highest suggestion acceptance rates
- **Trend Analysis**: Track changes in Copilot usage over time

## Project Structure

The project follows a clean architecture pattern with well-defined layers:

```
metrics-dashboard/
├── src/
│   ├── domain/             # Core domain entities and repository interfaces
│   │   ├── entities/       # Domain models (Metric, Dashboard, User, GitHub)
│   │   └── repositories/   # Repository interfaces
│   │
│   ├── application/        # Application services and business logic
│   │   └── services/       # Services implementing domain logic
│   │
│   ├── infrastructure/     # Repository implementations and external concerns
│   │   └── repositories/   # Concrete implementations of repositories
│   │
│   ├── presentation/       # UI components and presentation logic
│   │   └── components/     # React components
│   │       ├── dashboard/  # Dashboard-related components
│   │       ├── github/     # GitHub-specific components
│   │       ├── layout/     # Layout components
│   │       └── metrics/    # Metrics-related components
│   │
│   └── app/                # Next.js app router pages and API routes
│       ├── api/            # API routes
│       ├── dashboard/      # Dashboard pages
│       ├── github/         # GitHub Copilot pages
│       └── metrics/        # Metrics pages
│
├── public/                 # Static assets
└── ...config files
```

## Technologies Used

- **Next.js**: React framework with server-side rendering and API routes
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Zod**: Schema validation for API requests and responses

## Getting Started

### Prerequisites

- Node.js 18.x or newer
- npm or yarn
- GitHub access token (for production use)

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd metrics-dashboard
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Copy the environment example file and update it with your GitHub API token
   ```
   cp .env.example .env.local
   ```

4. Run the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## GitHub API Integration

The dashboard integrates with the GitHub Copilot API to fetch usage data. To use it with your GitHub organization:

1. Generate a GitHub Personal Access Token with the following permissions:
   - `copilot:read`
   - `org:read`
   - `read:org`

2. Add the token to your `.env.local` file:
   ```
   GITHUB_API_TOKEN=your_github_personal_access_token
   ```

By default, the dashboard uses mock data for development. To use real GitHub API data, set:
```
NEXT_PUBLIC_ENABLE_MOCK_API=false
```

## Key Use Cases

### Organization-wide Copilot Usage Monitoring

- Track the overall adoption of Copilot across your organization
- Identify teams and repositories with the highest Copilot usage
- Monitor acceptance rates to gauge effectiveness

### Team-specific Analysis

- Compare Copilot usage across different teams
- Identify teams that might need additional training or support
- Track team performance over time

### User Activity Monitoring

- See which users are actively using Copilot
- Identify top performers with high acceptance rates
- Find inactive users who may need assistance or training

### Repository Analysis

- Understand which repositories benefit most from Copilot
- Identify codebases where Copilot is less effective
- Optimize your investment by focusing on high-impact areas

## License

This project is licensed under the MIT License - see the LICENSE file for details.
