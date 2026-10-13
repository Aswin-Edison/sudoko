/**
 * Sudoku Validator & Conflict Detector
 */

/**
 * Scans the 9x9 board and detects all conflicting cell coordinates.
 * Returns a Set of string keys `"row,col"` for every cell involved in a duplicate conflict.
 *
 * @param {number[][]} grid - 9x9 board
 * @returns {Set<string>} Set of conflicting cell coordinates e.g. "3,4"
 */
export function findConflicts(grid) {
  const conflicts = new Set();

  // Helper to mark duplicates in a list of cell coordinates
  function checkGroup(cells) {
    const seen = new Map(); // number -> array of [r, c]
    for (const [r, c] of cells) {
      const val = grid[r][c];
      if (val !== 0) {
        if (!seen.has(val)) {
          seen.set(val, []);
        }
        seen.get(val).push([r, c]);
      }
    }

    for (const [, coords] of seen.entries()) {
      if (coords.length > 1) {
        for (const [r, c] of coords) {
          conflicts.add(`${r},${c}`);
        }
      }
    }
  }

  // 1. Check all Rows
  for (let r = 0; r < 9; r++) {
    const rowCells = [];
    for (let c = 0; c < 9; c++) {
      rowCells.push([r, c]);
    }
    checkGroup(rowCells);
  }

  // 2. Check all Columns
  for (let c = 0; c < 9; c++) {
    const colCells = [];
    for (let r = 0; r < 9; r++) {
      colCells.push([r, c]);
    }
    checkGroup(colCells);
  }

  // 3. Check all 3x3 Boxes
  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      const boxCells = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          boxCells.push([boxRow + r, boxCol + c]);
        }
      }
      checkGroup(boxCells);
    }
  }

  return conflicts;
}

/**
 * Counts how many instances of each digit (1-9) remain to be placed.
 * When count reaches 0, all 9 digits of that number have been placed.
 *
 * @param {number[][]} grid
 * @returns {Object.<number, number>} { 1: rem, 2: rem, ..., 9: rem }
 */
export function getRemainingDigitCounts(grid) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = grid[r][c];
      if (val >= 1 && val <= 9) {
        counts[val]++;
      }
    }
  }

  const remaining = {};
  for (let num = 1; num <= 9; num++) {
    remaining[num] = Math.max(0, 9 - counts[num]);
  }
  return remaining;
}

/**
 * Checks whether the board is completely filled without empty cells.
 */
export function isBoardFilled(grid) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) return false;
    }
  }
  return true;
}

/**
 * Checks if the board is completely and correctly solved.
 */
export function isBoardSolved(grid, solution) {
  if (!isBoardFilled(grid)) return false;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] !== solution[r][c]) {
        return false;
      }
    }
  }
  return true;
}
