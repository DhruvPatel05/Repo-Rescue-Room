import { useState } from 'react';
import './CodeFix.css';

function CodeFix({ issue, onApplyFix, onClose }) {
  const [isApplying, setIsApplying] = useState(false);
  
  if (!issue || !issue.fix) {
    return null;
  }
  
  // Extract fix data from the backend response
  const fix = issue.fix;
  const currentIssue = {
    file: fix.file || issue.file,
    type: fix.type || issue.type,
    severity: fix.severity || issue.severity,
    description: fix.description || fix.fix_explanation || issue.explanation || issue.description,
    brokenCode: fix.original_code || '',
    fixedCode: fix.fixed_code || '',
    fixExplanation: fix.fix_explanation || '',
    startLine: 1,
    endLine: (fix.original_code || '').split('\n').length,
  };
  
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
          <p>{currentIssue.fixExplanation}</p>
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
