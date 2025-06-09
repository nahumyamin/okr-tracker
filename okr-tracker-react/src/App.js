import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage';
import OKRPage from './components/OKRPage';
import LearnMoreModal from './components/LearnMoreModal';
import AuthModal from './components/AuthModal';
import { supabase } from './supabaseClient';
import './components.css';

function Navigation({ user, onSignOut, onSignIn }) {
    const location = useLocation();

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
                            className={`btn btn-secondary ${location.pathname === '/okrs' ? 'active' : ''}`}
                        >
                            <i className="fas fa-clipboard-list"></i>
                            My OKRs
                        </Link>
                        
                        <button className="btn btn-icon" id="theme-toggle">
                            <i className="fas fa-moon"></i>
                        </button>
                        
                        {user ? (
                            <>
                                <div className="user-info">
                                    <span>{user.email}</span>
                                </div>
                                <button 
                                    className="btn btn-secondary"
                                    onClick={onSignOut}
                                >
                                    <i className="fas fa-sign-out-alt"></i>
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <button 
                                className="btn btn-primary"
                                onClick={onSignIn}
                            >
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

function App() {
    const [user, setUser] = useState(null);
    const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        // Check initial auth status
        const checkAuthStatus = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
            } catch (error) {
                console.error('Error checking auth status:', error);
            }
        };

        checkAuthStatus();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Theme toggle functionality
    useEffect(() => {
        const themeToggle = document.getElementById('theme-toggle');
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        const currentTheme = localStorage.getItem('theme') || 
                           (prefersDarkScheme.matches ? 'dark' : 'light');
        
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }

            const handleThemeToggle = () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                const icon = themeToggle.querySelector('i');
                if (icon) {
                    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                }
            };

            themeToggle.addEventListener('click', handleThemeToggle);
            
            return () => {
                themeToggle.removeEventListener('click', handleThemeToggle);
            };
        }
    });

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <Router>
            <div className="app">
                <Navigation 
                    user={user}
                    onSignOut={handleSignOut}
                    onSignIn={() => setShowAuthModal(true)}
                />
                
                <main className="main-content">
                    <Routes>
                        <Route 
                            path="/" 
                            element={
                                <HomePage 
                                    onLearnMore={() => setShowLearnMoreModal(true)}
                                />
                            } 
                        />
                        <Route path="/okrs" element={<OKRPage />} />
                    </Routes>
                </main>

                {showLearnMoreModal && (
                    <LearnMoreModal onClose={() => setShowLearnMoreModal(false)} />
                )}

                {showAuthModal && (
                    <AuthModal 
                        onClose={() => setShowAuthModal(false)}
                        onAuthSuccess={(user) => {
                            setUser(user);
                            setShowAuthModal(false);
                        }}
                    />
                )}
            </div>
        </Router>
    );
}

export default App; 