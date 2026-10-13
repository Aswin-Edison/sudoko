/**
 * Sudoku Solver & Solution Counter
 * Uses recursive backtracking with constraint propagation to solve and verify puzzles.
 */

// Check if placing num at grid[row][col] is valid according to classic Sudoku rules
export function isValid(grid, row, col, num) {
  // Check row and column
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num && i !== col) return false;
    if (grid[i][col] === num && i !== row) return false;
  }

  // Check 3x3 box
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const currRow = startRow + r;
      const currCol = startCol + c;
      if (grid[currRow][currCol] === num && (currRow !== row || currCol !== col)) {
        return false;
      }
    }
  }

  return true;
}

// Find an empty cell in the grid (returns [row, col] or null)
export function findEmptyCell(grid) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) {
        return [r, c];
      }
    }
  }
  return null;
}

/**
 * Solve a Sudoku grid using backtracking.
 * Modifies a cloned grid and returns the solved 9x9 grid, or null if no solution exists.
 */
export function solveSudoku(grid) {
  // Deep clone grid so original is unaffected
  const workingGrid = grid.map(row => [...row]);

  function solve() {
    const empty = findEmptyCell(workingGrid);
    if (!empty) return true; // All cells filled

    const [row, col] = empty;
    for (let num = 1; num <= 9; num++) {
      if (isValid(workingGrid, row, col, num)) {
        workingGrid[row][col] = num;
        if (solve()) {
          return true;
        }
        workingGrid[row][col] = 0; // Backtrack
      }
    }
    return false;
  }

  return solve() ? workingGrid : null;
}

/**
 * Count the number of valid solutions for a given grid up to a maximum limit.
 * Crucial for puzzle uniqueness verification: stops as soon as `limit` is reached (e.g. limit = 2).
 *
 * @param {number[][]} grid - 9x9 puzzle grid
 * @param {number} limit - Maximum solutions to count before aborting (default 2)
 * @returns {number} Number of solutions found (0, 1, or limit)
 */
export function countSolutions(grid, limit = 2) {
  const workingGrid = grid.map(row => [...row]);
  let count = 0;

  function backtrack() {
    const empty = findEmptyCell(workingGrid);
    if (!empty) {
      count++;
      return count >= limit; // Early exit once limit reached
    }

    const [row, col] = empty;
    for (let num = 1; num <= 9; num++) {
      if (isValid(workingGrid, row, col, num)) {
        workingGrid[row][col] = num;
        const reachedLimit = backtrack();
        workingGrid[row][col] = 0; // Backtrack
        if (reachedLimit) return true;
      }
    }
    return false;
  }

  backtrack();
  return count;
}
