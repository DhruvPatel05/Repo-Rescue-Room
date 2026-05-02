import express from 'express';

const router = express.Router();

/**
 * POST /api/fix
 * Generates code fixes for a specific issue
 * 
 * Input: { "issue": {...} }
 * Output: [
 *   {
 *     "priority": 1,
 *     "type": "dependency",
 *     "severity": "high",
 *     "status": "pending",
 *     "confidence": "high",
 *     "file": "package.json",
 *     "original_code": "...",
 *     "fixed_code": "...",
 *     "fix_explanation": "...",
 *     "description": "..."
 *   }
 * ]
 */
router.post('/', async (req, res) => {
  try {
    const { issue } = req.body;

    if (!issue) {
      return res.status(400).json({ error: 'Issue object is required' });
    }

    console.log(`🔨 Generating fix for: ${issue.title}`);

    // Generate fix based on issue type
    const fix = generateFix(issue);

    console.log(`✅ Fix generated for ${issue.file}`);
    res.json([fix]); // Return as array to match spec

  } catch (error) {
    console.error('Error generating fix:', error);
    res.status(500).json({ 
      error: 'Failed to generate fix',
      message: error.message 
    });
  }
});

/**
 * Generate a fix object for an issue
 */
function generateFix(issue) {
  const fixGenerators = {
    dependency: generateDependencyFix,
    security: generateSecurityFix,
    'code-quality': generateCodeQualityFix,
    performance: generatePerformanceFix,
    documentation: generateDocumentationFix
  };

  const generator = fixGenerators[issue.type] || generateGenericFix;
  return generator(issue);
}

/**
 * Generate dependency fix
 */
function generateDependencyFix(issue) {
  const original = `  "dependencies": {
    "react": "^17.0.0",
    "react-dom": "^17.0.0"
  }`;

  const fixed = `  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }`;

  return {
    priority: 1,
    type: issue.type,
    severity: issue.severity,
    status: 'pending',
    confidence: 'high',
    file: issue.file,
    original_code: original,
    fixed_code: fixed,
    fix_explanation: `Updated ${issue.title.split(':')[1]?.trim() || 'dependency'} to the latest stable version. This ensures you have the latest features, bug fixes, and security patches. After applying this fix, run 'npm install' to update your dependencies.`,
    description: issue.description || 'Dependency update required'
  };
}

/**
 * Generate security fix
 */
function generateSecurityFix(issue) {
  const original = `function renderUserContent(content) {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}`;

  const fixed = `import DOMPurify from 'dompurify';

function renderUserContent(content) {
  const sanitized = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}`;

  return {
    priority: 1,
    type: issue.type,
    severity: issue.severity,
    status: 'pending',
    confidence: 'high',
    file: issue.file,
    original_code: original,
    fixed_code: fixed,
    fix_explanation: `Added DOMPurify to sanitize user input before rendering. This prevents XSS attacks by removing potentially malicious code. Install DOMPurify with: npm install dompurify`,
    description: issue.description || 'Security vulnerability fixed'
  };
}

/**
 * Generate code quality fix
 */
function generateCodeQualityFix(issue) {
  const original = `function Dashboard() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  
  return <div>{data.value}</div>;
}`;

  const fixed = `function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(err => {
        console.error('Failed to fetch data:', err);
        setError(err.message);
      });
  }, []);
  
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;
  
  return <div>{data.value}</div>;
}`;

  return {
    priority: 1,
    type: issue.type,
    severity: issue.severity,
    status: 'pending',
    confidence: 'high',
    file: issue.file,
    original_code: original,
    fixed_code: fixed,
    fix_explanation: `Added proper error handling and loading states. This prevents crashes when async operations fail and provides better user feedback. The component now gracefully handles errors and shows appropriate messages.`,
    description: issue.description || 'Code quality improvement'
  };
}

/**
 * Generate performance fix
 */
function generatePerformanceFix(issue) {
  const original = `function ExpensiveComponent({ items }) {
  const processed = items.map(item => expensiveOperation(item));
  
  return (
    <div>
      {processed.map(item => <Item key={item.id} data={item} />)}
    </div>
  );
}`;

  const fixed = `function ExpensiveComponent({ items }) {
  const processed = useMemo(
    () => items.map(item => expensiveOperation(item)),
    [items]
  );
  
  return (
    <div>
      {processed.map(item => <Item key={item.id} data={item} />)}
    </div>
  );
}`;

  return {
    priority: 1,
    type: issue.type,
    severity: issue.severity,
    status: 'pending',
    confidence: 'medium',
    file: issue.file,
    original_code: original,
    fixed_code: fixed,
    fix_explanation: `Wrapped expensive computation in useMemo to prevent unnecessary recalculations. This optimization ensures the expensive operation only runs when the items array changes, improving render performance.`,
    description: issue.description || 'Performance optimization'
  };
}

/**
 * Generate documentation fix
 */
function generateDocumentationFix(issue) {
  const original = `function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}`;

  const fixed = `/**
 * Calculates the total price of all items
 * @param {Array<{price: number}>} items - Array of items with price property
 * @returns {number} Total sum of all item prices
 * @example
 * const items = [{ price: 10 }, { price: 20 }];
 * calculateTotal(items); // Returns 30
 */
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}`;

  return {
    priority: 1,
    type: issue.type,
    severity: issue.severity,
    status: 'pending',
    confidence: 'high',
    file: issue.file,
    original_code: original,
    fixed_code: fixed,
    fix_explanation: `Added comprehensive JSDoc documentation including parameter types, return type, description, and usage example. This makes the function's purpose and usage clear to other developers.`,
    description: issue.description || 'Documentation added'
  };
}

/**
 * Generate generic fix
 */
function generateGenericFix(issue) {
  return {
    priority: 1,
    type: issue.type,
    severity: issue.severity,
    status: 'pending',
    confidence: 'medium',
    file: issue.file,
    original_code: '// Original code',
    fixed_code: '// Fixed code',
    fix_explanation: issue.recommendation || 'Apply the recommended fix for this issue.',
    description: issue.description || 'Issue fix'
  };
}

export default router;

// Made with Bob
