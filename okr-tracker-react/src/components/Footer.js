import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-text">
          Vibe coded by{' '}
          <a 
            href="https://www.linkedin.com/in/nahumyamin/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            Nahum Yamin
          </a>
        </p>
        <p className="footer-copyright">
          © 2025
        </p>
      </div>
    </footer>
  );
}

export default Footer; 