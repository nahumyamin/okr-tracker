import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import OKRPage from './components/OKRPage';
import AboutPage from './components/AboutPage';
import LearnMoreModal from './components/LearnMoreModal';
import AuthModal from './components/AuthModal';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { supabase } from './supabaseClient';
import './components.css';

function App() {
    const [user, setUser] = useState(null);
    const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [theme, setTheme] = useState('light');

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

    // Theme functionality
    useEffect(() => {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        const currentTheme = localStorage.getItem('theme') || 
                           (prefersDarkScheme.matches ? 'dark' : 'light');
        
        setTheme(currentTheme);
        document.documentElement.setAttribute('data-theme', currentTheme);
    }, []);

    const handleToggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        window.location.reload();
    };

    return (
        <Router>
            <div className="app">
                <Navigation 
                    user={user}
                    theme={theme}
                    onToggleTheme={handleToggleTheme}
                    onShowAuth={() => setShowAuthModal(true)}
                    onSignOut={handleSignOut}
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
                        <Route path="/about" element={<AboutPage />} />
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
                            window.location.reload();
                        }}
                    />
                )}
            </div>
            <Footer />
        </Router>
    );
}

export default App; 