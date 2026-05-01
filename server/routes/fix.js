import express from 'express';
const router = express.Router();

/**
 * POST /api/fix
 * Generate deterministic fixes for detected issues
 */
router.post('/', (req, res) => {
  try {
    const { issues } = req.body;
    
    if (!issues || !Array.isArray(issues)) {
      return res.status(400).json({
        error: 'Invalid input: issues array required'
      });
    }
    
    // Sort by severity for priority
    const SEVERITY_ORDER = { critical: 4, high: 3, medium: 2, low: 1 };
    const sortedIssues = [...issues].sort((a, b) => {
      const severityA = SEVERITY_ORDER[a.severity] || 0;
      const severityB = SEVERITY_ORDER[b.severity] || 0;
      return severityB - severityA;
    });
    
    const fixes = sortedIssues.map((issue, index) => {
      const fix = generateFix(issue);
      
      if (!fix) {
        return {
          priority: index + 1,
          type: issue.type,
          file: issue.file,
          line: issue.line,
          severity: issue.severity,
          description: issue.description,
          original_code: '// No fix available',
          fixed_code: '// Manual fix required',
          fix_explanation: `No automated fix available for issue type: ${issue.type}`,
          affected_files: [issue.file]
        };
      }
      
      return {
        priority: index + 1,
        type: issue.type,
        file: issue.file,
        line: issue.line,
        severity: issue.severity,
        description: issue.description,
        ...fix
      };
    });
    
    res.json(fixes);
    
  } catch (error) {
    console.error('Error generating fix:', error);
    res.status(500).json({
      error: 'Failed to generate fix'
    });
  }
});

/**
 * Generate fix based on issue type
 */
function generateFix(issue) {
  const fixGenerators = {
    'dependency': generateDependencyFix,
    'env': generateEnvFix,
    'secret': generateSecretFix,
    'deprecated': generateDeprecatedFix,
    'test': generateTestFix
  };
  
  const generator = fixGenerators[issue.type];
  return generator ? generator(issue) : null;
}

/**
 * Fix outdated dependencies
 */
function generateDependencyFix(issue) {
  const packageMatch = issue.description.match(/^(\S+)/);
  const packageName = packageMatch ? packageMatch[1] : 'package';
  
  const original_code = `"${packageName}": "^1.0.0"`;
  const fixed_code = `"${packageName}": "^3.0.0"`;
  
  return {
    original_code,
    fixed_code,
    fix_explanation: `Update ${packageName} to latest stable version (v3.x) to resolve security vulnerabilities and compatibility issues. This ensures the package receives security patches and works with modern dependencies.`,
    affected_files: [issue.file]
  };
}

/**
 * Fix missing environment variables
 */
function generateEnvFix(issue) {
  const varMatch = issue.description.match(/Environment variable (\w+)/);
  const varName = varMatch ? varMatch[1] : 'ENV_VAR';
  
  const original_code = `const value = process.env.${varName};`;
  const fixed_code = `// Add to .env.example:\n// ${varName}=your_value_here\n\nconst value = process.env.${varName};`;
  
  return {
    original_code,
    fixed_code,
    fix_explanation: `Document the ${varName} environment variable in .env.example file. This helps other developers understand what environment variables are needed and provides a template for configuration.`,
    affected_files: [issue.file, '.env.example']
  };
}

/**
 * Fix hardcoded secrets
 */
function generateSecretFix(issue) {
  const secretType = issue.description.match(/hardcoded (.+?) detected/)?.[1] || 'secret';
  
  const original_code = `const apiKey = "sk_live_1234567890abcdef";`;
  const fixed_code = `// Add to .env:\n// API_KEY=your_key_here\n\nconst apiKey = process.env.API_KEY;`;
  
  return {
    original_code,
    fixed_code,
    fix_explanation: `Move ${secretType} to environment variables to prevent exposure in version control. Add the variable to .env (gitignored) and document it in .env.example. This protects sensitive credentials from being committed to the repository.`,
    affected_files: [issue.file, '.env', '.env.example', '.gitignore']
  };
}

/**
 * Fix deprecated API usage
 */
