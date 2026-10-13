import React, { useEffect } from 'react';

/**
 * Reusable Glassmorphism Modal Component
 */
export default function Modal({ isOpen, onClose, title, children, showCloseBtn = true }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-container glass-card">
        <div className="modal-header">
          {title && <h2 id="modal-title" className="modal-title">{title}</h2>}
          {showCloseBtn && onClose && (
            <button
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close dialog"
            >
              ✕
            </button>
          )}
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
}
