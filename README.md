# GitHub Copilot Metrics Dashboard

A fully dynamic dashboard for tracking GitHub Copilot usage across your organization and teams using the official GitHub API.

## Features

- **Real-time Copilot Usage Data**: Integrates with GitHub's official Copilot usage API
- **Team-level Analytics**: Analyze how different teams are using Copilot
- **User Activity Tracking**: See which users are actively using Copilot and their efficiency
- **Repository Analysis**: Identify which repositories benefit most from Copilot
- **Interactive UI**: Filter by date ranges and teams

## API Integration

This dashboard integrates with the GitHub API to fetch real Copilot usage data:

- [Copilot Usage for Teams API](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28#get-a-summary-of-copilot-usage-for-a-team)

## Getting Started

### Prerequisites

- Node.js 16.x or newer
- GitHub account with admin access to an organization using Copilot
- Personal Access Token with appropriate permissions

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

3. Configure the application by editing `.env.local`:
   ```
   # GitHub API Authentication
   GITHUB_API_TOKEN=your_github_personal_access_token_here

   # GitHub Organization and Team Configuration
   GITHUB_ORGANIZATION=your-organization-name
   GITHUB_DEFAULT_TEAM_SLUG=your-team-slug

   # Make these available to the client-side code
   NEXT_PUBLIC_GITHUB_ORGANIZATION=your-organization-name
   NEXT_PUBLIC_GITHUB_DEFAULT_TEAM_SLUG=your-team-slug
   ```

4. Run the development server
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## GitHub API Token Setup

To use the GitHub API, you need a Personal Access Token (PAT) with the appropriate permissions:

1. Log in to GitHub and go to your account settings
2. Navigate to **Developer settings** > **Personal access tokens** > **Fine-grained tokens**
3. Click **Generate new token**
4. Name your token (e.g., "Copilot Metrics Dashboard")
5. Set the expiration as appropriate for your needs
6. For Repository access, select "All repositories" or specific repositories you want to monitor
7. For Organization access, select the organization(s) you want to monitor
8. Under **Permissions**, set the following:
   - **Organization permissions**: 
     - "Copilot" - Read-only
     - "Members" - Read-only
     - "Teams" - Read-only
9. Click **Generate token** and copy the token value

## Dashboard Overview

### Main Dashboard
The main dashboard provides an at-a-glance view of your team's Copilot usage, including:

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
