# Repo Rescue Room - Complete Setup Guide

This guide will help you set up and run the complete Repo Rescue Room application with frontend, backend, and MCP server.

> **Note**: This project was developed with the assistance of **Bob**, an AI-powered coding assistant. See the `bob_sessions/` directory for development session screenshots and usage statistics.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git

## Project Structure

```
Repo-Rescue-Room/
├── client/          # React frontend (Vite)
├── server/          # Express backend API
├── mcp-server/      # Model Context Protocol server
└── AGENTS.md        # Agent guidelines
```

## Quick Start

### 1. Install Dependencies

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

# Install MCP server dependencies (optional)
cd ../mcp-server
npm install
```

### 2. Configure Environment Variables

**Client (.env):**
```bash
cd client
echo "VITE_API_URL=http://localhost:3001" > .env
```

**Server (.env):**
```bash
cd server
echo "PORT=3001" > .env
echo "NODE_ENV=development" >> .env
echo "GITHUB_TOKEN=" >> .env  # Optional: Add your GitHub token
```

### 3. Start the Application

**Option A: Run All Services (Recommended)**

Open 3 terminal windows:

```bash
# Terminal 1 - Backend Server
cd server
npm start
# Server runs on http://localhost:3001

# Terminal 2 - Frontend Client
cd client
npm run dev
# Client runs on http://localhost:5173

# Terminal 3 - MCP Server (Optional)
cd mcp-server
npm start
```

**Option B: Development Mode with Auto-Reload**

```bash
# Terminal 1 - Backend (with nodemon)
cd server
npm run dev

# Terminal 2 - Frontend (with Vite HMR)
cd client
npm run dev
```

### 4. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

## Backend API Endpoints

### 1. Scan Repository
```bash
POST http://localhost:3001/api/scan
Content-Type: application/json

{
  "url": "https://github.com/owner/repo"
}
```

**Response:**
```json
{
  "healthScore": 80,
  "summary": { "critical": 0, "high": 1, "medium": 2, "low": 0 },
  "totalIssues": 3,
  "issues": [...],
  "repository": {...},
  "scannedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Create Rescue Plan
```bash
POST http://localhost:3001/api/rescue
Content-Type: application/json

{
  "issues": [...]
}
```

**Response:**
```json
[
  {
    "priority": 1,
    "severity": "high",
    "type": "dependency",
    "file": "package.json",
    "title": "...",
    "explanation": "...",
    "fixSteps": [...],
    "estimatedTime": "7 min"
  }
]
```

### 3. Generate Fix
```bash
POST http://localhost:3001/api/fix
Content-Type: application/json

{
  "issue": {...}
}
```

**Response:**
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

## Testing the API

### Using curl

```bash
# Health check
curl http://localhost:3001/health

# Scan a repository
curl -X POST http://localhost:3001/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com/facebook/react"}'

# Test rescue endpoint (save scan response first)
curl -X POST http://localhost:3001/api/rescue \
  -H "Content-Type: application/json" \
  -d '{"issues":[...]}'
```

### Using the Frontend

1. Open http://localhost:5173
2. Enter a GitHub repository URL
3. Click "Scan Repository"
4. View health score and issues
5. Click "Create Rescue Plan"
6. Select an issue to generate a fix
7. View code diff and apply changes

## Frontend Integration

The frontend uses `client/src/services/api.js` to connect to the backend:

```javascript
import { scanRepository, createRescuePlan, generateFix } from './services/api';

// Scan a repository
const scanData = await scanRepository('https://github.com/owner/repo');

// Create rescue plan
const rescuePlan = await createRescuePlan(scanData.issues);

// Generate fix
const fix = await generateFix(selectedIssue);
```

## Development Workflow

### 1. Frontend Development
```bash
cd client
npm run dev
```
- Vite provides hot module replacement (HMR)
- Changes reflect immediately in the browser
- Frontend runs on http://localhost:5173

### 2. Backend Development
```bash
cd server
npm run dev
```
- Nodemon watches for file changes
- Server restarts automatically
- Backend runs on http://localhost:3001

### 3. Building for Production

**Frontend:**
```bash
cd client
npm run build
# Output in client/dist/
```

**Backend:**
```bash
cd server
npm start
# Production mode
```

## Troubleshooting

### Port Already in Use

If port 3001 or 5173 is already in use:

```bash
# Find and kill the process
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

Or change the port in `.env` files.

### CORS Issues

If you encounter CORS errors:
1. Ensure backend server is running
2. Check `VITE_API_URL` in `client/.env`
3. Verify CORS is enabled in `server/index.js`

### Module Not Found

```bash
# Reinstall dependencies
cd client && npm install
cd ../server && npm install
```

### API Connection Failed

1. Check backend server is running: `curl http://localhost:3001/health`
2. Verify `VITE_API_URL` in `client/.env`
3. Check browser console for errors
4. Ensure no firewall blocking localhost connections

## Project Commands Reference

### Client Commands
```bash
cd client
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Server Commands
```bash
cd server
npm start        # Start production server
npm run dev      # Start with nodemon (auto-reload)
```

### MCP Server Commands
```bash
cd mcp-server
npm start        # Start MCP server
npm run dev      # Start with nodemon
```

## Architecture Overview

### Data Flow
```
User Input (GitHub URL)
    ↓
Frontend (React)
    ↓
API Service (client/src/services/api.js)
    ↓
Backend API (Express)
    ↓
Route Handlers (scan.js, rescue.js, fix.js)
    ↓
Response (JSON)
    ↓
Frontend Components (Display Results)
```

### Component Structure
```
App.jsx
├── RescueDashboard.jsx  (Health Score, Issue Cards)
├── RescuePlan.jsx        (Prioritized Issues, Fix Steps)
├── CodeFix.jsx           (Code Diff, Apply Fix)
└── BobChat.jsx           (AI Assistant)
```

## Next Steps

1. **Integrate Real GitHub API**: Replace mock data with actual GitHub API calls
2. **Add Authentication**: Implement user authentication and GitHub OAuth
3. **Enhance AI Analysis**: Use AI models for better code analysis
4. **Add Testing**: Implement unit and integration tests
5. **Deploy**: Deploy to production (Vercel, Netlify, Railway, etc.)

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Express Documentation](https://expressjs.com)
- [GitHub API Documentation](https://docs.github.com/en/rest)

## Support

For issues or questions:
1. Check the documentation in `server/README.md`
2. Review `AGENTS.md` for development guidelines
3. Check terminal logs for error messages
4. Ensure all dependencies are installed

## License

MIT