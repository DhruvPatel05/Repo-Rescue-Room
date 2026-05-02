import express from 'express';

const router = express.Router();

/**
 * POST /api/rescue
 * Analyzes issues and creates a prioritized rescue plan
 * 
 * Input: { "issues": [...] }
 * Output: [
 *   {
 *     "priority": 1,
 *     "severity": "high",
 *     "type": "dependency",
 *     "file": "package.json",
 *     "title": "...",
 *     "explanation": "...",
 *     "fixSteps": [...],
 *     "estimatedTime": "7 min"
 *   }
 * ]
 */
router.post('/', async (req, res) => {
  try {
    const { issues } = req.body;

    if (!issues || !Array.isArray(issues)) {
      return res.status(400).json({ error: 'Issues array is required' });
    }

    console.log(`🔧 Creating rescue plan for ${issues.length} issues`);

    // Priority weights for sorting
    const severityWeight = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1
    };

    // Type weights (some types are more urgent)
    const typeWeight = {
      security: 4,
      dependency: 3,
      'code-quality': 2,
      performance: 2,
      documentation: 1
    };

    // Sort issues by priority (severity + type)
    const prioritizedIssues = issues
      .map((issue, index) => {
        const severityScore = severityWeight[issue.severity] || 1;
        const typeScore = typeWeight[issue.type] || 1;
        const priorityScore = (severityScore * 2) + typeScore;

        // Generate fix steps based on issue type
        const fixSteps = generateFixSteps(issue);
        
        // Estimate time based on complexity
        const estimatedTime = estimateFixTime(issue);

        return {
          priority: index + 1, // Will be reassigned after sorting
          severity: issue.severity,
          type: issue.type,
          file: issue.file,
          title: issue.title,
          explanation: generateExplanation(issue),
          fixSteps,
          estimatedTime,
          originalIssue: issue,
          priorityScore
        };
      })
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .map((issue, index) => {
        // Reassign priority after sorting
        const { priorityScore, originalIssue, ...rescuePlan } = issue;
        return {
          ...rescuePlan,
          priority: index + 1
        };
      });

    console.log(`✅ Rescue plan created with ${prioritizedIssues.length} prioritized items`);
    res.json(prioritizedIssues);

  } catch (error) {
    console.error('Error creating rescue plan:', error);
    res.status(500).json({ 
      error: 'Failed to create rescue plan',
      message: error.message 
    });
  }
});

/**
 * Generate detailed explanation for an issue
 */
function generateExplanation(issue) {
  const explanations = {
    dependency: `This dependency issue affects your project's stability and security. ${issue.description} Keeping dependencies up-to-date ensures you have the latest features, bug fixes, and security patches.`,
    security: `This is a security vulnerability that could expose your application to attacks. ${issue.description} Addressing security issues should be a top priority to protect your users and data.`,
    'code-quality': `This code quality issue may lead to bugs or maintenance difficulties. ${issue.description} Improving code quality makes your codebase more maintainable and reduces technical debt.`,
    performance: `This performance issue could impact user experience. ${issue.description} Optimizing performance ensures your application runs smoothly for all users.`,
    documentation: `This documentation issue makes it harder for developers to understand the code. ${issue.description} Good documentation improves team collaboration and onboarding.`
  };

  return explanations[issue.type] || issue.description;
}

/**
 * Generate step-by-step fix instructions
 */
function generateFixSteps(issue) {
  const stepsByType = {
    dependency: [
      `Open ${issue.file}`,
      `Locate the outdated dependency`,
      `Update the version number to the latest stable version`,
      `Run 'npm install' to update the dependency`,
      `Test your application to ensure compatibility`,
      `Commit the changes`
    ],
    security: [
      `Review the code in ${issue.file} at line ${issue.line}`,
      `Identify where user input is being used`,
      `Install a sanitization library (e.g., DOMPurify)`,
      `Sanitize all user inputs before use`,
      `Add input validation`,
      `Test with various inputs including malicious ones`,
      `Commit the security fix`
    ],
    'code-quality': [
      `Open ${issue.file}`,
      `Review the code around line ${issue.line}`,
      `Implement the recommended improvement`,
      `Add appropriate error handling`,
      `Write or update tests`,
      `Run linter and fix any warnings`,
      `Commit the improvements`
    ],
    performance: [
      `Profile the code in ${issue.file}`,
      `Identify the performance bottleneck`,
      `Implement optimization techniques`,
      `Measure performance improvements`,
      `Ensure functionality is preserved`,
      `Commit the optimization`
    ],
    documentation: [
      `Open ${issue.file}`,
      `Add clear comments explaining the code`,
      `Update or create README documentation`,
      `Add JSDoc comments for functions`,
      `Include usage examples`,
      `Commit the documentation`
    ]
  };

  return stepsByType[issue.type] || [
    `Review ${issue.file}`,
    `Implement the recommended fix`,
    `Test the changes`,
    `Commit the fix`
  ];
}

/**
 * Estimate time to fix based on issue complexity
 */
function estimateFixTime(issue) {
  const baseTime = {
    critical: 30,
    high: 20,
    medium: 10,
    low: 5
  };

  const typeMultiplier = {
    security: 1.5,
    dependency: 1.0,
    'code-quality': 1.2,
    performance: 1.8,
    documentation: 0.8
  };

  const minutes = Math.round(
    (baseTime[issue.severity] || 10) * (typeMultiplier[issue.type] || 1)
  );

  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  }
}

export default router;

// Made with Bob
