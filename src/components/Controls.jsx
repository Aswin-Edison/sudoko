import React from 'react';

/**
 * Control action bar: Undo, Erase, Notes toggle, and Hint.
 */
export default function Controls({
  onUndo,
  canUndo,
  onErase,
  notesMode,
  onToggleNotes,
  onHint,
  hintsLeft,
  maxHints = 3,
  disabled = false
}) {
  return (
    <div className="game-controls glass-card" role="toolbar" aria-label="Game controls">
      {/* Undo Button */}
      <button
        className="control-btn"
        onClick={onUndo}
        disabled={disabled || !canUndo}
        title="Undo last move (Ctrl+Z or U)"
        aria-label="Undo last move"
      >
        <span className="control-icon">↩️</span>
        <span className="control-label">Undo</span>
      </button>

      {/* Erase Button */}
      <button
        className="control-btn"
        onClick={onErase}
        disabled={disabled}
        title="Erase cell (Backspace / Delete / E)"
        aria-label="Erase number or notes in selected cell"
      >
        <span className="control-icon">⌫</span>
        <span className="control-label">Erase</span>
      </button>

      {/* Notes / Pencil Toggle */}
      <button
        className={`control-btn ${notesMode ? 'control-btn-active' : ''}`}
        onClick={onToggleNotes}
        disabled={disabled}
        title="Toggle Notes / Pencil mode (N)"
        aria-label={`Pencil notes mode, currently ${notesMode ? 'on' : 'off'}`}
      >
        <span className="control-icon">✏️</span>
        <span className="control-label">Notes</span>
        <span className={`control-status-pill ${notesMode ? 'pill-on' : 'pill-off'}`}>
          {notesMode ? 'ON' : 'OFF'}
        </span>
      </button>

      {/* Hint Button */}
      <button
        className="control-btn hint-btn"
        onClick={onHint}
        disabled={disabled || hintsLeft <= 0}
        title={`Get a hint (${hintsLeft} remaining) (H)`}
        aria-label={`Get a hint, ${hintsLeft} of ${maxHints} remaining`}
      >
        <span className="control-icon">💡</span>
        <span className="control-label">Hint</span>
        <span className="control-badge">{hintsLeft}</span>
      </button>
    </div>
  );
}
