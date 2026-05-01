import { useState } from 'react';
import RescueDashboard from './components/RescueDashboard';
import RescuePlan from './components/RescuePlan';
import CodeFix from './components/CodeFix';
import BobChat from './components/BobChat';
import './App.css';

function App() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [healthScore, setHealthScore] = useState(45);
  
  const handleScan = (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    
    setIsScanning(true);
    
    // Simulate scanning
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
    }, 2500);
  };
  
  const handleFixIssue = (issue) => {
    setSelectedIssue(issue);
  };
  
  const handleApplyFix = (issue) => {
    // Mark issue as resolved
    setSelectedIssue(null);
    // Update health score
    setHealthScore(prev => Math.min(100, prev + 5));
  };
  
  const handleCloseCodeFix = () => {
    setSelectedIssue(null);
  };
  
  return (
    <div className="app">
      {!hasScanned ? (
        <div className="landing-page">
          <div className="landing-content">
            <div className="hero-section">
              <div className="hero-badge">
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#code-icon"></use>
                </svg>
                <span>Powered by Bob AI</span>
              </div>
              
              <h1 className="hero-title">
                Repo Rescue Room
              </h1>
              
              <p className="hero-subtitle">
                AI-powered repository analysis and automated fixes for your codebase
              </p>
              
              <form className="url-input-form" onSubmit={handleScan}>
                <div className="input-wrapper">
                  <svg className="input-icon" role="presentation" aria-hidden="true">
                    <use href="/icons.svg#github-icon"></use>
                  </svg>
                  <input
                    type="text"
                    className="url-input"
                    placeholder="Enter repository URL (e.g., https://github.com/user/repo)"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    disabled={isScanning}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className={`scan-button ${isScanning ? 'scanning' : ''}`}
                  disabled={isScanning || !repoUrl.trim()}
                >
                  {isScanning ? (
                    <>
                      <span className="spinner"></span>
                      Scanning Repository...
                    </>
                  ) : (
                    <>
                      <svg className="icon" role="presentation" aria-hidden="true">
                        <use href="/icons.svg#activity-icon"></use>
                      </svg>
                      Start Rescue
                    </>
                  )}
                </button>
              </form>
              
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon critical">
                    <svg className="icon" role="presentation" aria-hidden="true">
                      <use href="/icons.svg#alert-triangle-icon"></use>
                    </svg>
                  </div>
                  <h3>Detect Issues</h3>
                  <p>Identify security vulnerabilities, bugs, and code quality issues</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon success">
                    <svg className="icon" role="presentation" aria-hidden="true">
                      <use href="/icons.svg#code-icon"></use>
                    </svg>
                  </div>
                  <h3>Auto-Fix Code</h3>
                  <p>Bob AI generates fixes with detailed explanations</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon info">
                    <svg className="icon" role="presentation" aria-hidden="true">
                      <use href="/icons.svg#activity-icon"></use>
                    </svg>
                  </div>
                  <h3>Track Progress</h3>
                  <p>Monitor repository health and fix completion in real-time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="dashboard-layout">
          <header className="app-header">
            <div className="header-content">
              <div className="logo">
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#code-icon"></use>
                </svg>
                <span>Repo Rescue Room</span>
              </div>
              
              <div className="repo-info">
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                <span className="repo-url">{repoUrl}</span>
              </div>
              
              <button 
                className="new-scan-button"
                onClick={() => {
                  setHasScanned(false);
                  setRepoUrl('');
                  setSelectedIssue(null);
                  setHealthScore(45);
                }}
              >
                <svg className="icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#activity-icon"></use>
                </svg>
                New Scan
              </button>
            </div>
          </header>
          
          <main className="app-main">
            <section className="dashboard-section">
              <RescueDashboard 
                healthScore={healthScore}
                issues={{
                  critical: 3,
                  high: 7,
                  medium: 12,
                  low: 8,
                }}
              />
            </section>
            
            <section className="plan-section">
              <RescuePlan onFixIssue={handleFixIssue} />
            </section>
            
            {selectedIssue && (
              <section className="codefix-section">
                <CodeFix 
                  issue={selectedIssue}
                  onApplyFix={handleApplyFix}
                  onClose={handleCloseCodeFix}
                />
              </section>
            )}
          </main>
        </div>
      )}
      
      <BobChat />
    </div>
  );
}

export default App;

// Made with Bob
