# Advanced Mode Rules

## Critical Gotchas
- **Commands**: Always `cd client` before npm commands (monorepo structure)
- **File paths**: Edits are relative to project root - include `client/` prefix (e.g., [`client/src/App.jsx`](client/src/App.jsx))
- **CSS nesting**: Use native `&` syntax - no preprocessor, requires modern tooling
- **SVG icons**: Add to [`client/public/icons.svg`](client/public/icons.svg) sprite, reference via `<use href="/icons.svg#icon-id">`
- **MCP/Browser tools**: Available in this mode for enhanced capabilities