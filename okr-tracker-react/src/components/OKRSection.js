import React from 'react';
import OKRItem from './OKRItem';

function OKRSection({ 
  okrs, 
  completedOKRs, 
  completionFlags, 
  user, 
  onCreateOKR, 
  onEditOKR, 
  onDeleteOKR, 
  onUpdateOKR,
  onCompletionCelebration 
}) {
  // Filter only active OKRs
  const activeOKRs = okrs.filter(okr => !completedOKRs.has(okr.id));
  const isEmpty = activeOKRs.length === 0;

  return (
    <section className="okr-section">
      <div className="okr-header">
        <h2>Your OKRs</h2>
        {user && (
          <button className="btn btn-primary" onClick={onCreateOKR}>
            <i className="fas fa-plus"></i>
            Add New OKR
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="empty-state">
          <img src="https://cdn.jsdelivr.net/gh/nahumyamin/okr-tracker-assets/9ba4849b-05fa-4e50-8fa9-e44e77ea2559.png" alt="No OKRs yet" />
          <h3>No OKRs Yet</h3>
          <p>Start tracking your objectives and key results to drive meaningful progress.</p>
          {user ? (
            <button className="btn btn-primary btn-lg" onClick={onCreateOKR}>
              <i className="fas fa-plus"></i>
              Create Your First OKR
            </button>
          ) : (
            <p>Sign in to start creating your OKRs.</p>
          )}
        </div>
      ) : (
        <div className="okr-list">
          {activeOKRs.map(okr => (
            <OKRItem
              key={okr.id}
              okr={okr}
              isCompleted={completedOKRs.has(okr.id)}
              hasCompletionFlag={completionFlags.has(okr.id)}
              onEdit={() => onEditOKR(okr)}
              onDelete={() => onDeleteOKR(okr.id)}
              onUpdateOKR={onUpdateOKR}
              onCompletionCelebration={onCompletionCelebration}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default OKRSection; 