# Repo Rescue Room - Backend Server

Backend API server for Repo Rescue Room that performs repository scanning, issue analysis, rescue planning, and code fix generation.

## Architecture

```
server/
├── index.js          → Main Express server
├── routes/
│   ├── scan.js       → Finds issues in repositories
│   ├── rescue.js     → Prioritizes issues and creates rescue plans
│   └── fix.js        → Generates code fixes
└── package.json
```

## API Endpoints

### 1. Scan API
**POST** `/api/scan`

Scans a GitHub repository and returns health score and issues.

**Input:**
```json
{
  "url": "https://github.com/owner/repo"
}
```

**Output:**
```json
{
  "healthScore": 80,
  "summary": {
    "critical": 0,
    "high": 1,
    "medium": 2,
    "low": 0
  },
  "totalIssues": 3,
  "issues": [
    {
      "id": 1,
      "type": "dependency",
      "severity": "high",
      "file": "package.json",
      "title": "Outdated dependency",
      "description": "...",
      "line": 15,
      "recommendation": "..."
    }
  ],
  "repository": {
    "owner": "owner",
    "name": "repo",
    "url": "https://github.com/owner/repo"
  },
  "scannedAt": "2024-01-01T00:00:00.000Z"
}
```

**Used for:**
- Health score UI
- Issue cards
- Issue list

---

### 2. Rescue API
**POST** `/api/rescue`

Analyzes issues and creates a prioritized rescue plan.

**Input:**
```json
{
  "issues": [...]
}
```

**Output:**
```json
[
  {
    "priority": 1,
    "severity": "high",
    "type": "dependency",
    "file": "package.json",
    "title": "...",
    "explanation": "...",
    "fixSteps": [
      "Step 1",
      "Step 2"
    ],
    "estimatedTime": "7 min"
  }
]
```

**Used for:**
- Prioritized issue list
- Fix order
- Rescue plan UI

---

### 3. Fix API
**POST** `/api/fix`

Generates code fixes for a specific issue.

**Input:**
```json
{
  "issue": {
    "type": "dependency",
    "severity": "high",
    "file": "package.json",
    "title": "...",
    "description": "..."
  }
}
```

**Output:**
```json
[
  {
    "priority": 1,
    "type": "dependency",
    "severity": "high",
    "status": "pending",
    "confidence": "high",
    "file": "package.json",
    "original_code": "...",
    "fixed_code": "...",
    "fix_explanation": "...",
    "description": "..."
  }
]
```

**Used for:**
- Code diff view
- Apply fix
- Progress tracking

---

## Data Flow

```
User → Scan → Show Issues → Rescue → Show Plan → Fix → Show Code Changes
```

## Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment
Create a `.env` file:
```env
PORT=3001
NODE_ENV=development
GITHUB_TOKEN=your_github_token_here
```

### 3. Start Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server runs on: `http://localhost:3001`

## Important Notes

- Always send: `{ "url": "..." }` for scan endpoint
- All APIs are POST requests
- Server runs on: `http://localhost:3001`
- No authentication required for development
- CORS enabled for frontend integration

## Frontend Integration

The frontend should connect to these endpoints:

```javascript
// Scan repository
const scanResponse = await fetch('http://localhost:3001/api/scan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: repoUrl })
});

// Create rescue plan
const rescueResponse = await fetch('http://localhost:3001/api/rescue', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ issues: scanData.issues })
});

// Generate fix
const fixResponse = await fetch('http://localhost:3001/api/fix', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ issue: selectedIssue })
});
```

## Issue Types

- `dependency` - Outdated or vulnerable dependencies
- `security` - Security vulnerabilities
- `code-quality` - Code quality issues
- `performance` - Performance problems
- `documentation` - Missing or poor documentation

## Severity Levels

- `critical` - Must fix immediately
- `high` - Should fix soon
- `medium` - Should fix eventually
- `low` - Nice to fix

## Health Score Calculation

```
Health Score = 100 - (
  critical × 25 +
  high × 15 +
  medium × 8 +
  low × 3
)
```

## Development

### Adding New Issue Types

1. Update `scan.js` to detect the new issue type
2. Add fix generator in `fix.js`
3. Add explanation generator in `rescue.js`
4. Update documentation

### Testing Endpoints

Use curl or Postman:

```bash
# Test scan
curl -X POST http://localhost:3001/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com/owner/repo"}'

# Test health check
curl http://localhost:3001/health
```

## Future Enhancements

- [ ] Real GitHub API integration
- [ ] AI-powered code analysis
- [ ] Automated fix application
- [ ] Repository cloning and analysis
- [ ] Support for multiple languages
- [ ] Custom rule configuration
- [ ] Webhook support for CI/CD