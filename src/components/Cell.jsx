import React, { memo } from 'react';

/**
 * Individual Sudoku Grid Cell
 * Memoized to prevent excessive re-renders during gameplay.
 */
const Cell = memo(function Cell({
  row,
  col,
  value,
  isGiven,
  isSelected,
  isHighlighted,
  isSameNumber,
  isConflict,
  isPopping,
  isShaking,
  notes = [],
  onSelect
}) {
  // Determine CSS classes for styling & animations
  const classes = ['sudoku-cell'];

  if (isGiven) classes.push('cell-given');
  else if (value !== 0) classes.push('cell-user');

  if (isSelected) classes.push('cell-selected');
  else if (isSameNumber) classes.push('cell-same-number');
  else if (isHighlighted) classes.push('cell-highlighted');

  if (isConflict) classes.push('cell-conflict');
  if (isPopping) classes.push('cell-pop');
  if (isShaking) classes.push('cell-shake');

  // Thicker 3x3 box boundary classes
  if (row % 3 === 0 && row !== 0) classes.push('border-top-thick');
  if (col % 3 === 0 && col !== 0) classes.push('border-left-thick');

  const handleClick = () => {
    onSelect(row, col);
  };

  const ariaLabel = `Row ${row + 1}, Column ${col + 1}${
    value !== 0 ? `, value ${value}${isGiven ? ' (given)' : ''}` : ', empty'
  }${notes.length > 0 ? `, notes ${notes.join(' ')}` : ''}`;

  return (
    <div
      role="gridcell"
      className={classes.join(' ')}
      onClick={handleClick}
      tabIndex={isSelected ? 0 : -1}
      aria-selected={isSelected}
      aria-label={ariaLabel}
      data-row={row}
      data-col={col}
    >
      {value !== 0 ? (
        <span className="cell-digit">{value}</span>
      ) : (
        <div className="cell-notes-grid" aria-hidden="true">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <span
              key={num}
              className={`note-digit ${notes.includes(num) ? 'note-visible' : 'note-hidden'}`}
            >
              {notes.includes(num) ? num : ''}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});

export default Cell;
