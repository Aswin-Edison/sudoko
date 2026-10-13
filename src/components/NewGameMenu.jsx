import React from 'react';
import Modal from './Modal.jsx';

export default function NewGameMenu({
  isOpen,
  onClose,
  onStartNewGame,
  hasSavedGame,
  savedGameDetails,
  onContinueSavedGame,
  bestTimes = {},
  isStartup = false
}) {
  const difficulties = [
    {
      id: 'easy',
      name: 'Easy',
      clues: '~40 Clues',
      desc: 'Great for beginners and relaxed puzzle solving',
      color: '#10b981'
    },
    {
      id: 'medium',
      name: 'Medium',
      clues: '~32 Clues',
      desc: 'Balanced challenge requiring deductive reasoning',
      color: '#3b82f6'
    },
    {
      id: 'hard',
      name: 'Hard',
      clues: '~26 Clues',
      desc: 'Intense logic puzzles with multiple candidate notes',
      color: '#f59e0b'
    },
    {
      id: 'expert',
      name: 'Expert',
      clues: '~22 Clues',
      desc: 'Master difficulty with minimal initial clues',
      color: '#ef4444'
    }
  ];

  const formatSecs = (sec) => {
    if (!sec || sec === Infinity) return '--:--';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isStartup && !hasSavedGame ? null : onClose}
      showCloseBtn={!isStartup || hasSavedGame}
      title="Choose Game Mode"
    >
      <div className="new-game-menu-content">
        {/* Continue Saved Game Card if one exists */}
        {hasSavedGame && (
          <div className="continue-card glass-card">
            <div className="continue-card-header">
              <span className="continue-badge">Saved Progress Found</span>
              <span className="continue-diff">{savedGameDetails?.difficulty?.toUpperCase()}</span>
            </div>
            <div className="continue-card-body">
              <span>Time: <strong>{savedGameDetails?.formattedTime || '00:00'}</strong></span>
              <span>Mistakes: <strong>{savedGameDetails?.mistakes || 0}/3</strong></span>
            </div>
            <button
              className="btn btn-primary btn-block continue-btn"
              onClick={onContinueSavedGame}
            >
              ▶ Continue Saved Game
            </button>
          </div>
        )}

        <div className="difficulty-selection-heading">
          <h3>Select Difficulty</h3>
          <p>Choose a level to generate a fresh, unique puzzle</p>
        </div>

        <div className="difficulty-grid">
          {difficulties.map(diff => {
            const best = bestTimes[diff.id];
            return (
              <button
                key={diff.id}
                className="difficulty-card"
                onClick={() => onStartNewGame(diff.id)}
              >
                <div className="diff-card-header">
                  <span className="diff-title" style={{ color: diff.color }}>
                    {diff.name}
                  </span>
                  <span className="diff-clues">{diff.clues}</span>
                </div>
                <p className="diff-desc">{diff.desc}</p>
                <div className="diff-best">
                  <span>Best Record:</span>
                  <strong>{formatSecs(best)}</strong>
                </div>
              </button>
            );
          })}
        </div>

        {!isStartup && onClose && (
          <div className="modal-actions-row modal-cancel-row">
            <button className="btn btn-secondary btn-block" onClick={onClose}>
              Cancel & Resume Current Game
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