function generateDeprecatedFix(issue) {
  const apiMatch = issue.description.match(/Deprecated API (.+?) detected/);
  const apiName = apiMatch ? apiMatch[1] : 'API';
  
  const fixes = {
    'componentWillMount (React)': {
      original: `componentWillMount() {\n  this.setState({ data: [] });\n}`,
      fixed: `componentDidMount() {\n  this.setState({ data: [] });\n}`,
      explanation: 'Replace componentWillMount with componentDidMount. componentWillMount is deprecated and will be removed in future React versions. componentDidMount is the recommended lifecycle method for initialization.'
    },
    'componentWillReceiveProps (React)': {
      original: `componentWillReceiveProps(nextProps) {\n  if (nextProps.value !== this.props.value) {\n    this.setState({ value: nextProps.value });\n  }\n}`,
      fixed: `static getDerivedStateFromProps(props, state) {\n  if (props.value !== state.value) {\n    return { value: props.value };\n  }\n  return null;\n}`,
      explanation: 'Replace componentWillReceiveProps with getDerivedStateFromProps. This is the modern React pattern for deriving state from props and is safer for concurrent rendering.'
    },
    'componentWillUpdate (React)': {
      original: `componentWillUpdate(nextProps, nextState) {\n  console.log('Updating...');\n}`,
      fixed: `componentDidUpdate(prevProps, prevState) {\n  console.log('Updated');\n}`,
      explanation: 'Replace componentWillUpdate with componentDidUpdate. componentWillUpdate is deprecated. Use componentDidUpdate for side effects after updates.'
    },
    'findDOMNode (React)': {
      original: `const node = ReactDOM.findDOMNode(this);`,
      fixed: `// Add ref in constructor:\n// this.nodeRef = React.createRef();\n\nconst node = this.nodeRef.current;`,
      explanation: 'Replace findDOMNode with refs. findDOMNode is deprecated and breaks with StrictMode. Use React refs for direct DOM access.'
    },
    'String.substr': {
      original: `const result = str.substr(0, 5);`,
      fixed: `const result = str.substring(0, 5);`,
      explanation: 'Replace String.substr with String.substring. substr is deprecated and may be removed from JavaScript. substring is the standard method.'
    },
    'new Buffer()': {
      original: `const buf = new Buffer('data');`,
      fixed: `const buf = Buffer.from('data');`,
      explanation: 'Replace new Buffer() with Buffer.from(). The Buffer constructor is deprecated due to security concerns. Buffer.from() is the safe alternative.'
    }
  };
  
  const fix = fixes[apiName] || {
    original: `// Deprecated ${apiName} usage`,
    fixed: `// Modern alternative for ${apiName}`,
    explanation: `Replace deprecated ${apiName} with its modern alternative as recommended in the documentation.`
  };
  
  return {
    original_code: fix.original,
    fixed_code: fix.fixed,
    fix_explanation: fix.explanation,
    affected_files: [issue.file]
  };
}

/**
 * Fix test-related issues
 */
function generateTestFix(issue) {
  if (issue.description.includes('missing file extension')) {
    const pathMatch = issue.description.match(/Import path "([^"]+)"/);
    const importPath = pathMatch ? pathMatch[1] : './module';
    
    const original_code = `import Component from '${importPath}';`;
    const fixed_code = `import Component from '${importPath}.js';`;
    
    return {
      original_code,
      fixed_code,
      fix_explanation: 'Add explicit file extension to import path. Some bundlers and ES modules require explicit extensions for proper module resolution. This prevents import errors in different environments.',
      affected_files: [issue.file]
    };
  }
  
  if (issue.description.includes('no assertions')) {
    const original_code = `describe('Component', () => {\n  it('should work', () => {\n    // Test code\n  });\n});`;
    const fixed_code = `describe('Component', () => {\n  it('should work', () => {\n    const result = someFunction();\n    expect(result).toBe(expectedValue);\n  });\n});`;
    
    return {
      original_code,
      fixed_code,
      fix_explanation: 'Add assertions to test cases. Tests without assertions always pass and provide no validation. Use expect(), assert(), or should to verify expected behavior.',
      affected_files: [issue.file]
    };
  }
  
  return null;
}

export default router;

// Made with Bob
