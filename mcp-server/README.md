# Repo Rescue Room MCP Server

Model Context Protocol (MCP) server for the Repo Rescue Room project. This server provides tools for AI assistants to interact with the project files and structure.

> **Development Note**: This MCP server was developed with the assistance of **Bob**, an AI coding assistant. Bob helped implement the MCP protocol integration and tool definitions.

## Features

The MCP server provides the following tools:

### 1. `read_project_file`
Read the contents of any file in the project.

**Parameters:**
- `path` (string, required): Relative path to the file from project root

**Example:**
```json
{
  "path": "client/src/App.jsx"
}
```

### 2. `list_project_files`
List files in a directory within the project.

**Parameters:**
- `path` (string, optional): Relative path to directory (default: ".")
- `recursive` (boolean, optional): Whether to list files recursively (default: false)

**Example:**
```json
{
  "path": "client/src",
  "recursive": true
}
```

### 3. `get_project_structure`
Get an overview of the project structure, including key directories and files.

**Parameters:** None

### 4. `search_project_files`
Search for files matching a pattern in the project.

**Parameters:**
- `pattern` (string, required): File name pattern (supports wildcards like `*.jsx`)
- `directory` (string, optional): Directory to search in (default: ".")

**Example:**
```json
{
  "pattern": "*.jsx",
  "directory": "client/src"
}
```

## Installation

1. Navigate to the MCP server directory:
```bash
cd mcp-server
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Running the Server

Start the server in production mode:
```bash
npm start
```

Start the server in development mode (with auto-reload):
```bash
npm run dev
```

### Configuring with Claude Desktop

Add the following to your Claude Desktop configuration file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "repo-rescue-room": {
      "command": "node",
      "args": ["/absolute/path/to/Repo-Rescue-Room/mcp-server/src/index.js"]
    }
  }
}
```

Replace `/absolute/path/to/Repo-Rescue-Room` with the actual path to your project.

### Configuring with Other MCP Clients

The server uses stdio transport and can be integrated with any MCP-compatible client. Provide the path to `mcp-server/src/index.js` as the server executable.

## Security

- The server only allows access to files within the project directory
- Common directories like `node_modules`, `.git`, `dist`, and `build` are excluded from listings
- All file paths are validated to prevent directory traversal attacks

## Development

The server is built with:
- Node.js 18+
- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk)

### Project Structure

```
mcp-server/
├── src/
│   └── index.js          # Main server implementation
├── package.json          # Dependencies and scripts
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## Troubleshooting

### Server not starting
- Ensure Node.js 18+ is installed: `node --version`
- Check that dependencies are installed: `npm install`
- Verify the path in your MCP client configuration is correct

### Files not accessible
- Ensure the file path is relative to the project root
- Check that the file exists: `ls -la /path/to/file`
- Verify file permissions allow reading

### Connection issues
- Check that the server is running: `ps aux | grep index.js`
- Review server logs for error messages
- Restart your MCP client after configuration changes

## License

Part of the Repo Rescue Room project.