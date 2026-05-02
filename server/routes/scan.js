import express from 'express';
import axios from 'axios';

const router = express.Router();

/**
 * POST /api/scan
 * Scans a GitHub repository and returns health score and issues
 * 
 * Input: { "url": "https://github.com/owner/repo" }
 * Output: {
 *   "healthScore": 80,
 *   "summary": { "critical": 0, "high": 1, "medium": 2, "low": 0 },
 *   "totalIssues": 3,
 *   "issues": [...]
 * }
 */
router.post('/', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'Repository URL is required' });
    }

    // Validate GitHub URL format
    const githubUrlPattern = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/;
    if (!githubUrlPattern.test(url)) {
      return res.status(400).json({ error: 'Invalid GitHub repository URL' });
    }

    // Extract owner and repo from URL
    const urlParts = url.replace('https://github.com/', '').replace(/\/$/, '').split('/');
    const [owner, repo] = urlParts;

    console.log(`🔍 Scanning repository: ${owner}/${repo}`);

    // TODO: Implement actual GitHub API scanning logic
    // For now, return mock data that matches the expected format
    const mockIssues = [
      {
        id: 1,
        type: 'dependency',
        severity: 'high',
        file: 'package.json',
        title: 'Outdated dependency: react@17.0.0',
        description: 'React version 17.0.0 is outdated. Current stable version is 19.0.0',
        line: 15,
        recommendation: 'Update to react@19.0.0'
      },
      {
        id: 2,
        type: 'security',
        severity: 'medium',
        file: 'src/utils/api.js',
        title: 'Potential XSS vulnerability',
        description: 'User input is not properly sanitized before rendering',
        line: 42,
        recommendation: 'Use DOMPurify or similar library to sanitize user input'
      },
      {
        id: 3,
        type: 'code-quality',
        severity: 'medium',
        file: 'src/components/Dashboard.jsx',
        title: 'Missing error boundary',
        description: 'Component lacks error handling for async operations',
        line: 28,
        recommendation: 'Implement error boundary or try-catch blocks'
      }
    ];

    // Calculate summary
    const summary = {
      critical: mockIssues.filter(i => i.severity === 'critical').length,
      high: mockIssues.filter(i => i.severity === 'high').length,
      medium: mockIssues.filter(i => i.severity === 'medium').length,
      low: mockIssues.filter(i => i.severity === 'low').length
    };

    // Calculate health score (100 - weighted issues)
    const healthScore = Math.max(0, 100 - (
      summary.critical * 25 +
      summary.high * 15 +
      summary.medium * 8 +
      summary.low * 3
    ));

    const response = {
      healthScore,
      summary,
      totalIssues: mockIssues.length,
      issues: mockIssues,
      repository: {
        owner,
        name: repo,
        url
      },
      scannedAt: new Date().toISOString()
    };

    console.log(`✅ Scan complete. Health Score: ${healthScore}`);
    res.json(response);

  } catch (error) {
    console.error('Error scanning repository:', error);
    res.status(500).json({ 
      error: 'Failed to scan repository',
      message: error.message 
    });
  }
});

export default router;

// Made with Bob
