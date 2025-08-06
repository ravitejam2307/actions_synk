<<<<<<< HEAD
# Snyk Security Scanner with Jira Integration

This project demonstrates automated security scanning using Snyk with automatic Jira issue creation for vulnerabilities.

## Features

- 🔍 Automated security vulnerability scanning with Snyk
- 🧪 Comprehensive test suite with Jest
- 📋 Automatic Jira issue creation based on vulnerability severity
- 🚀 CI/CD pipeline with GitHub Actions
- 📊 Code coverage reporting

## Setup

### Prerequisites

- Node.js 18+
- npm
- Snyk account and token
- Jira account with API access

### Installation

```bash
npm install
```

### Required Secrets

Configure these secrets in your GitHub repository:

- `SNYK_TOKEN`: Your Snyk authentication token
- `JIRA_BASE_URL`: Your Jira instance URL (e.g., https://company.atlassian.net)
- `JIRA_EMAIL`: Email address for Jira authentication
- `JIRA_API_TOKEN`: Jira API token
- `JIRA_PROJECT_KEY`: Jira project key (e.g., SEC)

## Usage

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run security scan
npm run security:scan

# Start application
npm start
```

## Vulnerability Severity Mapping

- **Critical/High**: Creates Bug issues with Highest/High priority
- **Medium**: Creates Task issues with Medium priority  
- **Low**: Creates Task issues with Low priority

## CI/CD Pipeline

The GitHub Actions workflow:
1. Runs tests and linting
2. Performs Snyk security scan
3. Creates Jira issues for any vulnerabilities found
4. Monitors dependencies (on main branch)
=======
# actions_synk
>>>>>>> 5fcabd09502ed694ca9a6e25d9cd54883947f166
