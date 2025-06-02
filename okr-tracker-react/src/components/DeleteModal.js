import React from 'react';

function DeleteModal({ onClose, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delete-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-exclamation-triangle" style={{ color: 'var(--danger-500)' }}></i>
            Confirm Delete
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <p>Are you sure you want to delete this OKR? This action cannot be undone.</p>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            <i className="fas fa-trash"></i>
            Delete OKR
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal; 