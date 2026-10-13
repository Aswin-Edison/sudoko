import React from 'react';
import Cell from './Cell.jsx';

export default function Board({
  board,
  initialBoard,
  selectedCell,
  onSelectCell,
  notes,
  conflicts,
  popCell,
  shakeCell,
  isPaused,
  onResume
}) {
  const selectedRow = selectedCell ? selectedCell[0] : null;
  const selectedCol = selectedCell ? selectedCell[1] : null;
  const selectedValue = (selectedRow !== null && selectedCol !== null)
    ? board[selectedRow][selectedCol]
    : 0;

  return (
    <div className="sudoku-board-container glass-card">
      <div
        className="sudoku-grid"
        role="grid"
        aria-label="Sudoku 9 by 9 puzzle grid"
      >
        {board.map((row, r) =>
          row.map((val, c) => {
            const isGiven = initialBoard[r][c] !== 0;
            const isSelected = selectedRow === r && selectedCol === c;
            const isSameRow = selectedRow === r;
            const isSameCol = selectedCol === c;
            const isSameBox =
              selectedRow !== null &&
              selectedCol !== null &&
              Math.floor(selectedRow / 3) === Math.floor(r / 3) &&
              Math.floor(selectedCol / 3) === Math.floor(c / 3);

            const isHighlighted = (isSameRow || isSameCol || isSameBox) && !isSelected;
            const isSameNumber = selectedValue !== 0 && val === selectedValue && !isSelected;
            const isConflict = conflicts.has(`${r},${c}`);
            const isPopping = popCell && popCell[0] === r && popCell[1] === c;
            const isShaking = shakeCell && shakeCell[0] === r && shakeCell[1] === c;

            const cellNotes = (notes && notes[r] && notes[r][c]) ? notes[r][c] : [];

            return (
              <Cell
                key={`${r}-${c}`}
                row={r}
                col={c}
                value={val}
                isGiven={isGiven}
                isSelected={isSelected}
                isHighlighted={isHighlighted}
                isSameNumber={isSameNumber}
                isConflict={isConflict}
                isPopping={isPopping}
                isShaking={isShaking}
                notes={cellNotes}
                onSelect={onSelectCell}
              />
            );
          })
        )}
      </div>

      {/* Paused Overlay */}
      {isPaused && (
        <div className="board-pause-overlay">
          <div className="pause-dialog glass-card">
            <span className="pause-icon">⏸️</span>
            <h3>Game Paused</h3>
            <p>Take a breath and continue when you're ready.</p>
            <button className="btn btn-primary" onClick={onResume}>
              Resume Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
