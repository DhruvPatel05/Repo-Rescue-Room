# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Structure
- Monorepo with client app in `client/` subdirectory
- MCP server in `mcp-server/` subdirectory
- All npm commands must be run from respective directories (`client/` or `mcp-server/`)

## Build & Development
- Client Dev: `cd client && npm run dev`
- Client Build: `cd client && npm run build`
- Client Lint: `cd client && npm run lint`
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