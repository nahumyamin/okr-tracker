import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation({ user, theme, onToggleTheme, onShowAuth, onSignOut }) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    onSignOut();
  };

  const handleMobileAuth = () => {
    setMobileMenuOpen(false);
    onShowAuth();
  };

  const handleMobileThemeToggle = () => {
    onToggleTheme();
  };

  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-brand">
            <i className="fas fa-bullseye"></i>
            OKR Tracker
          </Link>
          
          {/* Desktop Navigation */}
          <div className="nav-actions desktop-nav">
            <Link 
              to="/okrs" 
              className={`nav-link ${location.pathname === '/okrs' ? 'active' : ''}`}
            >
              My OKRs
            </Link>
            
            <Link 
              to="/about" 
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
            >
              About
            </Link>
            
            <button
              className="btn btn-icon"
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <i className={`fas fa-${theme === 'dark' ? 'sun' : 'moon'}`}></i>
            </button>
            
            {user ? (
              <div className="user-menu" ref={dropdownRef}>
                <button 
                  className="btn btn-icon user-menu-toggle"
                  onClick={toggleUserDropdown}
                  title="User menu"
                >
                  <i className="fas fa-user"></i>
                </button>
                
                {userDropdownOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <div className="user-avatar">
                        <i className="fas fa-user"></i>
                      </div>
                      <div className="user-details">
                        <div className="user-email">{user.email}</div>
                        <div className="user-status">Signed in</div>
                      </div>
                    </div>
                    
                    <div className="user-dropdown-divider"></div>
                    
                    <button 
                      className="user-dropdown-item"
                      onClick={handleSignOut}
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="btn btn-primary" onClick={onShowAuth}>
                <i className="fas fa-sign-in-alt"></i>
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <div className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-content">
            <div className="mobile-menu-header">
              <Link to="/" className="mobile-nav-brand" onClick={() => setMobileMenuOpen(false)}>
                <i className="fas fa-bullseye"></i>
                OKR Tracker
              </Link>
              <button 
                className="mobile-menu-close"
                onClick={toggleMobileMenu}
                aria-label="Close mobile menu"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="mobile-menu-items">
              <Link 
                to="/okrs" 
                className={`mobile-nav-link ${location.pathname === '/okrs' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                My OKRs
              </Link>
              
              <Link 
                to="/about" 
                className={`mobile-nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              
              <div className="mobile-menu-divider"></div>
              
              <button
                className="mobile-nav-button"
                onClick={handleMobileThemeToggle}
              >
                <i className={`fas fa-${theme === 'dark' ? 'sun' : 'moon'}`}></i>
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              
              {user ? (
                <div className="mobile-user-section">
                  <div className="mobile-user-info">
                    <div className="mobile-user-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="mobile-user-details">
                      <div className="mobile-user-email">{user.email}</div>
                      <div className="mobile-user-status">Signed in</div>
                    </div>
                  </div>
                  <button 
                    className="mobile-nav-button mobile-sign-out"
                    onClick={handleSignOut}
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  className="mobile-nav-button mobile-sign-in"
                  onClick={handleMobileAuth}
                >
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation; 