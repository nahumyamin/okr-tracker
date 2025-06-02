import React from 'react';

function StatsSection({ activeOKRs, completedOKRs }) {
  const totalOKRs = activeOKRs.length + completedOKRs.length;
  
  // Empty state when no OKRs exist
  if (totalOKRs === 0) {
    return (
      <div className="stats-section">
        <div className="stats-empty">
          <i className="fas fa-chart-bar stats-empty-icon"></i>
          <p className="stats-empty-text">Your OKR stats will appear here once you create your first objective</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-target"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{activeOKRs.length}</div>
            <div className="stat-label">Active OKRs</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon completed">
            <i className="fas fa-trophy"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{completedOKRs.length}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon total">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{totalOKRs}</div>
            <div className="stat-label">Total OKRs</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsSection; 