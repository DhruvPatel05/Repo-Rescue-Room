import express from 'express';
const router = express.Router();

// Severity order for sorting (higher index = higher priority)
const SEVERITY_ORDER = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
};

// Estimated time ranges by severity (in minutes)
const TIME_ESTIMATES = {
  critical: { min: 30, max: 120 },
  high: { min: 20, max: 60 },
  medium: { min: 10, max: 30 },
  low: { min: 5, max: 15 }
};

/**
 * Generate rescue plan for an issue
 */
function generateRescuePlan(issue) {
  const { type, severity, file, line, message } = issue;
  
  // Generate title based on issue type
  const title = generateTitle(type, file);
  
  // Generate explanation
  const explanation = generateExplanation(type, message);
  
  // Generate fix steps
  const fixSteps = generateFixSteps(type, file, line);
  
  // Estimate time
  const estimatedTime = estimateTime(severity, type);
  
  return {
    title,
    explanation,
    fixSteps,
    estimatedTime
  };
}

function generateTitle(type, file) {
  const fileName = file.split('/').pop();
  
  const titles = {
    'security-vulnerability': `Fix security issue in ${fileName}`,
    'code-smell': `Improve code quality in ${fileName}`,
    'bug': `Fix bug in ${fileName}`,
    'performance': `Optimize performance in ${fileName}`,
    'accessibility': `Improve accessibility in ${fileName}`,
    'best-practice': `Apply best practices in ${fileName}`,
    'deprecated': `Update deprecated code in ${fileName}`,
    'unused-code': `Remove unused code from ${fileName}`,
    'complexity': `Simplify complex code in ${fileName}`,
    'documentation': `Add documentation to ${fileName}`
  };
  
  return titles[type] || `Fix issue in ${fileName}`;
}

function generateExplanation(type, message) {
  const explanations = {
    'security-vulnerability': 'This code has a security weakness that could be exploited by attackers.',
    'code-smell': 'This code works but could be written more clearly or efficiently.',
    'bug': 'This code contains an error that may cause unexpected behavior.',
    'performance': 'This code runs slower than it should and can be optimized.',
    'accessibility': 'This code makes it harder for people with disabilities to use your app.',
    'best-practice': 'This code doesn\'t follow recommended coding standards.',
    'deprecated': 'This code uses outdated features that may stop working in the future.',
    'unused-code': 'This code is never used and can be safely removed.',
    'complexity': 'This code is too complicated and hard to understand or maintain.',
    'documentation': 'This code lacks comments or documentation explaining what it does.'
  };
  
  const baseExplanation = explanations[type] || 'This code needs attention.';
  return message ? `${baseExplanation} ${message}` : baseExplanation;
}

function generateFixSteps(type, file, line) {
  const lineRef = line ? ` (line ${line})` : '';
  
  const steps = {
    'security-vulnerability': [
      `Open ${file}${lineRef}`,
      'Review the security warning and understand the risk',
      'Apply the recommended security fix',
      'Test to ensure the fix works correctly'
    ],
    'code-smell': [
      `Open ${file}${lineRef}`,
      'Refactor the code to be clearer and more maintainable',
      'Run tests to verify functionality'
    ],
    'bug': [
      `Open ${file}${lineRef}`,
      'Identify the root cause of the bug',
      'Apply the fix and add a test case',
      'Verify the bug is resolved'
    ],
    'performance': [
      `Open ${file}${lineRef}`,
      'Identify the performance bottleneck',
      'Optimize the code (caching, algorithms, etc.)',
      'Measure performance improvement'
    ],
    'accessibility': [
      `Open ${file}${lineRef}`,
      'Add proper ARIA labels or semantic HTML',
      'Test with screen readers or accessibility tools'
    ],
    'best-practice': [
      `Open ${file}${lineRef}`,
      'Update code to follow best practices',
      'Run linter to verify compliance'
    ],
    'deprecated': [
      `Open ${file}${lineRef}`,
      'Replace deprecated code with modern alternative',
      'Test to ensure compatibility'
    ],
    'unused-code': [
      `Open ${file}${lineRef}`,
      'Verify the code is truly unused',
      'Remove the code safely'
    ],
    'complexity': [
      `Open ${file}${lineRef}`,
      'Break down complex logic into smaller functions',
      'Add comments explaining the logic',
      'Test thoroughly'
    ],
    'documentation': [
      `Open ${file}${lineRef}`,
      'Add clear comments explaining the code',
      'Document function parameters and return values'
    ]
  };
  
  return steps[type] || [
    `Open ${file}${lineRef}`,
    'Review the issue',
    'Apply appropriate fix',
    'Test the changes'
  ];
}

function estimateTime(severity, type) {
  const range = TIME_ESTIMATES[severity] || { min: 10, max: 30 };
  
  // Adjust based on type
  const typeMultipliers = {
    'security-vulnerability': 1.5,
    'bug': 1.3,
    'complexity': 1.4,
    'unused-code': 0.5,
    'documentation': 0.7
  };
  
  const multiplier = typeMultipliers[type] || 1;
  const avgTime = Math.round(((range.min + range.max) / 2) * multiplier);
  
  return avgTime;
}

/**
 * POST /api/rescue
 * Process issues and generate rescue plan
 */
router.post('/', (req, res) => {
  try {
    const { issues } = req.body;
    
    if (!issues || !Array.isArray(issues)) {
      return res.status(400).json({ 
        error: 'Invalid input: issues array required' 
      });
    }
    
    // Sort issues by severity (critical first)
    const sortedIssues = [...issues].sort((a, b) => {
      const severityA = SEVERITY_ORDER[a.severity] || 0;
      const severityB = SEVERITY_ORDER[b.severity] || 0;
      return severityB - severityA;
    });
    
    // Generate rescue plan for each issue
    const rescuePlan = sortedIssues.map((issue, index) => {
      const plan = generateRescuePlan(issue);
      
      return {
        priority: index + 1,
        severity: issue.severity,
        type: issue.type,
        file: issue.file,
        ...plan
      };
    });
    
    res.json(rescuePlan);
    
  } catch (error) {
    console.error('Error generating rescue plan:', error);
    res.status(500).json({ 
      error: 'Failed to generate rescue plan' 
    });
  }
});

export default router;

// Made with Bob

