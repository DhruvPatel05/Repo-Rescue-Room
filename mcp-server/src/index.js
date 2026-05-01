#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";

// Server configuration
const SERVER_NAME = "repo-rescue-room-mcp";
const SERVER_VERSION = "1.0.0";

// Project root directory (parent of mcp-server)
const PROJECT_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");

class RepoRescueRoomServer {
  constructor() {
    this.server = new Server(
      {
        name: SERVER_NAME,
        version: SERVER_VERSION,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "read_project_file",
          description: "Read a file from the Repo Rescue Room project",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Relative path to the file from project root",
              },
            },
            required: ["path"],
          },
        },
        {
          name: "list_project_files",
          description: "List files in a directory within the Repo Rescue Room project",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Relative path to the directory from project root (default: '.')",
                default: ".",
              },
              recursive: {
                type: "boolean",
                description: "Whether to list files recursively",
                default: false,
              },
            },
          },
        },
        {
          name: "get_project_structure",
          description: "Get an overview of the Repo Rescue Room project structure",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "search_project_files",
          description: "Search for files matching a pattern in the project",
          inputSchema: {
            type: "object",
            properties: {
              pattern: {
                type: "string",
                description: "File name pattern to search for (supports wildcards)",
              },
              directory: {
                type: "string",
                description: "Directory to search in (default: project root)",
                default: ".",
              },
            },
            required: ["pattern"],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "read_project_file":
            return await this.readProjectFile(args.path);

          case "list_project_files":
            return await this.listProjectFiles(args.path || ".", args.recursive || false);

          case "get_project_structure":
            return await this.getProjectStructure();

          case "search_project_files":
            return await this.searchProjectFiles(args.pattern, args.directory || ".");

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async readProjectFile(relativePath) {
    const fullPath = path.join(PROJECT_ROOT, relativePath);
    
    // Security check: ensure path is within project
    if (!fullPath.startsWith(PROJECT_ROOT)) {
      throw new Error("Access denied: path outside project directory");
    }

    try {
      const content = await fs.readFile(fullPath, "utf-8");
      return {
        content: [
          {
            type: "text",
            text: `File: ${relativePath}\n\n${content}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }

  async listProjectFiles(relativePath, recursive) {
    const fullPath = path.join(PROJECT_ROOT, relativePath);
    
    if (!fullPath.startsWith(PROJECT_ROOT)) {
      throw new Error("Access denied: path outside project directory");
    }

    try {
      const files = await this.listFilesRecursive(fullPath, recursive);
      const relativeFiles = files.map(f => path.relative(PROJECT_ROOT, f));
      
      return {
        content: [
          {
            type: "text",
            text: `Files in ${relativePath}:\n\n${relativeFiles.join("\n")}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }

  async listFilesRecursive(dir, recursive) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Skip common directories to ignore
      if (entry.isDirectory() && ["node_modules", ".git", "dist", "build"].includes(entry.name)) {
        continue;
      }

      if (entry.isDirectory() && recursive) {
        files.push(...await this.listFilesRecursive(fullPath, recursive));
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }

    return files;
  }

  async getProjectStructure() {
    const structure = {
      name: "Repo Rescue Room",
      description: "React application with Vite build system",
      directories: {
        client: "Main React application",
        "mcp-server": "MCP Server implementation",
        ".bob": "Agent rules and configuration",
      },
      keyFiles: [
        "AGENTS.md - Agent guidance documentation",
        "client/package.json - Client dependencies",
        "client/vite.config.js - Vite configuration",
        "client/src/App.jsx - Main React component",
        "mcp-server/package.json - MCP server dependencies",
      ],
    };

    return {
      content: [
        {
          type: "text",
          text: `Project Structure:\n\n${JSON.stringify(structure, null, 2)}`,
        },
      ],
    };
  }

  async searchProjectFiles(pattern, directory) {
    const fullPath = path.join(PROJECT_ROOT, directory);
    
    if (!fullPath.startsWith(PROJECT_ROOT)) {
      throw new Error("Access denied: path outside project directory");
    }

    try {
      const allFiles = await this.listFilesRecursive(fullPath, true);
      const regex = new RegExp(pattern.replace(/\*/g, ".*"));
      const matchingFiles = allFiles
        .filter(f => regex.test(path.basename(f)))
        .map(f => path.relative(PROJECT_ROOT, f));

      return {
        content: [
          {
            type: "text",
            text: `Files matching "${pattern}":\n\n${matchingFiles.join("\n") || "No matches found"}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to search files: ${error.message}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Repo Rescue Room MCP Server running on stdio");
  }
}

// Start the server
const server = new RepoRescueRoomServer();
server.run().catch(console.error);

// Made with Bob
