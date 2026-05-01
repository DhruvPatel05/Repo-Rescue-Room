# Code Mode Rules

## Working Directory
- Always `cd client` before running npm commands
- File paths for edits are relative to project root (include `client/` prefix)

## CSS Conventions
- Use native CSS nesting (& syntax) - no preprocessor
- CSS custom properties defined in `:root` with dark mode via `@media (prefers-color-scheme: dark)`

## SVG Icons
- Add new icons to `client/public/icons.svg` sprite sheet
- Reference via `<use href="/icons.svg#icon-id">`