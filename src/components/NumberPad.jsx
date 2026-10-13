import React from 'react';

/**
 * Number Pad for entering digits 1 through 9
 * Displays remaining count badge per digit and disables digits that are completely placed.
 */
export default function NumberPad({
  remainingCounts,
  onInputNumber,
  disabled = false
}) {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="numpad-container glass-card" role="group" aria-label="Number input pad">
      {digits.map((num) => {
        const remaining = remainingCounts ? remainingCounts[num] : 9;
        const isCompleted = remaining === 0;

        return (
          <button
            key={num}
            className={`numpad-btn ${isCompleted ? 'numpad-completed' : ''}`}
            onClick={() => onInputNumber(num)}
            disabled={disabled || isCompleted}
            aria-label={`Digit ${num}, ${remaining} remaining`}
          >
            <span className="numpad-digit">{num}</span>
            <span className="numpad-badge">
              {isCompleted ? '✓' : remaining}
            </span>
          </button>
        );
      })}
    </div>
  );
}
