import React from 'react';

function Hero({ onCreateOKR, onLearnMore }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Track Your OKRs with Purpose</h1>
          <p>
            Set ambitious objectives, define measurable key results, and track your progress 
            towards achieving your most important goals. Build accountability and drive results 
            with a structured approach to goal setting.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg hero-shimmer" onClick={onCreateOKR}>
              <i className="fas fa-plus"></i>
              Create Your First OKR
            </button>
            <button className="btn btn-secondary btn-lg" onClick={onLearnMore}>
              <i className="fas fa-lightbulb"></i>
              Learn About OKRs
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://cdn.jsdelivr.net/gh/nahumyamin/okr-tracker-assets/ChatGPT%20Image%20May%2030,%202025%20at%2009_44_28%20PM.png" alt="Goal Tracking 3D" />
        </div>
      </div>
      <div className="hero-bg">
        <div className="hero-shape"></div>
      </div>
    </section>
  );
}

export default Hero; 