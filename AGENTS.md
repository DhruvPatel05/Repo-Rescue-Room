# AGENTS.md

This file provides guidance to agents when working with code in this repository.

> **Development Note**: This project was built with the assistance of **Bob**, an AI coding assistant. Bob helped with architecture design, code implementation, debugging, and documentation. See `bob_sessions/` for session history.

## Project Structure
- Monorepo with three main components:
  - `client/` - React frontend application
  - `server/` - Express backend API server
  - `mcp-server/` - Model Context Protocol server
- All npm commands must be run from respective directories

## Build & Development
- Client Dev: `cd client && npm run dev` (runs on http://localhost:5173)
- Client Build: `cd client && npm run build`
- Client Lint: `cd client && npm run lint`
- Backend Server: `cd server && npm start` (runs on http://localhost:3001)
- Backend Dev: `cd server && npm run dev`
- MCP Server: `cd mcp-server && npm start`
- MCP Server Dev: `cd mcp-server && npm run dev`
- No test framework configured

## Code Patterns
- CSS uses native nesting syntax (requires modern browser/build tool)
- SVG icons use sprite pattern: `<use href="/icons.svg#icon-name">`
- React 19 with StrictMode enabled

## MCP Server
- Model Context Protocol server for AI assistant integration
- Provides tools for reading files, listing directories, and searching the project
- See `mcp-server/README.md` for detailed documentation
- Configuration example: `mcp-server/claude_desktop_config.example.json`

## Backend API Server
- Express server providing REST API for repository analysis
- Three main endpoints: `/api/scan`, `/api/rescue`, `/api/fix`
- See `server/README.md` for detailed API documentation
- Frontend connects via `client/src/services/api.js`
- CORS enabled for local development