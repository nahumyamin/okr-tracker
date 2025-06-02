import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation({ user, theme, onToggleTheme, onShowAuth, onSignOut }) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
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

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleSignOut = () => {
    setUserDropdownOpen(false);
    onSignOut();
  };

  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-brand">
            <i className="fas fa-target"></i>
            OKR Tracker
          </Link>
          
          <div className="nav-actions">
            <Link 
              to="/okrs" 
              className={`nav-link ${location.pathname === '/okrs' ? 'active' : ''}`}
            >
              <i className="fas fa-clipboard-list"></i>
              My OKRs
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
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 