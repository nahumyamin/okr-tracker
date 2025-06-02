import React, { useEffect } from 'react';

function CompletionCelebration({ isVisible, onAnimationComplete, okrTitle }) {
  useEffect(() => {
    if (isVisible) {
      // Auto-hide after animation completes
      const timer = setTimeout(() => {
        onAnimationComplete();
      }, 3000); // 3 seconds total animation time

      return () => clearTimeout(timer);
    }
  }, [isVisible, onAnimationComplete]);

  if (!isVisible) return null;

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

      {/* Main Celebration Content */}
      <div className="completion-content">
        <div className="trophy-container">
          <i className="fas fa-trophy trophy-icon"></i>
        </div>
        <h2 className="completion-title">OKR Completed!</h2>
        <p className="completion-subtitle">"{okrTitle}"</p>
        <div className="completion-message">
          <i className="fas fa-star"></i>
          Great job achieving your objective!
          <i className="fas fa-star"></i>
        </div>
      </div>
    </div>
  );
}

export default CompletionCelebration; 