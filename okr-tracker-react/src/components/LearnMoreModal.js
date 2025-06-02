import React from 'react';

function LearnMoreModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-lightbulb"></i>
            Learn About OKRs
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="learn-more-content">
            <h3>What are OKRs?</h3>
            <p>
              OKRs (Objectives and Key Results) is a goal-setting framework used by companies 
              like Google, Intel, and many startups to set and track ambitious goals.
            </p>

            <h3>Structure</h3>
            <ul>
              <li><strong>Objective:</strong> A qualitative, inspiring goal (What you want to achieve)</li>
              <li><strong>Key Results:</strong> 3-5 quantitative metrics that measure progress (How you'll know you're making progress)</li>
            </ul>

            <h3>Best Practices</h3>
            <ul>
              <li>Keep objectives inspiring and memorable</li>
              <li>Make key results specific and measurable</li>
              <li>Aim for 70% achievement (stretch goals)</li>
              <li>Review and update progress regularly</li>
              <li>Limit to 3-5 OKRs per quarter</li>
            </ul>

            <h3>Example OKR</h3>
            <div className="example-okr">
              <strong>Objective:</strong> Launch an amazing mobile app<br />
              <strong>Key Results:</strong>
              <ul style={{ marginTop: 'var(--space-2)' }}>
                <li>10,000 app downloads in first month</li>
                <li>4.5+ star rating in app stores</li>
                <li>50% user retention after 7 days</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

export default LearnMoreModal; 