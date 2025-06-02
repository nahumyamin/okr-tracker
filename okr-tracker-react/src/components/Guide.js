import React, { useState, useEffect } from 'react';

function Guide({ onCreateOKR, onLearnMore }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsExpanded(true); // Always expanded on desktop
      } else {
        setIsExpanded(false); // Collapsed by default on mobile
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleExpanded = () => {
    if (isMobile) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="guide">
      <div className="guide-header">
        <h3>
          <i className="fas fa-lightbulb"></i>
          Getting Started
        </h3>
        <button 
          className="guide-toggle mobile-only"
          onClick={toggleExpanded}
          aria-label="Toggle guide"
        >
          <i className={`fas fa-chevron-down ${isExpanded ? 'expanded' : ''}`}></i>
        </button>
      </div>
      
      <div className={`guide-content ${isExpanded ? 'expanded' : ''}`}>
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

      <div className={`guide-footer ${isExpanded ? 'expanded' : ''}`}>
        <button className="btn btn-secondary btn-block" onClick={onLearnMore}>
          <i className="fas fa-book"></i>
          Learn More About OKRs
        </button>
      </div>
    </div>
  );
}

export default Guide; 