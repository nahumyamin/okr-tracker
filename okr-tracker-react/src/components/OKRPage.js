import React, { useState, useEffect, useCallback } from 'react';
import Guide from './Guide';
import CreateOKRModal from './CreateOKRModal';
import AuthModal from './AuthModal';
import LearnMoreModal from './LearnMoreModal';
import CompletionOverlay from './CompletionOverlay';
import DeleteModal from './DeleteModal';
import { supabase } from '../supabaseClient';

function OKRPage() {
    const [okrs, setOkrs] = useState([]);
    const [completedOKRs, setCompletedOKRs] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);
    const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [okrToDelete, setOkrToDelete] = useState(null);
    const [completedOKRTitle, setCompletedOKRTitle] = useState('');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        } catch (error) {
            console.error('Error checking auth status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadOKRs = useCallback(async () => {
        if (!user) return;
        
        try {
            // Load active OKRs
            const { data: activeOKRs, error: activeError } = await supabase
                .from('okrs')
                .select('*')
                .eq('user_id', user.id)
                .eq('completed', false)
                .order('created_at', { ascending: false });

            if (activeError) throw activeError;

            // Load completed OKRs
            const { data: completedOKRsData, error: completedError } = await supabase
                .from('okrs')
                .select('*')
                .eq('user_id', user.id)
                .eq('completed', true)
                .order('completed_at', { ascending: false });

            if (completedError) throw completedError;

            setOkrs(activeOKRs || []);
            setCompletedOKRs(completedOKRsData || []);
        } catch (error) {
            console.error('Error loading OKRs:', error);
        }
    }, [user]);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    useEffect(() => {
        if (user) {
            loadOKRs();
        }
    }, [user, loadOKRs]);

    const updateKRProgress = async (okrId, krIndex, progress) => {
        try {
            const okr = okrs.find(o => o.id === okrId);
            const updatedKeyResults = [...okr.key_results];
            updatedKeyResults[krIndex].progress = progress;

            const { error } = await supabase
                .from('okrs')
                .update({ 
                    key_results: updatedKeyResults,
                    updated_at: new Date().toISOString()
                })
                .eq('id', okrId);

            if (error) throw error;

            setOkrs(okrs.map(okr => 
                okr.id === okrId 
                    ? { ...okr, key_results: updatedKeyResults }
                    : okr
            ));
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const toggleMilestone = async (okrId, krIndex, milestoneIndex) => {
        try {
            const okr = okrs.find(o => o.id === okrId);
            const updatedKeyResults = [...okr.key_results];
            const milestones = [...updatedKeyResults[krIndex].milestones];
            milestones[milestoneIndex].completed = !milestones[milestoneIndex].completed;
            
            const completedMilestones = milestones.filter(m => m.completed).length;
            const progress = Math.round((completedMilestones / milestones.length) * 100);
            
            updatedKeyResults[krIndex].milestones = milestones;
            updatedKeyResults[krIndex].progress = progress;

            const { error } = await supabase
                .from('okrs')
                .update({ 
                    key_results: updatedKeyResults,
                    updated_at: new Date().toISOString()
                })
                .eq('id', okrId);

            if (error) throw error;

            setOkrs(okrs.map(okr => 
                okr.id === okrId 
                    ? { ...okr, key_results: updatedKeyResults }
                    : okr
            ));
        } catch (error) {
            console.error('Error toggling milestone:', error);
        }
    };

    const markOKRComplete = async (okrId) => {
        try {
            const okr = okrs.find(o => o.id === okrId);
            
            const { error } = await supabase
                .from('okrs')
                .update({ 
                    completed: true,
                    completed_at: new Date().toISOString()
                })
                .eq('id', okrId);

            if (error) throw error;

            setCompletedOKRTitle(okr.objective);
            setShowCompletionOverlay(true);
            
            setTimeout(() => {
                setShowCompletionOverlay(false);
                loadOKRs();
            }, 3000);

        } catch (error) {
            console.error('Error marking OKR complete:', error);
        }
    };

    const deleteOKR = async (okrId) => {
        try {
            // Check if it's a completed OKR
            const isCompleted = completedOKRs.some(okr => okr.id === okrId);
            
            const { error } = await supabase
                .from('okrs')
                .delete()
                .eq('id', okrId);

            if (error) throw error;

            if (isCompleted) {
                setCompletedOKRs(completedOKRs.filter(okr => okr.id !== okrId));
            } else {
                setOkrs(okrs.filter(okr => okr.id !== okrId));
            }
            
            // Reset delete modal state
            setOkrToDelete(null);
        } catch (error) {
            console.error('Error deleting OKR:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="app">
                <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
                    <div>Loading...</div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="app">
                <div className="container okr-page-container">
                    <div className="content-layout">
                        <Guide 
                            onCreateOKR={() => setShowAuthModal(true)} 
                            onLearnMore={() => setShowLearnMoreModal(true)}
                        />
                        <div className="okr-section">
                            <div className="okr-header">
                                <h2>My OKRs</h2>
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => setShowAuthModal(true)}
                                >
                                    <i className="fas fa-plus"></i>
                                    Create OKR
                                </button>
                            </div>
                            <div className="empty-state">
                                <img src="https://cdn.jsdelivr.net/gh/nahumyamin/okr-tracker-assets/9ba4849b-05fa-4e50-8fa9-e44e77ea2559.png" alt="No OKRs yet" />
                                <h3>Ready to set your first OKR?</h3>
                                <p>Create objectives with measurable key results to track your progress and achieve your goals.</p>
                                <button 
                                    className="btn btn-primary btn-lg"
                                    onClick={() => setShowAuthModal(true)}
                                >
                                    <i className="fas fa-plus"></i>
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {showAuthModal && (
                    <AuthModal 
                        onClose={() => setShowAuthModal(false)}
                        onAuthSuccess={(user) => {
                            setUser(user);
                            setShowAuthModal(false);
                        }}
                    />
                )}

                {showLearnMoreModal && (
                    <LearnMoreModal onClose={() => setShowLearnMoreModal(false)} />
                )}
            </div>
        );
    }

    return (
        <div className="app">
            <div className="container okr-page-container">
                <div className="content-layout">
                    <Guide 
                        onCreateOKR={() => setShowCreateModal(true)} 
                        onLearnMore={() => setShowLearnMoreModal(true)}
                    />
                    <div className="okr-section">
                        <div className="okr-header">
                            <h2>My OKRs</h2>
                            <button 
                                className="btn btn-primary"
                                onClick={() => setShowCreateModal(true)}
                            >
                                <i className="fas fa-plus"></i>
                                Create OKR
                            </button>
                        </div>

                        {okrs.length === 0 ? (
                            <div className="empty-state">
                                <img src="https://cdn.jsdelivr.net/gh/nahumyamin/okr-tracker-assets/9ba4849b-05fa-4e50-8fa9-e44e77ea2559.png" alt="No OKRs yet" />
                                <h3>Ready to set your first OKR?</h3>
                                <p>Create objectives with measurable key results to track your progress and achieve your goals.</p>
                                <button 
                                    className="btn btn-primary btn-lg"
                                    onClick={() => setShowCreateModal(true)}
                                >
                                    <i className="fas fa-plus"></i>
                                    Get Started
                                </button>
                            </div>
                        ) : (
                            <div className="okr-list">
                                {okrs.map((okr) => {
                                    const totalProgress = okr.key_results.reduce((sum, kr) => sum + kr.progress, 0);
                                    const averageProgress = Math.round(totalProgress / okr.key_results.length);

                                    return (
                                        <div key={okr.id} className="okr-item">
                                            <div className="okr-header">
                                                <h3>{okr.objective}</h3>
                                                <div className="progress-circle">
                                                    <svg viewBox="0 0 36 36">
                                                        <path
                                                            className="progress-bg"
                                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                            fill="none"
                                                            strokeWidth="2"
                                                        />
                                                        <path
                                                            className="progress"
                                                            strokeDasharray={`${averageProgress}, 100`}
                                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                            fill="none"
                                                            strokeWidth="2"
                                                        />
                                                    </svg>
                                                    <div className="progress-text">{averageProgress}%</div>
                                                </div>
                                            </div>

                                            <div className="key-results">
                                                {okr.key_results.map((kr, krIndex) => (
                                                    <div key={krIndex} className="kr-item">
                                                        <div className="kr-header">
                                                            <div className="kr-text">{kr.text}</div>
                                                            <div className="kr-progress">{kr.progress}%</div>
                                                        </div>
                                                        
                                                        {kr.type === 'percentage' ? (
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="100"
                                                                value={kr.progress}
                                                                onChange={(e) => updateKRProgress(okr.id, krIndex, parseInt(e.target.value))}
                                                                className="progress-slider"
                                                                style={{'--value': `${kr.progress}%`}}
                                                            />
                                                        ) : (
                                                            <div className="milestone-tasks">
                                                                <div className="milestone-list">
                                                                    {kr.milestones.map((milestone, milestoneIndex) => (
                                                                        <div 
                                                                            key={milestoneIndex} 
                                                                            className={`milestone-item ${milestone.completed ? 'completed' : ''}`}
                                                                        >
                                                                            <div 
                                                                                className="milestone-checkbox"
                                                                                onClick={() => toggleMilestone(okr.id, krIndex, milestoneIndex)}
                                                                            >
                                                                                <i className="fas fa-check"></i>
                                                                            </div>
                                                                            <div className="milestone-text">{milestone.text}</div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="okr-actions">
                                                {averageProgress === 100 && (
                                                    <button 
                                                        className="btn btn-primary"
                                                        onClick={() => markOKRComplete(okr.id)}
                                                    >
                                                        <i className="fas fa-trophy"></i>
                                                        Mark as Complete
                                                    </button>
                                                )}
                                                <button 
                                                    className="btn-text btn-text-danger"
                                                    onClick={() => {
                                                        setOkrToDelete(okr.id);
                                                        setShowDeleteModal(true);
                                                    }}
                                                >
                                                    Delete OKR
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Completed OKRs Section */}
                {completedOKRs.length > 0 && (
                    <div className="completed-okrs-layout">
                        <div></div>
                        <div className="completed-okrs-section">
                            <h2 className="completed-section-title">Completed OKRs</h2>
                            <div className="completed-okrs-list">
                                {completedOKRs.map((okr) => (
                                    <div key={okr.id} className="okr-item completed">
                                        <div className="completed-okr-content">
                                            <div className="completed-okr-header">
                                                <h3>{okr.objective}</h3>
                                                <div className="completed-okr-actions">
                                                    <div className="completed-badge">
                                                        <i className="fas fa-trophy"></i>
                                                        Completed
                                                    </div>
                                                    <button 
                                                        className="btn btn-icon btn-danger completed-delete-btn"
                                                        onClick={() => {
                                                            setOkrToDelete(okr.id);
                                                            setShowDeleteModal(true);
                                                        }}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="completed-details">
                                                {okr.key_results.length} key results completed
                                            </div>
                                            <div className="completed-date">
                                                Completed on {new Date(okr.completed_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showCreateModal && (
                <CreateOKRModal 
                    onClose={() => setShowCreateModal(false)}
                    onOKRCreated={() => {
                        setShowCreateModal(false);
                        loadOKRs();
                    }}
                    user={user}
                />
            )}

            {showCompletionOverlay && (
                <CompletionOverlay 
                    okrTitle={completedOKRTitle}
                    onClose={() => setShowCompletionOverlay(false)}
                />
            )}

            {showLearnMoreModal && (
                <LearnMoreModal onClose={() => setShowLearnMoreModal(false)} />
            )}

            {showDeleteModal && (
                <DeleteModal 
                    onClose={() => {
                        setShowDeleteModal(false);
                        setOkrToDelete(null);
                    }}
                    onConfirm={() => {
                        deleteOKR(okrToDelete);
                        setShowDeleteModal(false);
                    }}
                />
            )}
        </div>
    );
}

export default OKRPage; 