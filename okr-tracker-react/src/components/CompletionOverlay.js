import React, { useEffect } from 'react';

function CompletionOverlay({ okrTitle, onClose }) {
  useEffect(() => {
    // Auto close after 3 seconds
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="completion-overlay">
      {/* Confetti Background */}
      <div className="confetti-container">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              '--delay': `${Math.random() * 3}s`,
              '--x': `${Math.random() * 100}vw`,
              '--rotation': `${Math.random() * 360}deg`,
              '--color': `hsl(${Math.random() * 360}, 70%, 60%)`
            }}
          />
        ))}
      </div>

      <div className="completion-content">
        <div className="completion-animation">
          <div className="completion-circle">
            <i className="fas fa-trophy completion-icon"></i>
          </div>
        </div>
        
        <div className="completion-text">
          <h2>🎉 Congratulations!</h2>
          <p>You've completed:</p>
          <h3>"{okrTitle}"</h3>
          <div className="completion-message">
            <p>Another goal achieved! Keep up the great work!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompletionOverlay; 