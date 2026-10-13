/**
 * Sudoku Board Generator
 * Generates valid, unique-solution Sudoku puzzles across multiple difficulties.
 */

import { isValid, countSolutions, findEmptyCell } from './solver.js';

// Target clues for each difficulty level
export const DIFFICULTY_CLUES = {
  easy: 40,    // ~40 clues
  medium: 32,  // ~32 clues
  hard: 26,    // ~26 clues
  expert: 22   // ~22 clues
};

/**
 * Fisher-Yates array shuffle helper
 */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Fills a 3x3 subgrid with randomly ordered digits 1 through 9.
 * Diagonal boxes are independent, so filling them first is always conflict-free.
 */
function fillBox(grid, rowStart, colStart) {
  const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  let idx = 0;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      grid[rowStart + r][colStart + c] = digits[idx++];
    }
  }
}

/**
 * Solves the board using randomized recursive backtracking.
 * Testing random candidate numbers produces unique solved boards every generation.
 */
function fillRemaining(grid) {
  const empty = findEmptyCell(grid);
  if (!empty) return true;

  const [row, col] = empty;
  const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  for (const num of digits) {
    if (isValid(grid, row, col, num)) {
      grid[row][col] = num;
      if (fillRemaining(grid)) {
        return true;
      }
      grid[row][col] = 0; // Backtrack
    }
  }

  return false;
}

/**
 * Generates a full, valid 9x9 Sudoku board.
 */
export function generateFullBoard() {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));

  // Step 1: Fill 3 diagonal 3x3 boxes (indices (0,0), (3,3), (6,6)).
  // Diagonal boxes are mutually independent, ensuring no conflicts.
  for (let i = 0; i < 9; i += 3) {
    fillBox(grid, i, i);
  }

  // Step 2: Fill all remaining cells with randomized backtracking.
  fillRemaining(grid);

  return grid;
}

/**
 * Generates a playable Sudoku puzzle with guaranteed UNIQUE solution.
 *
 * Algorithm:
 * 1. Generate a complete, valid solution board.
 * 2. Calculate target number of clues based on requested difficulty.
 * 3. Shuffle all 81 cell coordinates.
 * 4. Iteratively remove clues one by one, checking that the puzzle retains
 *    EXACTLY ONE solution using countSolutions(grid, 2).
 * 5. If removing a cell creates multiple solutions, backtrack by restoring the clue.
 *
 * @param {string} difficulty - 'easy' | 'medium' | 'hard' | 'expert'
 * @returns {{ initialBoard: number[][], solution: number[][], difficulty: string }}
 */
export function generateSudoku(difficulty = 'medium') {
  const targetClues = DIFFICULTY_CLUES[difficulty] || DIFFICULTY_CLUES.medium;

  // 1. Generate full solved board
  const solution = generateFullBoard();

  // 2. Clone solved board to carve out clues
  const puzzle = solution.map(row => [...row]);

  // 3. Create randomized coordinates for removal
  const coords = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      coords.push([r, c]);
    }
  }
  const shuffledCoords = shuffle(coords);

  let currentClues = 81;

  // 4. Try removing cells while preserving single unique solution
  for (const [r, c] of shuffledCoords) {
    if (currentClues <= targetClues) {
      break;
    }

    const temp = puzzle[r][c];
    puzzle[r][c] = 0; // Tentatively remove clue

    // Verify uniqueness: if countSolutions > 1, puzzle is ambiguous, so revert!
    if (countSolutions(puzzle, 2) !== 1) {
      puzzle[r][c] = temp; // Restore clue
    } else {
      currentClues--;
    }
  }

  return {
    initialBoard: puzzle,
    solution,
    difficulty
  };
}
