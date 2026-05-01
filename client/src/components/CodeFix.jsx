import { useState } from 'react';
import './CodeFix.css';

function CodeFix({ issue, onApplyFix, onClose }) {
  const [isApplying, setIsApplying] = useState(false);
  
  // Sample data if no issue provided
  const defaultIssue = {
    file: 'src/auth/login.js',
    type: 'Security Vulnerability',
    severity: 'critical',
    description: 'SQL injection vulnerability in login form - user input not sanitized',
    brokenCode: `function authenticateUser(username, password) {
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  
  const result = db.execute(query);
  
  if (result.length > 0) {
    return { success: true, user: result[0] };
  }
  
  return { success: false, error: 'Invalid credentials' };
}`,
    fixedCode: `import { hash, compare } from 'bcrypt';
import { escape } from 'sql-string';

async function authenticateUser(username, password) {
  // Sanitize inputs
  const safeUsername = escape(username);
  
  // Use parameterized query to prevent SQL injection
  const query = "SELECT * FROM users WHERE username = ?";
  const result = await db.execute(query, [safeUsername]);
  
  if (result.length > 0) {
    // Use bcrypt to compare hashed passwords
    const isValid = await compare(password, result[0].password_hash);
    
    if (isValid) {
      return { success: true, user: result[0] };
    }
  }
  
  return { success: false, error: 'Invalid credentials' };
}`,
    startLine: 15,
    endLine: 25,
  };
  
  const currentIssue = issue || defaultIssue;
  
  const handleApplyFix = async () => {
    setIsApplying(true);
    
    // Simulate applying fix
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (onApplyFix) {
      onApplyFix(currentIssue);
    }
    
    setIsApplying(false);
  };
  
  const brokenLines = currentIssue.brokenCode.split('\n');
  const fixedLines = currentIssue.fixedCode.split('\n');
  
  return (
    <div className="code-fix">
      <div className="code-fix-header">
        <div className="header-content">
          <div className="file-info">
            <svg className="icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#file-icon"></use>
            </svg>
            <span className="file-path">{currentIssue.file}</span>
            <span className="line-range">
              Lines {currentIssue.startLine}-{currentIssue.endLine}
            </span>
          </div>
          
          <div className="issue-info">
            <span className={`severity-badge ${currentIssue.severity}`}>
              {currentIssue.severity}
            </span>
            <span className="type-badge">{currentIssue.type}</span>
          </div>
        </div>
        
        {onClose && (
          <button className="close-button" onClick={onClose} aria-label="Close">
            <svg className="icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#x-close-icon"></use>
            </svg>
          </button>
        )}
      </div>
      
      <div className="issue-description-box">
        <svg className="icon" role="presentation" aria-hidden="true">
          <use href="/icons.svg#alert-circle-icon"></use>
        </svg>
        <p>{currentIssue.description}</p>
      </div>
      
      <div className="diff-viewer">
        <div className="diff-panel broken">
          <div className="panel-header">
            <svg className="icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#x-close-icon"></use>
            </svg>
            <span>Broken Code</span>
          </div>
          <div className="code-content">
            <pre className="code-block">
              {brokenLines.map((line, index) => (
                <div key={index} className="code-line">
                  <span className="line-number">{currentIssue.startLine + index}</span>
                  <span className="line-content">{line || ' '}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
        
        <div className="diff-divider">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#code-icon"></use>
          </svg>
        </div>
        
        <div className="diff-panel fixed">
          <div className="panel-header">
            <svg className="icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#check-icon"></use>
            </svg>
            <span>Bob's Fixed Code</span>
          </div>
          <div className="code-content">
            <pre className="code-block">
              {fixedLines.map((line, index) => (
                <div key={index} className="code-line">
                  <span className="line-number">{currentIssue.startLine + index}</span>
                  <span className="line-content">{line || ' '}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
      
      <div className="code-fix-footer">
        <div className="fix-explanation">
          <h3>What Bob Fixed:</h3>
          <ul>
            <li>Added input sanitization using SQL escape function</li>
            <li>Implemented parameterized queries to prevent SQL injection</li>
            <li>Added bcrypt for secure password comparison</li>
            <li>Made function async for proper password hashing</li>
          </ul>
        </div>
        
        <button 
          className={`apply-fix-button ${isApplying ? 'applying' : ''}`}
          onClick={handleApplyFix}
          disabled={isApplying}
        >
          {isApplying ? (
            <>
              <span className="spinner"></span>
              Applying Fix...
            </>
          ) : (
            <>
              <svg className="icon" role="presentation" aria-hidden="true">
                <use href="/icons.svg#check-icon"></use>
              </svg>
              Apply Fix
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default CodeFix;

// Made with Bob
