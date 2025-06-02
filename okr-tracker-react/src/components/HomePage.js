import React from 'react';
import { Link } from 'react-router-dom';

function HomePage({ onLearnMore }) {
    return (
        <div className="hero-page">
            {/* Hero Section */}
            <section className="hero hero-fullscreen">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1>Track Your Goals with Precision</h1>
                            <p>
                                Set ambitious objectives, define measurable key results, and watch your progress unfold. 
                                Our OKR tracker helps you stay focused on what matters most.
                            </p>
                            <div className="hero-actions">
                                <Link to="/okrs" className="btn btn-primary btn-lg">
                                    <i className="fas fa-plus"></i>
                                    Start Tracking OKRs
                                </Link>
                                <button 
                                    className="btn btn-secondary btn-lg"
                                    onClick={onLearnMore}
                                >
                                    <i className="fas fa-play"></i>
                                    Learn More
                                </button>
                            </div>
                        </div>
                        <div className="hero-image">
                            <img src="https://cdn.jsdelivr.net/gh/nahumyamin/okr-tracker-assets/ChatGPT%20Image%20May%2030,%202025%20at%2009_44_28%20PM.png" alt="OKR Dashboard Preview" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage; 