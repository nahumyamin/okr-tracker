import React from 'react';

function Guide({ onCreateOKR, onLearnMore }) {
  return (
    <div className="guide">
      <div className="guide-header">
        <h3>
          <i className="fas fa-lightbulb"></i>
          Getting Started
        </h3>
      </div>
      
      <div className="guide-content">
        <div className="guide-tip">
          <div className="tip-icon">
            <i className="fas fa-bullseye"></i>
          </div>
          <div className="tip-content">
            <h4>Set Clear Objectives</h4>
            <p>Write inspiring, qualitative goals that motivate your team.</p>
          </div>
        </div>

        <div className="guide-tip">
          <div className="tip-icon">
            <i className="fas fa-chart-bar"></i>
          </div>
          <div className="tip-content">
            <h4>Measurable Key Results</h4>
            <p>Define 2-5 quantifiable outcomes that indicate success.</p>
          </div>
        </div>

        <div className="guide-tip">
          <div className="tip-icon">
            <i className="fas fa-sync-alt"></i>
          </div>
          <div className="tip-content">
            <h4>Track Progress</h4>
            <p>Update your progress regularly to stay on track.</p>
          </div>
        </div>

        <div className="guide-tip">
          <div className="tip-icon">
            <i className="fas fa-trophy"></i>
          </div>
          <div className="tip-content">
            <h4>Celebrate Success</h4>
            <p>Acknowledge achievements and learn from the journey.</p>
          </div>
        </div>
      </div>

      <div className="guide-footer">
        <button className="btn btn-secondary" onClick={onLearnMore}>
          <i className="fas fa-book"></i>
          Learn More About OKRs
        </button>
      </div>
    </div>
  );
}

export default Guide; 