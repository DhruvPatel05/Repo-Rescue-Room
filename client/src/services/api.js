/**
 * API Service for Repo Rescue Room
 * Connects frontend to backend API endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Scan a GitHub repository
 * @param {string} repoUrl - GitHub repository URL
 * @returns {Promise<Object>} Scan results with health score and issues
 */
export async function scanRepository(repoUrl) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: repoUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to scan repository');
    }

    return await response.json();
  } catch (error) {
    console.error('Scan API error:', error);
    throw error;
  }
}

/**
 * Create a rescue plan from issues
 * @param {Array} issues - Array of issues from scan
 * @returns {Promise<Array>} Prioritized rescue plan
 */
export async function createRescuePlan(issues) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rescue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ issues }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create rescue plan');
    }

    return await response.json();
  } catch (error) {
    console.error('Rescue API error:', error);
    throw error;
  }
}

/**
 * Generate a fix for an issue
 * @param {Object} issue - Issue object to fix
 * @returns {Promise<Array>} Array with fix details
 */
export async function generateFix(issue) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fix`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ issue }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate fix');
    }

    return await response.json();
  } catch (error) {
    console.error('Fix API error:', error);
    throw error;
  }
}

/**
 * Check server health
 * @returns {Promise<Object>} Server health status
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error('Server health check failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
}

/**
 * Mock data for development/testing
 */
export const mockScanData = {
  healthScore: 75,
  summary: {
    critical: 1,
    high: 2,
    medium: 3,
    low: 1
  },
  totalIssues: 7,
  issues: [
    {
      id: 1,
      type: 'security',
      severity: 'critical',
      file: 'src/auth/login.js',
      title: 'SQL Injection vulnerability',
      description: 'User input is directly concatenated into SQL query',
      line: 45,
      recommendation: 'Use parameterized queries or ORM'
    },
    {
      id: 2,
      type: 'dependency',
      severity: 'high',
      file: 'package.json',
      title: 'Outdated dependency: express@4.16.0',
      description: 'Express version 4.16.0 has known security vulnerabilities',
      line: 12,
      recommendation: 'Update to express@4.18.2 or later'
    },
    {
      id: 3,
      type: 'dependency',
      severity: 'high',
      file: 'package.json',
      title: 'Vulnerable package: lodash@4.17.15',
      description: 'Lodash version has prototype pollution vulnerability',
      line: 15,
      recommendation: 'Update to lodash@4.17.21 or later'
    },
    {
      id: 4,
      type: 'code-quality',
      severity: 'medium',
      file: 'src/components/Dashboard.jsx',
      title: 'Missing error boundary',
      description: 'Component lacks error handling for async operations',
      line: 28,
      recommendation: 'Implement error boundary or try-catch blocks'
    },
    {
      id: 5,
      type: 'performance',
      severity: 'medium',
      file: 'src/utils/dataProcessor.js',
      title: 'Inefficient array operations',
      description: 'Multiple array iterations could be combined',
      line: 67,
      recommendation: 'Use single reduce operation instead of map + filter'
    },
    {
      id: 6,
      type: 'code-quality',
      severity: 'medium',
      file: 'src/api/client.js',
      title: 'Hardcoded API endpoint',
      description: 'API URL is hardcoded instead of using environment variable',
      line: 8,
      recommendation: 'Move to environment configuration'
    },
    {
      id: 7,
      type: 'documentation',
      severity: 'low',
      file: 'src/utils/helpers.js',
      title: 'Missing JSDoc comments',
      description: 'Utility functions lack documentation',
      line: 1,
      recommendation: 'Add JSDoc comments for all exported functions'
    }
  ],
  repository: {
    owner: 'example',
    name: 'repo',
    url: 'https://github.com/example/repo'
  },
  scannedAt: new Date().toISOString()
};

// Made with Bob
