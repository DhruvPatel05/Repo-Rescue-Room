# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Critical Gotchas
- **All npm commands MUST be run from subdirectories** (`cd client` or `cd mcp-server`), NOT from project root
- CSS uses native nesting syntax (`&` selector) - requires modern browser/build tool support
- SVG icons use sprite pattern: `<use href="/icons.svg#icon-name">` - add new icons to [`client/public/icons.svg`](client/public/icons.svg)
- MCP server auto-excludes `node_modules`, `.git`, `dist`, `build` from file listings