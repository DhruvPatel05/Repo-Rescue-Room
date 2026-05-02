import express from 'express';
import { analyzeRepository, getRepositoryInfo } from '../utils/githubAnalyzer.js';

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

    console.log('📥 Received scan request:', { url });

    if (!url) {
      return res.status(400).json({ error: 'Repository URL is required' });
    }

    // Validate GitHub URL format - more flexible pattern
    const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
    if (!githubUrlPattern.test(url.trim())) {
      console.log('❌ Invalid URL format:', url);
      return res.status(400).json({
        error: 'Invalid GitHub repository URL',
        hint: 'Expected format: https://github.com/owner/repo'
      });
    }

    // Extract owner and repo from URL
    const cleanUrl = url.trim().replace(/\/$/, '');
    const urlParts = cleanUrl.replace(/^https?:\/\/(www\.)?github\.com\//, '').split('/');
    const [owner, repo] = urlParts;

    console.log(`🔍 Scanning repository: ${owner}/${repo}`);

    // Fetch repository info
    let repoInfo;
    try {
      repoInfo = await getRepositoryInfo(owner, repo);
      console.log(`📦 Repository: ${repoInfo.fullName} (${repoInfo.language})`);
    } catch (error) {
      return res.status(404).json({
        error: 'Repository not found',
        message: `Could not find repository: ${owner}/${repo}`
      });
    }

    // Analyze repository for issues
    const issues = await analyzeRepository(owner, repo);
    console.log(`🔎 Found ${issues.length} issues`);

    // Calculate summary
    const summary = {
      critical: issues.filter(i => i.severity === 'critical').length,
      high: issues.filter(i => i.severity === 'high').length,
      medium: issues.filter(i => i.severity === 'medium').length,
      low: issues.filter(i => i.severity === 'low').length
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
      totalIssues: issues.length,
      issues,
      repository: {
        owner,
        name: repo,
        url,
        ...repoInfo
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
