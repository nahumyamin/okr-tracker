import React, { useState, useEffect } from 'react';

function OKRModal({ editingOKR, onClose, onSave }) {
  const [objective, setObjective] = useState('');
  const [keyResults, setKeyResults] = useState([
    {
      type: 'numeric',
      text: '',
      milestones: [],
      progress: 0
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form when editing or reset when creating new
  useEffect(() => {
    if (editingOKR) {
      setObjective(editingOKR.objective || '');
      setKeyResults(editingOKR.key_results && editingOKR.key_results.length > 0 ? 
        editingOKR.key_results.map(kr => ({
          type: kr.type || 'numeric',
          text: kr.text || '',
          milestones: kr.milestones || [],
          progress: kr.progress || 0
        })) : 
        [{
          type: 'numeric',
          text: '',
          milestones: [],
          progress: 0
        }]
      );
    } else {
      setObjective('');
      setKeyResults([{
        type: 'numeric',
        text: '',
        milestones: [],
        progress: 0
      }]);
    }
    setErrors({});
  }, [editingOKR]);

  const showError = (field, message) => {
    setErrors(prev => ({ ...prev, [field]: message }));
    setTimeout(() => {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }, 5000);
  };

  const addKeyResult = () => {
    setKeyResults(prev => [...prev, {
      type: 'numeric',
      text: '',
      milestones: [],
      progress: 0
    }]);
  };

  const removeKeyResult = (index) => {
    if (keyResults.length > 1) {
      setKeyResults(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateKeyResult = (index, field, value) => {
    setKeyResults(prev => prev.map((kr, i) => {
      if (i === index) {
        const updatedKr = { ...kr, [field]: value };
        
        // When switching to milestone type, ensure at least one milestone exists
        if (field === 'type' && value === 'milestone' && updatedKr.milestones.length === 0) {
          updatedKr.milestones = [{ text: '', completed: false }];
        }
        
        return updatedKr;
      }
      return kr;
    }));
  };

  const addMilestone = (krIndex) => {
    setKeyResults(prev => prev.map((kr, i) => 
      i === krIndex ? {
        ...kr,
        milestones: [...kr.milestones, { text: '', completed: false }]
      } : kr
    ));
  };

  const removeMilestone = (krIndex, milestoneIndex) => {
    setKeyResults(prev => prev.map((kr, i) => {
      if (i === krIndex && kr.milestones.length > 1) {
        return {
          ...kr,
          milestones: kr.milestones.filter((_, mi) => mi !== milestoneIndex)
        };
      }
      return kr;
    }));
  };

  const updateMilestone = (krIndex, milestoneIndex, text) => {
    setKeyResults(prev => prev.map((kr, i) => 
      i === krIndex ? {
        ...kr,
        milestones: kr.milestones.map((milestone, mi) => 
          mi === milestoneIndex ? { ...milestone, text } : milestone
        )
      } : kr
    ));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate objective
    if (!objective.trim()) {
      newErrors.objective = 'Please enter an objective';
      showError('objective', 'Please enter an objective');
      return false;
    }

    // Validate key results
    let hasValidKR = false;
    for (let i = 0; i < keyResults.length; i++) {
      const kr = keyResults[i];
      
      if (kr.type === 'milestone') {
        const validMilestones = kr.milestones.filter(m => m.text.trim());
        if (validMilestones.length === 0) {
          showError(`kr-${i}`, 'At least one milestone is required for milestone-type key results');
          return false;
        }
        hasValidKR = true;
      } else if (kr.text.trim()) {
        hasValidKR = true;
      }
    }

    if (!hasValidKR) {
      showError('kr-0', 'At least one key result is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Process key results
      const processedKeyResults = keyResults
        .filter(kr => {
          if (kr.type === 'milestone') {
            return kr.milestones.some(m => m.text.trim());
          }
          return kr.text.trim();
        })
        .map(kr => ({
          type: kr.type,
          text: kr.text.trim() || `${kr.type === 'milestone' ? 'Milestone' : 'Numeric'} KR`,
          milestones: kr.type === 'milestone' ? 
            kr.milestones.filter(m => m.text.trim()).map(m => ({ ...m, text: m.text.trim() })) : 
            [],
          progress: kr.progress || 0
        }));

      const okrData = {
        objective: objective.trim(),
        key_results: processedKeyResults
      };

      if (editingOKR) {
        await onSave(editingOKR.id, okrData);
      } else {
        await onSave(okrData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving OKR:', error);
      showError('submit', 'Failed to save OKR. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-plus-circle"></i>
            {editingOKR ? 'Edit OKR' : 'Add New OKR'}
          </h2>
          <button className="modal-close" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="objective">Objective</label>
              <input
                type="text"
                id="objective"
                className="form-input"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="What do you want to achieve?"
                required
              />
              {errors.objective && (
                <div className="form-error">{errors.objective}</div>
              )}
            </div>

            <div className="form-group">
              <label>Key Results</label>
              
              {keyResults.map((kr, krIndex) => (
                <div key={krIndex} className="kr-container">
                  <div className="kr-header-controls">
                    <div className="kr-type-selector">
                      <button
                        type="button"
                        className={`kr-type-option ${kr.type === 'numeric' ? 'active' : ''}`}
                        onClick={() => updateKeyResult(krIndex, 'type', 'numeric')}
                      >
                        <i className="fas fa-chart-line"></i>
                        Numeric Progress
                      </button>
                      <button
                        type="button"
                        className={`kr-type-option ${kr.type === 'milestone' ? 'active' : ''}`}
                        onClick={() => updateKeyResult(krIndex, 'type', 'milestone')}
                      >
                        <i className="fas fa-tasks"></i>
                        Milestone Tasks
                      </button>
                    </div>
                    {keyResults.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-icon remove-kr-btn"
                        title="Remove Key Result"
                        onClick={() => removeKeyResult(krIndex)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>

                  {kr.type === 'numeric' ? (
                    <input
                      type="text"
                      className="form-input kr-input"
                      value={kr.text}
                      onChange={(e) => updateKeyResult(krIndex, 'text', e.target.value)}
                      placeholder="What is your key result?"
                      required
                    />
                  ) : (
                    <div className="milestone-tasks">
                      <input
                        type="text"
                        className="form-input kr-input"
                        value={kr.text}
                        onChange={(e) => updateKeyResult(krIndex, 'text', e.target.value)}
                        placeholder="What is your key result? (optional description)"
                      />
                      
                      <div className="milestone-list">
                        {kr.milestones.map((milestone, milestoneIndex) => (
                          <div key={milestoneIndex} className="milestone-item milestone-input-wrapper">
                            <input
                              type="text"
                              className="milestone-text form-input"
                              value={milestone.text}
                              onChange={(e) => updateMilestone(krIndex, milestoneIndex, e.target.value)}
                              placeholder="Enter milestone task..."
                              required
                            />
                            {kr.milestones.length > 1 && (
                              <button
                                type="button"
                                className="milestone-remove"
                                onClick={() => removeMilestone(krIndex, milestoneIndex)}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            )}
                          </div>
                        ))}
                        
                        <button
                          type="button"
                          className="btn btn-secondary add-milestone-btn"
                          onClick={() => addMilestone(krIndex)}
                        >
                          <i className="fas fa-plus"></i>
                          Add Milestone
                        </button>
                      </div>
                    </div>
                  )}

                  {errors[`kr-${krIndex}`] && (
                    <div className="form-error">{errors[`kr-${krIndex}`]}</div>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="btn btn-secondary add-kr-btn"
                onClick={addKeyResult}
              >
                <i className="fas fa-plus"></i>
                Add Another Key Result
              </button>
            </div>

            {errors.submit && (
              <div className="form-error">{errors.submit}</div>
            )}

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    {editingOKR ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editingOKR ? 'Update OKR' : 'Create OKR'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OKRModal; 