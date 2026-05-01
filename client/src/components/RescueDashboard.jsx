import { useState, useEffect } from 'react';
import './RescueDashboard.css';

function RescueDashboard({ healthScore = 45, issues = {} }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  // Default issue counts
  const issueData = {
    critical: issues.critical || 3,
    high: issues.high || 7,
    medium: issues.medium || 12,
    low: issues.low || 8,
  };
  
  const totalIssues = Object.values(issueData).reduce((sum, count) => sum + count, 0);
  const fixedIssues = Math.floor(totalIssues * (healthScore / 100));
  const remainingIssues = totalIssues - fixedIssues;
  
  // Animate health score on mount
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = healthScore / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= healthScore) {
        setAnimatedScore(healthScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [healthScore]);
  
  // Determine health status and color
  const getHealthStatus = (score) => {
    if (score >= 80) return { status: 'Excellent', color: 'success' };
    if (score >= 60) return { status: 'Good', color: 'info' };
    if (score >= 40) return { status: 'Fair', color: 'warning' };
    return { status: 'Critical', color: 'danger' };
  };
  
  const { status, color } = getHealthStatus(healthScore);
  
  // Calculate circle progress
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  
  return (
    <div className="rescue-dashboard">
      <div className="dashboard-header">
        <h1>Repository Health Dashboard</h1>
        <p className="dashboard-subtitle">Real-time analysis of your codebase</p>
      </div>
      
      <div className="dashboard-grid">
        {/* Health Score Circle */}
        <div className="health-score-card">
          <h2>Health Score</h2>
          <div className="score-circle-container">
            <svg className="score-circle" viewBox="0 0 160 160">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="var(--border)"
                strokeWidth="12"
              />
              {/* Progress circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={`var(--${color})`}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform="rotate(-90 80 80)"
                className="score-progress"
              />
            </svg>
            <div className="score-content">
              <div className={`score-value ${color}`}>{animatedScore}</div>
              <div className="score-status">{status}</div>
            </div>
          </div>
          <div className={`health-indicator ${color}`}>
            <svg className="icon" role="presentation" aria-hidden="true">
              <use href={`/icons.svg#${healthScore >= 60 ? 'check' : 'alert-circle'}-icon`}></use>
            </svg>
            <span>
              {healthScore >= 80 ? 'Repository is healthy!' : 
               healthScore >= 60 ? 'Minor issues detected' :
               healthScore >= 40 ? 'Attention needed' :
               'Critical issues found'}
            </span>
          </div>
        </div>
        
        {/* Issue Count Cards */}
        <div className="issue-cards">
          <div className="issue-card critical">
            <div className="issue-card-header">
              <svg className="icon" role="presentation" aria-hidden="true">
                <use href="/icons.svg#alert-triangle-icon"></use>
              </svg>
              <span className="issue-label">Critical</span>
            </div>
            <div className="issue-count">{issueData.critical}</div>
            <div className="issue-description">Requires immediate attention</div>
          </div>
          
          <div className="issue-card high">
            <div className="issue-card-header">
              <svg className="icon" role="presentation" aria-hidden="true">
                <use href="/icons.svg#alert-circle-icon"></use>
              </svg>
              <span className="issue-label">High</span>
            </div>
            <div className="issue-count">{issueData.high}</div>
            <div className="issue-description">Should be fixed soon</div>
          </div>
          
          <div className="issue-card medium">
            <div className="issue-card-header">
              <svg className="icon" role="presentation" aria-hidden="true">
                <use href="/icons.svg#activity-icon"></use>
              </svg>
              <span className="issue-label">Medium</span>
            </div>
            <div className="issue-count">{issueData.medium}</div>
            <div className="issue-description">Plan to address</div>
          </div>
          
          <div className="issue-card low">
            <div className="issue-card-header">
              <svg className="icon" role="presentation" aria-hidden="true">
                <use href="/icons.svg#zap-icon"></use>
              </svg>
              <span className="issue-label">Low</span>
            </div>
            <div className="issue-count">{issueData.low}</div>
            <div className="issue-description">Minor improvements</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="progress-card">
          <div className="progress-header">
            <h2>Fix Progress</h2>
            <div className="progress-stats">
              <span className="stat-item success">
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#check-icon"></use>
                </svg>
                {fixedIssues} Fixed
              </span>
              <span className="stat-item danger">
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#alert-circle-icon"></use>
                </svg>
                {remainingIssues} Remaining
              </span>
            </div>
          </div>
          
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ width: `${(fixedIssues / totalIssues) * 100}%` }}
            >
              <span className="progress-label">
                {Math.round((fixedIssues / totalIssues) * 100)}%
              </span>
            </div>
          </div>
          
          <div className="progress-details">
            <div className="detail-item">
              <span className="detail-label">Total Issues</span>
              <span className="detail-value">{totalIssues}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Completion</span>
              <span className="detail-value">{Math.round((fixedIssues / totalIssues) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RescueDashboard;

// Made with Bob
