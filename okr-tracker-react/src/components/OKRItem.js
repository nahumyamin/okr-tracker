import React from 'react';

function OKRItem({ okr, isCompleted, hasCompletionFlag, onEdit, onDelete, onUpdateOKR }) {
  const calculateAverageProgress = (keyResults) => {
    if (!keyResults || keyResults.length === 0) return 0;
    
    const totalProgress = keyResults.reduce((sum, kr) => {
      if (kr.type === 'milestone' && kr.milestones) {
        // For milestone-type KRs, calculate progress based on completed milestones
        const completedMilestones = kr.milestones.filter(m => m.completed).length;
        const totalMilestones = kr.milestones.length;
        const milestoneProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
        return sum + milestoneProgress;
      }
      return sum + (kr.progress || 0);
    }, 0);
    
    return totalProgress / keyResults.length;
  };

  const averageProgress = calculateAverageProgress(okr.key_results);

  const handleProgressChange = async (krIndex, newProgress) => {
    try {
      const updatedKeyResults = [...okr.key_results];
      updatedKeyResults[krIndex].progress = parseInt(newProgress);
      
      await onUpdateOKR(okr.id, { key_results: updatedKeyResults });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleMilestoneToggle = async (krIndex, milestoneIndex) => {
    try {
      // Add visual feedback
      const checkboxElement = document.querySelector(
        `[data-okr-id="${okr.id}"] [data-kr-index="${krIndex}"] [data-milestone-index="${milestoneIndex}"] .milestone-checkbox`
      );
      if (checkboxElement) {
        checkboxElement.classList.add('checking');
        setTimeout(() => checkboxElement.classList.remove('checking'), 300);
      }

      const updatedKeyResults = [...okr.key_results];
      const currentMilestone = updatedKeyResults[krIndex].milestones[milestoneIndex];
      
      // Toggle the completed state
      updatedKeyResults[krIndex].milestones[milestoneIndex] = {
        ...currentMilestone,
        completed: !currentMilestone.completed
      };

      // Calculate new progress for this KR based on completed milestones
      const kr = updatedKeyResults[krIndex];
      const completedMilestones = kr.milestones.filter(m => m.completed).length;
      const totalMilestones = kr.milestones.length;
      updatedKeyResults[krIndex].progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
      
      await onUpdateOKR(okr.id, { key_results: updatedKeyResults });
    } catch (error) {
      console.error('Error toggling milestone:', error);
    }
  };

  return (
    <div className="okr-item" data-okr-id={okr.id}>
      <div className="okr-header">
        <h3>{okr.objective}</h3>
        <div className="progress-circle">
          <svg viewBox="0 0 36 36">
            <path 
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none" 
              stroke="var(--neutral-200)" 
              strokeWidth="2" 
              className="progress-bg"
            />
            <path 
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none" 
              stroke="var(--primary-500)" 
              strokeWidth="2" 
              className="progress"
              style={{
                strokeDasharray: 100,
                strokeDashoffset: 100 - averageProgress
              }}
            />
          </svg>
          <span className="progress-text">{Math.round(averageProgress)}%</span>
        </div>
      </div>

      <div className="key-results">
        {okr.key_results && okr.key_results.map((kr, index) => (
          <div key={index} className="kr-item" data-kr-index={index}>
            <div className="kr-header">
              <span className="kr-text">{kr.text || 'Untitled Key Result'}</span>
              <div className="kr-progress">
                <span>{kr.progress || 0}%</span>
              </div>
            </div>
            
            {kr.type === 'milestone' && kr.milestones ? (
              <div className="milestone-list">
                {kr.milestones.map((milestone, mIndex) => (
                  <div 
                    key={mIndex} 
                    className={`milestone-item ${milestone.completed ? 'completed' : ''}`}
                    data-milestone-index={mIndex}
                    onClick={() => handleMilestoneToggle(index, mIndex)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="milestone-checkbox">
                      <i className="fas fa-check"></i>
                    </div>
                    <span className="milestone-text">{milestone.text}</span>
                  </div>
                ))}
              </div>
            ) : (
              <input
                type="range"
                min="0"
                max="100"
                value={kr.progress || 0}
                onChange={(e) => handleProgressChange(index, e.target.value)}
                className="progress-slider"
                style={{ '--value': `${kr.progress || 0}%` }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="okr-actions" style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--neutral-200)' }}>
        <button className="btn btn-secondary" onClick={onEdit} style={{ marginRight: 'var(--space-3)' }}>
          <i className="fas fa-edit"></i>
          Edit
        </button>
        <button className="btn btn-danger" onClick={onDelete}>
          <i className="fas fa-trash"></i>
          Delete
        </button>
      </div>
    </div>
  );
}

export default OKRItem; 