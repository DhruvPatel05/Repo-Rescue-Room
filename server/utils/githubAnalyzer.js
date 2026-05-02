import { Octokit } from '@octokit/rest';

/**
 * GitHub Repository Analyzer
 * Fetches and analyzes real repository data
 */

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN || undefined
});

/**
 * Analyze a GitHub repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Object>} Analysis results with issues
 */
export async function analyzeRepository(owner, repo) {
  try {
    const issues = [];
    let issueId = 1;

    // 1. Check package.json for dependency issues
    const packageJsonIssues = await checkPackageJson(owner, repo, issueId);
    issues.push(...packageJsonIssues);
    issueId += packageJsonIssues.length;

    // 2. Check for security vulnerabilities
    const securityIssues = await checkSecurityVulnerabilities(owner, repo, issueId);
    issues.push(...securityIssues);
    issueId += securityIssues.length;

    // 3. Check code quality issues
    const codeQualityIssues = await checkCodeQuality(owner, repo, issueId);
    issues.push(...codeQualityIssues);
    issueId += codeQualityIssues.length;

    // 4. Check for missing files
    const missingFilesIssues = await checkMissingFiles(owner, repo, issueId);
    issues.push(...missingFilesIssues);

    return issues;
  } catch (error) {
    console.error('Error analyzing repository:', error.message);
    throw error;
  }
}

/**
 * Check package.json for outdated dependencies
 */
async function checkPackageJson(owner, repo, startId) {
  const issues = [];
  
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: 'package.json'
    });

    if (data.type === 'file') {
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      const packageJson = JSON.parse(content);

      // Check for outdated React
      if (packageJson.dependencies?.react) {
        const version = packageJson.dependencies.react.replace(/[\^~]/, '');
        if (version.startsWith('17') || version.startsWith('16')) {
          issues.push({
            id: startId++,
            type: 'dependency',
            severity: 'high',
            file: 'package.json',
            title: `Outdated dependency: react@${version}`,
            description: `React version ${version} is outdated. Current stable version is 19.0.0`,
            line: 1,
            recommendation: 'Update to react@19.0.0'
          });
        }
      }

      // Check for missing dependencies
      if (!packageJson.dependencies?.['react-router-dom'] && packageJson.dependencies?.react) {
        issues.push({
          id: startId++,
          type: 'dependency',
          severity: 'medium',
          file: 'package.json',
          title: 'Missing routing library',
          description: 'No routing library detected for React application',
          line: 1,
          recommendation: 'Consider adding react-router-dom for navigation'
        });
      }
    }
  } catch (error) {
    if (error.status !== 404) {
      console.error('Error checking package.json:', error.message);
    }
  }

  return issues;
}

/**
 * Check for security vulnerabilities
 */
async function checkSecurityVulnerabilities(owner, repo, startId) {
  const issues = [];

  try {
    // Check for .env files in repository (security risk)
    try {
      await octokit.repos.getContent({
        owner,
        repo,
        path: '.env'
      });
      
      issues.push({
        id: startId++,
        type: 'security',
        severity: 'critical',
        file: '.env',
        title: 'Environment file committed to repository',
        description: '.env file should not be committed as it may contain sensitive information',
        line: 1,
        recommendation: 'Remove .env from repository and add to .gitignore'
      });
    } catch (error) {
      // .env not found is good
    }

    // Check for API keys in code
    const searchResults = await octokit.search.code({
      q: `API_KEY repo:${owner}/${repo}`,
      per_page: 5
    });

    if (searchResults.data.total_count > 0) {
      issues.push({
        id: startId++,
        type: 'security',
        severity: 'high',
        file: searchResults.data.items[0]?.path || 'multiple files',
        title: 'Potential API key exposure',
        description: 'Found potential API keys in code. These should be stored in environment variables',
        line: 1,
        recommendation: 'Move API keys to environment variables'
      });
    }
  } catch (error) {
    console.error('Error checking security:', error.message);
  }

  return issues;
}

/**
 * Check code quality issues
 */
async function checkCodeQuality(owner, repo, startId) {
  const issues = [];

  try {
    // Check for README
    try {
      await octokit.repos.getContent({
        owner,
        repo,
        path: 'README.md'
      });
    } catch (error) {
      if (error.status === 404) {
        issues.push({
          id: startId++,
          type: 'documentation',
          severity: 'medium',
          file: 'README.md',
          title: 'Missing README file',
          description: 'Repository lacks a README file for documentation',
          line: 1,
          recommendation: 'Add a README.md file with project documentation'
        });
      }
    }

    // Check for tests
    const testFiles = await octokit.search.code({
      q: `test repo:${owner}/${repo} extension:js extension:jsx extension:ts extension:tsx`,
      per_page: 1
    });

    if (testFiles.data.total_count === 0) {
      issues.push({
        id: startId++,
        type: 'code-quality',
        severity: 'medium',
        file: 'tests/',
        title: 'No test files found',
        description: 'Repository appears to lack automated tests',
        line: 1,
        recommendation: 'Add unit and integration tests'
      });
    }

    // Check for TypeScript
    const repoData = await octokit.repos.get({ owner, repo });
    const languages = await octokit.repos.listLanguages({ owner, repo });
    
    if (languages.data.JavaScript && !languages.data.TypeScript) {
      issues.push({
        id: startId++,
        type: 'code-quality',
        severity: 'low',
        file: 'project',
        title: 'Consider TypeScript for type safety',
        description: 'Project uses JavaScript. TypeScript provides better type safety and developer experience',
        line: 1,
        recommendation: 'Consider migrating to TypeScript'
      });
    }
  } catch (error) {
    console.error('Error checking code quality:', error.message);
  }

  return issues;
}

/**
 * Check for missing important files
 */
async function checkMissingFiles(owner, repo, startId) {
  const issues = [];

  const importantFiles = [
    { name: '.gitignore', severity: 'high', description: 'Missing .gitignore file can lead to committing sensitive files' },
    { name: 'LICENSE', severity: 'medium', description: 'Missing LICENSE file - unclear usage rights' },
    { name: '.eslintrc', severity: 'low', description: 'Missing ESLint configuration for code quality' }
  ];

  for (const file of importantFiles) {
    try {
      await octokit.repos.getContent({
        owner,
        repo,
        path: file.name
      });
    } catch (error) {
      if (error.status === 404) {
        issues.push({
          id: startId++,
          type: 'code-quality',
          severity: file.severity,
          file: file.name,
          title: `Missing ${file.name}`,
          description: file.description,
          line: 1,
          recommendation: `Add ${file.name} to the repository`
        });
      }
    }
  }

  return issues;
}

/**
 * Get repository metadata
 */
export async function getRepositoryInfo(owner, repo) {
  try {
    const { data } = await octokit.repos.get({ owner, repo });
    return {
      name: data.name,
      fullName: data.full_name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error getting repository info:', error.message);
    throw error;
  }
}

// Made with Bob
