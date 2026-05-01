import { useState } from 'react';
import './RescuePlan.css';

function RescuePlan({ issues = [], onFixIssue }) {
  const [filter, setFilter] = useState('all');
  
  // Sample issues if none provided
  const defaultIssues = [
    {
      id: 1,
      priority: 1,
      severity: 'critical',
      type: 'Security Vulnerability',
      file: 'src/auth/login.js',
      description: 'SQL injection vulnerability in login form - user input not sanitized',
      completed: false,
    },
    {
      id: 2,
      priority: 2,
      severity: 'critical',
      type: 'Dependency Issue',
      file: 'package.json',
      description: 'Critical security update needed for express package (CVE-2024-1234)',
      completed: false,
    },
    {
      id: 3,
      priority: 3,
      severity: 'high',
      type: 'Code Quality',
      file: 'src/utils/helpers.js',
      description: 'Memory leak detected in event listener cleanup',
      completed: false,
    },
    {
      id: 4,
      priority: 4,
      severity: 'high',
      type: 'Performance',
      file: 'src/components/DataTable.jsx',
      description: 'Inefficient rendering causing performance bottleneck with large datasets',
      completed: true,
    },
    {
      id: 5,
      priority: 5,
      severity: 'high',
      type: 'Type Error',
      file: 'src/api/client.ts',
      description: 'Type mismatch in API response handler - potential runtime error',
      completed: false,
    },
    {
      id: 6,
      priority: 6,
      severity: 'medium',
      type: 'Code Smell',
      file: 'src/services/payment.js',
      description: 'Complex function with high cyclomatic complexity - needs refactoring',
      completed: true,
    },
    {
      id: 7,
      priority: 7,
      severity: 'medium',
      type: 'Accessibility',
      file: 'src/components/Modal.jsx',
      description: 'Missing ARIA labels and keyboard navigation support',
      completed: false,
    },
    {
      id: 8,
      priority: 8,
      severity: 'low',
      type: 'Documentation',
      file: 'src/hooks/useAuth.js',
      description: 'Missing JSDoc comments for public API functions',
      completed: false,
    },
  ];
  
  const issueList = issues.length > 0 ? issues : defaultIssues;
  
  // Filter issues
  const filteredIssues = issueList.filter(issue => {
    if (filter === 'all') return true;
    if (filter === 'completed') return issue.completed;
    if (filter === 'pending') return !issue.completed;
    return issue.severity === filter;
  });
  
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return 'alert-triangle-icon';
      case 'high':
        return 'alert-circle-icon';
      case 'medium':
        return 'activity-icon';
      case 'low':
        return 'zap-icon';
      default:
        return 'alert-circle-icon';
    }
  };
  
  const handleFixClick = (issue) => {
    if (onFixIssue) {
      onFixIssue(issue);
    }
  };
  
  return (
    <div className="rescue-plan">
      <div className="plan-header">
        <div>
          <h1>Rescue Plan</h1>
          <p className="plan-subtitle">Prioritized list of issues to fix</p>
        </div>
        
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({issueList.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({issueList.filter(i => !i.completed).length})
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({issueList.filter(i => i.completed).length})
          </button>
          <div className="filter-divider"></div>
          <button 
            className={`filter-btn severity-filter critical ${filter === 'critical' ? 'active' : ''}`}
            onClick={() => setFilter('critical')}
          >
            Critical
          </button>
          <button 
            className={`filter-btn severity-filter high ${filter === 'high' ? 'active' : ''}`}
            onClick={() => setFilter('high')}
          >
            High
          </button>
          <button 
            className={`filter-btn severity-filter medium ${filter === 'medium' ? 'active' : ''}`}
            onClick={() => setFilter('medium')}
          >
            Medium
          </button>
          <button 
            className={`filter-btn severity-filter low ${filter === 'low' ? 'active' : ''}`}
            onClick={() => setFilter('low')}
          >
            Low
          </button>
        </div>
      </div>
      
      <div className="issues-list">
        {filteredIssues.length === 0 ? (
          <div className="empty-state">
            <svg className="icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#check-icon"></use>
            </svg>
            <h3>No issues found</h3>
            <p>All issues in this category have been resolved!</p>
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <div 
              key={issue.id} 
              className={`issue-item ${issue.completed ? 'completed' : ''} ${issue.severity}`}
            >
              <div className="issue-priority">
                <span className="priority-number">#{issue.priority}</span>
              </div>
              
              <div className="issue-content">
                <div className="issue-header-row">
                  <div className="issue-badges">
                    <span className={`severity-badge ${issue.severity}`}>
                      <svg className="icon" role="presentation" aria-hidden="true">
                        <use href={`/icons.svg#${getSeverityIcon(issue.severity)}`}></use>
                      </svg>
                      {issue.severity}
                    </span>
                    <span className="type-badge">{issue.type}</span>
                  </div>
                  
                  {issue.completed && (
                    <div className="completed-badge">
                      <svg className="icon" role="presentation" aria-hidden="true">
                        <use href="/icons.svg#check-icon"></use>
                      </svg>
                      Fixed
                    </div>
                  )}
                </div>
                
                <div className="issue-file">
                  <svg className="icon" role="presentation" aria-hidden="true">
                    <use href="/icons.svg#file-icon"></use>
                  </svg>
                  {issue.file}
                </div>
                
                <p className="issue-description">{issue.description}</p>
              </div>
              
              <div className="issue-actions">
                {!issue.completed ? (
                  <button 
                    className="fix-button"
                    onClick={() => handleFixClick(issue)}
                  >
                    <svg className="icon" role="presentation" aria-hidden="true">
                      <use href="/icons.svg#code-icon"></use>
                    </svg>
                    Fix with Bob
                  </button>
                ) : (
                  <button className="view-button" disabled>
                    <svg className="icon" role="presentation" aria-hidden="true">
                      <use href="/icons.svg#check-icon"></use>
                    </svg>
                    Resolved
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RescuePlan;

// Made with Bob
