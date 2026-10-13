import React from 'react';
import Modal from './Modal.jsx';

export default function GameOver({
  isOpen,
  difficulty,
  timeTaken,
  onRetry,
  onNewGame
}) {
  return (
    <Modal isOpen={isOpen} showCloseBtn={false} title="">
      <div className="game-over-content">
        <div className="game-over-icon">💥</div>
        <h2 className="game-over-title">Game Over</h2>
        <p className="game-over-desc">
          You made 3 mistakes and lost all your lives on {difficulty.toUpperCase()} mode.
        </p>

        <div className="game-over-stats">
          <span>Time elapsed: <strong>{timeTaken}</strong></span>
        </div>

        <div className="modal-actions-row">
          <button className="btn btn-primary" onClick={onRetry}>
            🔄 Retry This Puzzle
          </button>
          <button className="btn btn-secondary" onClick={onNewGame}>
            ⚡ New Game
          </button>
        </div>
      </div>
    </Modal>
  );
}
