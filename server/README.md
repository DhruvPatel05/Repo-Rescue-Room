# Repo Rescue Room - Backend Server

Express.js backend API for repository issue detection and analysis.

## Features

- **GitHub Integration**: Fetch and analyze repositories via GitHub API
- **Issue Detection**:
  - Outdated/vulnerable dependencies
  - Missing environment variables
  - Hardcoded secrets and API keys
  - Deprecated API usage
  - Test-related issues

## Setup

```bash
cd server
npm install
npm start
```

## API Endpoints

### POST /api/scan

Scan a GitHub repository for issues.

**Request:**
```json
{
  "repoUrl": "https://github.com/owner/repo",
  "token": "ghp_xxxxx" // Optional, for private repos or higher rate limits
}
```

**Response:**
```json
{
  "success": true,
  "repository": "owner/repo",
  "issuesFound": 5,
  "issues": [
    {
      "type": "dependency",
      "file": "package.json",
      "line": 15,
      "severity": "critical",
      "description": "lodash@4.17.15 has known security vulnerability",
      "suggestedFix": "Update to lodash@4.17.21 or higher"
    }
  ]
}
```

### GET /health

Health check endpoint.

## Configuration

- `PORT`: Server port (default: 3001)
- GitHub token: Optional, pass in request body for private repos

## Performance

- Processes files in batches of 10
- Skips files larger than 1MB
- 5-minute scan timeout
- Respects GitHub API rate limits
- Auto-excludes: node_modules, .git, dist, build (per AGENTS.md)

## Issue Types

- `dependency`: Outdated or vulnerable packages
- `env`: Missing environment variables
- `secret`: Hardcoded secrets/API keys
- `deprecated`: Deprecated API usage
- `test`: Test-related issues

## Severity Levels

- `critical`: Immediate action required (security vulnerabilities)
- `high`: Important issues (broken imports, major outdated deps)
- `medium`: Should be addressed (deprecated APIs, missing env vars)
- `low`: Nice to have (documentation improvements)