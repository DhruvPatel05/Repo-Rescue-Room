import { useState } from 'react';
import RescueDashboard from './components/RescueDashboard';
import RescuePlan from './components/RescuePlan';
import CodeFix from './components/CodeFix';
import BobChat from './components/BobChat';
import Toast from './components/Toast';
import { scanRepository, createRescuePlan, generateFix } from './services/api';
import './App.css';

function App() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [healthScore, setHealthScore] = useState(0);
  const [scanData, setScanData] = useState(null);
  const [rescuePlan, setRescuePlan] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  
  const handleScan = async (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    
    setIsScanning(true);
    setError(null);
    
    try {
      // Call the backend API to scan the repository
      const data = await scanRepository(repoUrl);
      
      setScanData(data);
      setHealthScore(data.healthScore);
      
      // Automatically create rescue plan from issues
      if (data.issues && data.issues.length > 0) {
        const plan = await createRescuePlan(data.issues);
        setRescuePlan(plan);
      }
      
      setHasScanned(true);
    } catch (err) {
      setError(err.message || 'Failed to scan repository');
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };
  
  const handleFixIssue = async (issue) => {
    try {
      // Generate fix from backend
      const fixData = await generateFix(issue);
      setSelectedIssue({ ...issue, fix: fixData[0] });
    } catch (err) {
      console.error('Fix generation error:', err);
      setError('Failed to generate fix');
    }
  };
  
  const handleApplyFix = (issue) => {
    // Mark issue as resolved
    setSelectedIssue(null);
    // Update health score
    setHealthScore(prev => Math.min(100, prev + 5));
    
    // Show success toast
    setToast({
      message: `✨ Successfully fixed: ${issue.title || issue.type}`,
      type: 'success'
    });
  };
  
  const handleCommitFix = (issue) => {
    // Close the code fix panel
    setSelectedIssue(null);
    // Update health score
    setHealthScore(prev => Math.min(100, prev + 5));
    
    // Show commit success toast
    setToast({
      message: `🚀 Successfully committed fix: ${issue.title || issue.type}`,
      type: 'success'
    });
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
                {error && (
                  <div className="error-message" style={{
                    padding: '12px',
                    marginBottom: '16px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    color: '#ef4444',
                    fontSize: '14px'
                  }}>
                    {error}
                  </div>
                )}
                
                <div className="input-wrapper">
                  <svg className="input-icon" role="presentation" aria-hidden="true">
                    <use href="/icons.svg#github-icon"></use>
                  </svg>
                  <input
                    type="text"
                    className="url-input"
                    placeholder="Enter repository URL (e.g., https://github.com/facebook/react)"
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
                issues={scanData?.summary || {
                  critical: 0,
                  high: 0,
                  medium: 0,
                  low: 0,
                }}
              />
            </section>
            
            <section className="plan-section">
              <RescuePlan
                rescuePlan={rescuePlan}
                onFixIssue={handleFixIssue}
              />
            </section>
            
            {selectedIssue && (
              <section className="codefix-section">
                <CodeFix
                  issue={selectedIssue}
                  onApplyFix={handleApplyFix}
                  onCommitFix={handleCommitFix}
                  onClose={handleCloseCodeFix}
                />
              </section>
            )}
          </main>
        </div>
      )}
      
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={4000}
        />
      )}
      <BobChat />
    </div>
  );
}

export default App;

// Made with Bob
