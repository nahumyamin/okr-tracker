import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function AuthModal({ onClose, onAuthSuccess }) {
  const [authMode, setAuthMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      let result;
      
      if (authMode === 'signup') {
        result = await supabase.auth.signUp({
          email,
          password
        });
        
        if (result.error) throw result.error;
        
        if (result.data?.user && !result.data.session) {
          setMessage('Check your email to confirm your account!');
          return;
        }
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (result.error) throw result.error;
      }
      
      if (result.data?.user) {
        onAuthSuccess(result.data.user);
      }
      
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content auth-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header auth-modal-header">
          <div className="auth-header-content">
            <h2 className="auth-title">
              {authMode === 'signup' ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="auth-subtitle">
              {authMode === 'signup' 
                ? 'Please enter your details to create an account.' 
                : 'Please enter your details to sign in.'}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body auth-modal-body">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="auth-email" className="form-label">Email</label>
              <input
                type="email"
                id="auth-email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="auth-password" className="form-label">Password</label>
              <input
                type="password"
                id="auth-password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your Password"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {message && (
              <div className="auth-message">
                {message}
              </div>
            )}

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Processing...
                </>
              ) : (
                authMode === 'signup' ? 'Create account' : 'Sign in'
              )}
            </button>

            <div className="auth-toggle">
              {authMode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button 
                    type="button" 
                    className="auth-toggle-link" 
                    onClick={() => setAuthMode('signin')}
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button 
                    type="button" 
                    className="auth-toggle-link" 
                    onClick={() => setAuthMode('signup')}
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthModal; 