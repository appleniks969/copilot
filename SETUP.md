# GitHub Copilot Metrics Dashboard Setup Guide

This guide will help you set up the GitHub Copilot Metrics Dashboard to use the real GitHub API for fetching Copilot usage data.

## Prerequisites

1. GitHub account with admin access to an organization that uses GitHub Copilot
2. Permission to create Personal Access Tokens
3. Node.js and npm/yarn installed

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

## Application Configuration

1. Create a file named `.env.local` in the root directory of the project
2. Add the following content, replacing `your_github_personal_access_token_here` with your actual token:

```
# GitHub API Configuration
GITHUB_API_TOKEN=your_github_personal_access_token_here

# Application Settings
NEXT_PUBLIC_APP_NAME=GitHub Copilot Metrics Dashboard
NEXT_PUBLIC_APP_DESCRIPTION=Track your organization's GitHub Copilot usage and metrics

# Set to false to use real GitHub API
NEXT_PUBLIC_ENABLE_MOCK_API=false
```

## Running the Dashboard

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Troubleshooting

### API Error: Not Found
- Ensure your token has the correct permissions
- Verify the organization name is spelled correctly
- Check if your token has access to the specified organization

### API Error: Unauthorized
- Your token may have expired
- Token might not have the correct permissions
- Regenerate your token and update `.env.local`

### API Error: Rate Limit Exceeded
- GitHub API has rate limits
- Consider implementing caching in the application
- Wait until the rate limit resets

## Using Mock Data for Development

If you need to work with mock data during development:

1. Set `NEXT_PUBLIC_ENABLE_MOCK_API=true` in your `.env.local` file
2. Restart the development server

This will use the mock data provider instead of making actual GitHub API calls.
