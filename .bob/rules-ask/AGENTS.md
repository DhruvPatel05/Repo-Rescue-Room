# Ask Mode Rules

## Non-Obvious Context
- **Monorepo structure**: Client in `client/`, MCP server in `mcp-server/` - npm commands must run from subdirectories
- **MCP server**: Auto-excludes `node_modules`, `.git`, `dist`, `build` from listings
- **CSS implementation**: Native nesting with `&` syntax, dark mode via `@media (prefers-color-scheme: dark)` with CSS custom properties
- **SVG pattern**: Icons in [`client/public/icons.svg`](client/public/icons.svg) sprite, referenced via `<use href="/icons.svg#icon-id">`