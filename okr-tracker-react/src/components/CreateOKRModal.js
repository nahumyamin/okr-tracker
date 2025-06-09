import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function CreateOKRModal({ editingOKR, onClose, onOKRCreated, user }) {
  const [objective, setObjective] = useState('');
  const [keyResults, setKeyResults] = useState([
    {
      type: 'percentage',
      description: '',
      milestones: [],
      progress: 0
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form with editing data
  useEffect(() => {
    if (editingOKR) {
      setObjective(editingOKR.objective || '');
      setKeyResults(editingOKR.key_results && editingOKR.key_results.length > 0 ?
        editingOKR.key_results.map(kr => ({
          type: kr.type || 'percentage',
          description: kr.text || '',
          milestones: kr.milestones || [],
          progress: kr.progress || 0
        })) :
        [{
          type: 'percentage',
          description: '',
          milestones: [],
          progress: 0
        }]
      );
    } else {
      // Reset form for creating new OKR
      setObjective('');
      setKeyResults([{
        type: 'percentage',
        description: '',
        milestones: [],
        progress: 0
      }]);
    }
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
      type: 'percentage',
      description: '',
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
    // Validate objective
    if (!objective.trim()) {
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
      } else if (kr.description.trim()) {
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
          return kr.description.trim();
        })
        .map(kr => ({
          type: kr.type,
          text: kr.description.trim() || `${kr.type === 'milestone' ? 'Milestone' : 'Percentage'} KR`,
          milestones: kr.type === 'milestone' ? 
            kr.milestones.filter(m => m.text.trim()).map(m => ({ ...m, text: m.text.trim() })) : 
            [],
          progress: kr.progress || 0
        }));

      const okrData = {
        objective: objective.trim(),
        key_results: processedKeyResults,
        updated_at: new Date().toISOString()
      };

      if (editingOKR) {
        // Update existing OKR
        const { error } = await supabase
          .from('okrs')
          .update(okrData)
          .eq('id', editingOKR.id);

        if (error) throw error;
      } else {
        // Create new OKR
        okrData.user_id = user.id;
        okrData.completed = false;

      const { error } = await supabase
        .from('okrs')
        .insert([okrData]);

      if (error) throw error;
      }

      onOKRCreated();
    } catch (error) {
      console.error(`Error ${editingOKR ? 'updating' : 'creating'} OKR:`, error);
      showError('submit', `Failed to ${editingOKR ? 'update' : 'create'} OKR. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="modal-content create-okr-modal">
        <div className="modal-header">
          <h2>
            <i className={`fas ${editingOKR ? 'fa-edit' : 'fa-plus-circle'}`}></i>
            {editingOKR ? 'Edit OKR' : 'Create New OKR'}
          </h2>
          <button className="btn btn-icon" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="objective">Objective</label>
              <input
                type="text"
                id="objective"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className={`form-input ${errors.objective ? 'error' : ''}`}
                placeholder="What do you want to achieve?"
                required
              />
              {errors.objective && <div className="error-message">{errors.objective}</div>}
            </div>

            <div className="form-group">
              <label>Key Results</label>
              <div className="kr-container">
                {keyResults.map((kr, index) => (
                  <div key={index} className="kr-item">
                    <div className="kr-header-controls">
                      <div className="kr-type-selector">
                        <button
                          type="button"
                          className={`kr-type-option ${kr.type === 'percentage' ? 'active' : ''}`}
                          onClick={() => updateKeyResult(index, 'type', 'percentage')}
                        >
                          <i className="fas fa-percentage"></i>
                          Percentage
                        </button>
                        <button
                          type="button"
                          className={`kr-type-option ${kr.type === 'milestone' ? 'active' : ''}`}
                          onClick={() => updateKeyResult(index, 'type', 'milestone')}
                        >
                          <i className="fas fa-list-check"></i>
                          Milestones
                        </button>
                      </div>
                      {keyResults.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-icon btn-danger remove-kr-btn"
                          onClick={() => removeKeyResult(index)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        value={kr.description}
                        onChange={(e) => updateKeyResult(index, 'description', e.target.value)}
                        className={`form-input ${errors[`kr-${index}`] ? 'error' : ''}`}
                        placeholder="Describe the key result..."
                        required={kr.type === 'percentage'}
                      />
                      {errors[`kr-${index}`] && <div className="error-message">{errors[`kr-${index}`]}</div>}
                    </div>

                    {kr.type === 'milestone' && (
                      <div className="milestone-container">
                        <label>Milestones</label>
                        {kr.milestones.map((milestone, milestoneIndex) => (
                          <div key={milestoneIndex} className="milestone-input-group">
                            <input
                              type="text"
                              value={milestone.text}
                              onChange={(e) => updateMilestone(index, milestoneIndex, e.target.value)}
                              className="form-input"
                              placeholder="Milestone description..."
                            />
                            {kr.milestones.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-icon btn-danger"
                                onClick={() => removeMilestone(index, milestoneIndex)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          className="add-milestone-btn"
                          onClick={() => addMilestone(index)}
                        >
                          <i className="fas fa-plus"></i>
                          Add Milestone
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  className="add-kr-btn"
                  onClick={addKeyResult}
                >
                  <i className="fas fa-plus"></i>
                  Add Key Result
                </button>
              </div>
            </div>

            {errors.submit && <div className="error-message">{errors.submit}</div>}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  {editingOKR ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  {editingOKR ? 'Update OKR' : 'Create OKR'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateOKRModal; 