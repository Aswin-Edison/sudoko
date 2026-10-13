import React from 'react';
import Modal from './Modal.jsx';

export default function HowToPlay({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to Play Sudoku">
      <div className="how-to-play-content">
        <section className="rules-section">
          <h3>🎯 Objective</h3>
          <p>
            Fill the 9×9 grid with digits <strong>1 through 9</strong> so that every row, column, and 3×3 box contains each number exactly once.
          </p>
        </section>

        <section className="rules-section">
          <h3>📜 Fundamental Rules</h3>
          <ul className="rules-list">
            <li>
              <strong>9×9 Grid:</strong> The board is divided into nine 3×3 sub-grids (boxes).
            </li>
            <li>
              <strong>No Duplicates:</strong> Each row, column, and 3×3 box must contain numbers 1–9 without repeating any digit.
            </li>
            <li>
              <strong>Given Clues:</strong> Bold, pre-filled numbers are locked clues that cannot be changed.
            </li>
            <li>
              <strong>Unique Solution:</strong> Every Zenith Sudoku puzzle is algorithmically guaranteed to have <em>exactly one unique solution</em>.
            </li>
            <li>
              <strong>Mistakes:</strong> Entering an invalid or incorrect number counts as a mistake. You have 3 chances before game over!
            </li>
          </ul>
        </section>

        <section className="rules-section">
          <h3>⌨️ Keyboard & Mouse Controls</h3>
          <div className="shortcuts-table">
            <div className="shortcut-row">
              <span className="key-chip">1</span> – <span className="key-chip">9</span>
              <span className="shortcut-desc">Enter number or toggle note</span>
            </div>
            <div className="shortcut-row">
              <span className="key-chip">Arrows</span>
              <span className="shortcut-desc">Navigate grid cells</span>
            </div>
            <div className="shortcut-row">
              <span className="key-chip">Backspace</span> / <span className="key-chip">Delete</span>
              <span className="shortcut-desc">Erase selected cell or notes</span>
            </div>
            <div className="shortcut-row">
              <span className="key-chip">N</span>
              <span className="shortcut-desc">Toggle Pencil / Notes mode</span>
            </div>
            <div className="shortcut-row">
              <span className="key-chip">H</span>
              <span className="shortcut-desc">Reveal a Hint (up to 3 per game)</span>
            </div>
            <div className="shortcut-row">
              <span className="key-chip">Ctrl + Z</span> / <span className="key-chip">U</span>
              <span className="shortcut-desc">Undo previous action</span>
            </div>
          </div>
        </section>

        <div className="modal-actions">
          <button className="btn btn-primary btn-block" onClick={onClose}>
            Got It! Let's Play
          </button>
        </div>
      </div>
    </Modal>
  );
}
