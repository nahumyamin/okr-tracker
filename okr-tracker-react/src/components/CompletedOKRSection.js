import React from 'react';

function CompletedOKRSection({ okrs, completedOKRs, onDeleteOKR }) {
  // Filter only completed OKRs
  const completedOKRsList = okrs.filter(okr => completedOKRs.has(okr.id));

  if (completedOKRsList.length === 0) {
    return null;
  }

  return (
    <section className="okr-section completed-okrs-section">
      <h2 className="completed-section-title">Completed OKRs</h2>
      <div className="completed-okrs-list">
        {completedOKRsList.map(okr => (
          <div key={okr.id} className="okr-item completed" data-okr-id={okr.id}>
            <div className="completed-okr-content">
              <div className="completed-okr-header">
                <h3>{okr.objective}</h3>
                <div className="completed-okr-actions">
                  <div className="completed-badge">
                    <i className="fas fa-trophy"></i>
                    Completed
                  </div>
                  <button 
                    className="btn btn-icon completed-delete-btn" 
                    onClick={() => onDeleteOKR(okr.id)}
                    title="Delete completed OKR"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <div className="completed-details">
                {okr.key_results.map(kr => {
                  if (kr.type === 'milestone') {
                    const totalMilestones = kr.milestones ? kr.milestones.length : 0;
                    return `${kr.text} (${totalMilestones} milestones completed)`;
                  } else {
                    return `${kr.text} (100% completed)`;
                  }
                }).join(' • ')}
              </div>
              <div className="completed-date">
                Completed on {okr.completedAt ? new Date(okr.completedAt).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CompletedOKRSection; 