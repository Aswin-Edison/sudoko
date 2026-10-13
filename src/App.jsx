import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Header from './components/Header.jsx';
import Board from './components/Board.jsx';
import NumberPad from './components/NumberPad.jsx';
import Controls from './components/Controls.jsx';
import HowToPlay from './components/HowToPlay.jsx';
import WinScreen from './components/WinScreen.jsx';
import GameOver from './components/GameOver.jsx';
import NewGameMenu from './components/NewGameMenu.jsx';

import { useTimer } from './hooks/useTimer.js';
import { useSound } from './hooks/useSound.js';
import { useKeyboard } from './hooks/useKeyboard.js';

import { generateSudoku } from './utils/generator.js';
import { findConflicts, getRemainingDigitCounts, isBoardSolved } from './utils/validator.js';

import './styles/global.css';
import './styles/board.css';

const STORAGE_KEY_ACTIVE = 'zenith_sudoku_active_game';
const STORAGE_KEY_BEST = 'zenith_sudoku_best_times';
const STORAGE_KEY_THEME = 'zenith_sudoku_theme';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_THEME) || 'dark';
    } catch {
      return 'dark';
    }
  });

  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Best times state
  const [bestTimes, setBestTimes] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BEST);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Sound hook
  const {
    isMuted,
    toggleMute,
    playPlaceNumber,
    playNote,
    playError,
    playErase,
    playHint,
    playWin,
    playGameOver
  } = useSound();

  // Core Game State
  const [difficulty, setDifficulty] = useState('medium');
  const [initialBoard, setInitialBoard] = useState(() => Array.from({ length: 9 }, () => Array(9).fill(0)));
  const [board, setBoard] = useState(() => Array.from({ length: 9 }, () => Array(9).fill(0)));
  const [solution, setSolution] = useState(() => Array.from({ length: 9 }, () => Array(9).fill(0)));
  const [notes, setNotes] = useState(() => Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => [])));

  const [selectedCell, setSelectedCell] = useState([0, 0]);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [notesMode, setNotesMode] = useState(false);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing' | 'paused' | 'won' | 'lost'
  const [history, setHistory] = useState([]);

  // Animation triggers
  const [shakeCell, setShakeCell] = useState(null);
  const [popCell, setPopCell] = useState(null);

  // Modals
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showNewGameMenu, setShowNewGameMenu] = useState(false);
  const [showWinScreen, setShowWinScreen] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [isNewBestRecord, setIsNewBestRecord] = useState(false);

  // Timer
  const isTimerActive = gameStatus === 'playing';
  const isTimerPaused = gameStatus === 'paused' || showHowToPlay || showNewGameMenu;
  const { seconds, formattedTime, resetTimer, setSeconds } = useTimer(isTimerActive, isTimerPaused);

  // Saved game detection on mount
  const [savedGameData, setSavedGameData] = useState(null);
  const isInitialMount = useRef(true);

  // Initialize or restore game on startup
  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;

    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.board && parsed.gameStatus === 'playing') {
          setSavedGameData(parsed);
          // Show new game menu with "Continue Saved Game" option
          setShowNewGameMenu(true);
          return;
        }
      }
    } catch {}

    // No valid saved game found: generate initial medium puzzle
    startNewGame('medium');
  }, []);

  // Auto-save current game progress in localStorage
  useEffect(() => {
    if (gameStatus === 'playing' || gameStatus === 'paused') {
      try {
        const gameState = {
          difficulty,
          initialBoard,
          board,
          solution,
          notes,
          mistakes,
          hintsUsed,
          seconds,
          gameStatus
        };
        localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(gameState));
      } catch {}
    }
  }, [difficulty, initialBoard, board, solution, notes, mistakes, hintsUsed, seconds, gameStatus]);

  // Start fresh game with chosen difficulty
  const startNewGame = useCallback((diff) => {
    const puzzle = generateSudoku(diff);
    setDifficulty(diff);
    setInitialBoard(puzzle.initialBoard);
    setBoard(puzzle.initialBoard.map(row => [...row]));
    setSolution(puzzle.solution);
    setNotes(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => [])));
    setSelectedCell([0, 0]);
    setMistakes(0);
    setHintsUsed(0);
    setNotesMode(false);
    setGameStatus('playing');
    setHistory([]);
    setShakeCell(null);
    setPopCell(null);
    resetTimer(0);
    setShowNewGameMenu(false);
    setShowWinScreen(false);
    setShowGameOver(false);
    setIsNewBestRecord(false);
  }, [resetTimer]);

  // Continue saved game
  const handleContinueSavedGame = useCallback(() => {
    if (!savedGameData) return;
    setDifficulty(savedGameData.difficulty || 'medium');
    setInitialBoard(savedGameData.initialBoard);
    setBoard(savedGameData.board);
    setSolution(savedGameData.solution);
    setNotes(savedGameData.notes || Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => [])));
    setMistakes(savedGameData.mistakes || 0);
    setHintsUsed(savedGameData.hintsUsed || 0);
    setSeconds(savedGameData.seconds || 0);
    setGameStatus('playing');
    setHistory([]);
    setShowNewGameMenu(false);
  }, [savedGameData, setSeconds]);

  // Retry same puzzle (reset to initial clues)
  const handleRetryPuzzle = useCallback(() => {
    setBoard(initialBoard.map(row => [...row]));
    setNotes(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => [])));
    setMistakes(0);
    setHintsUsed(0);
    setGameStatus('playing');
    setHistory([]);
    resetTimer(0);
    setShowGameOver(false);
  }, [initialBoard, resetTimer]);

  // Computed conflicts & remaining digits
  const conflicts = useMemo(() => findConflicts(board), [board]);
  const remainingCounts = useMemo(() => getRemainingDigitCounts(board), [board]);

  // Trigger shake animation on cell
  const triggerShake = useCallback((r, c) => {
    setShakeCell([r, c]);
    setTimeout(() => setShakeCell(null), 400);
  }, []);

  // Trigger pop animation on cell
  const triggerPop = useCallback((r, c) => {
    setPopCell([r, c]);
    setTimeout(() => setPopCell(null), 300);
  }, []);

  // Handle number input (from numpad or keyboard)
  const handleInputNumber = useCallback((number) => {
    if (gameStatus !== 'playing' || !selectedCell) return;
    const [r, c] = selectedCell;

    // Pre-filled given cells are locked
    if (initialBoard[r][c] !== 0) return;

    // Case 1: Pencil / Notes mode
    if (notesMode) {
      // Cannot add notes to an already filled cell
      if (board[r][c] !== 0) return;

      // Save history snapshot for undo
      setHistory(prev => [...prev, {
        board: board.map(row => [...row]),
        notes: notes.map(row => row.map(cellNotes => [...cellNotes]))
      }]);

      setNotes(prevNotes => {
        const nextNotes = prevNotes.map(row => row.map(arr => [...arr]));
        const currCellNotes = nextNotes[r][c];
        if (currCellNotes.includes(number)) {
          nextNotes[r][c] = currCellNotes.filter(n => n !== number);
        } else {
          nextNotes[r][c] = [...currCellNotes, number].sort((a, b) => a - b);
        }
        return nextNotes;
      });

      playNote();
      return;
    }

    // Case 2: Standard number placement
    if (board[r][c] === number) return; // Already placed

    // Save history snapshot before making changes
    setHistory(prev => [...prev, {
      board: board.map(row => [...row]),
      notes: notes.map(row => row.map(cellNotes => [...cellNotes]))
    }]);

    const isCorrect = solution[r][c] === number;

    if (!isCorrect) {
      // Mistake made
      playError();
      triggerShake(r, c);
      const nextMistakes = mistakes + 1;
      setMistakes(nextMistakes);

      if (nextMistakes >= 3) {
        setGameStatus('lost');
        setShowGameOver(true);
        playGameOver();
        try {
          localStorage.removeItem(STORAGE_KEY_ACTIVE);
        } catch {}
      }
      return;
    }

    // Correct placement
    playPlaceNumber(number);
    triggerPop(r, c);

    const nextBoard = board.map(row => [...row]);
    nextBoard[r][c] = number;
    setBoard(nextBoard);

    // Auto-remove this number from candidate notes in peer cells (same row, col, box)
    const nextNotes = notes.map(row => row.map(arr => [...arr]));
    nextNotes[r][c] = []; // Clear notes in current cell

    const boxStartR = Math.floor(r / 3) * 3;
    const boxStartC = Math.floor(c / 3) * 3;
    for (let i = 0; i < 9; i++) {
      nextNotes[r][i] = nextNotes[r][i].filter(n => n !== number);
      nextNotes[i][c] = nextNotes[i][c].filter(n => n !== number);
    }
    for (let br = 0; br < 3; br++) {
      for (let bc = 0; bc < 3; bc++) {
        nextNotes[boxStartR + br][boxStartC + bc] = nextNotes[boxStartR + br][boxStartC + bc].filter(n => n !== number);
      }
    }
    setNotes(nextNotes);

    // Check Win Condition
    if (isBoardSolved(nextBoard, solution)) {
      setGameStatus('won');
      setShowWinScreen(true);
      playWin();

      // Check and update best record time
      const currentBest = bestTimes[difficulty];
      const isNewRecord = !currentBest || seconds < currentBest;
      if (isNewRecord) {
        setIsNewBestRecord(true);
        const updatedBests = { ...bestTimes, [difficulty]: seconds };
        setBestTimes(updatedBests);
        try {
          localStorage.setItem(STORAGE_KEY_BEST, JSON.stringify(updatedBests));
        } catch {}
      } else {
        setIsNewBestRecord(false);
      }

      // Clear active game in storage upon completion
      try {
        localStorage.removeItem(STORAGE_KEY_ACTIVE);
      } catch {}
    }
  }, [
    gameStatus,
    selectedCell,
    initialBoard,
    notesMode,
    board,
    solution,
    notes,
    mistakes,
    seconds,
    difficulty,
    bestTimes,
    playNote,
    playError,
    triggerShake,
    playPlaceNumber,
    triggerPop,
    playGameOver,
    playWin
  ]);

  // Handle Erase
  const handleErase = useCallback(() => {
    if (gameStatus !== 'playing' || !selectedCell) return;
    const [r, c] = selectedCell;

    // Cannot erase given clues
    if (initialBoard[r][c] !== 0) return;

    // If cell has a value or has notes, erase it
    if (board[r][c] !== 0 || (notes[r] && notes[r][c].length > 0)) {
      setHistory(prev => [...prev, {
        board: board.map(row => [...row]),
        notes: notes.map(row => row.map(cellNotes => [...cellNotes]))
      }]);

      if (board[r][c] !== 0) {
        const nextBoard = board.map(row => [...row]);
        nextBoard[r][c] = 0;
        setBoard(nextBoard);
      }

      if (notes[r][c].length > 0) {
        const nextNotes = notes.map(row => row.map(arr => [...arr]));
        nextNotes[r][c] = [];
        setNotes(nextNotes);
      }

      playErase();
    }
  }, [gameStatus, selectedCell, initialBoard, board, notes, playErase]);

  // Handle Undo
  const handleUndo = useCallback(() => {
    if (gameStatus !== 'playing' || history.length === 0) return;

    const previousState = history[history.length - 1];
    setBoard(previousState.board);
    setNotes(previousState.notes);
    setHistory(prev => prev.slice(0, prev.length - 1));
    playErase();
  }, [gameStatus, history, playErase]);

  // Handle Hint
  const handleHint = useCallback(() => {
    if (gameStatus !== 'playing' || hintsUsed >= 3) return;

    // Find target cell: prefer currently selected cell if empty/incorrect, otherwise first empty cell
    let target = null;
    if (selectedCell) {
      const [sr, sc] = selectedCell;
      if (initialBoard[sr][sc] === 0 && board[sr][sc] !== solution[sr][sc]) {
        target = [sr, sc];
      }
    }

    if (!target) {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (initialBoard[r][c] === 0 && board[r][c] !== solution[r][c]) {
            target = [r, c];
            break;
          }
        }
        if (target) break;
      }
    }

    if (!target) return; // Board already complete

    const [tr, tc] = target;
    const correctValue = solution[tr][tc];

    // Save undo history
    setHistory(prev => [...prev, {
      board: board.map(row => [...row]),
      notes: notes.map(row => row.map(cellNotes => [...cellNotes]))
    }]);

    setSelectedCell([tr, tc]);
    triggerPop(tr, tc);
    playHint();

    const nextBoard = board.map(row => [...row]);
    nextBoard[tr][tc] = correctValue;
    setBoard(nextBoard);

    // Clear candidate notes
    const nextNotes = notes.map(row => row.map(arr => [...arr]));
    nextNotes[tr][tc] = [];
    setNotes(nextNotes);

    setHintsUsed(prev => prev + 1);

    // Check Win Condition
    if (isBoardSolved(nextBoard, solution)) {
      setGameStatus('won');
      setShowWinScreen(true);
      playWin();
    }
  }, [gameStatus, hintsUsed, selectedCell, initialBoard, board, solution, notes, triggerPop, playHint, playWin]);

  // Keyboard navigation & shortcuts hook
  useKeyboard({
    selectedCell,
    setSelectedCell,
    onInputNumber: handleInputNumber,
    onErase: handleErase,
    onToggleNotes: () => setNotesMode(prev => !prev),
    onUndo: handleUndo,
    onHint: handleHint,
    isDisabled: gameStatus !== 'playing' || showHowToPlay || showNewGameMenu || showWinScreen || showGameOver
  });

  return (
    <main className="app-container">
      {/* Header bar */}
      <Header
        difficulty={difficulty}
        mistakes={mistakes}
        maxMistakes={3}
        formattedTime={formattedTime}
        isPaused={gameStatus === 'paused'}
        onTogglePause={() => setGameStatus(prev => (prev === 'paused' ? 'playing' : 'paused'))}
        onOpenNewGame={() => setShowNewGameMenu(true)}
        onOpenHowToPlay={() => setShowHowToPlay(true)}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main 9x9 Board */}
      <Board
        board={board}
        initialBoard={initialBoard}
        selectedCell={selectedCell}
        onSelectCell={(r, c) => setSelectedCell([r, c])}
        notes={notes}
        conflicts={conflicts}
        popCell={popCell}
        shakeCell={shakeCell}
        isPaused={gameStatus === 'paused'}
        onResume={() => setGameStatus('playing')}
      />

      {/* Action Controls (Undo, Erase, Notes, Hint) */}
      <Controls
        onUndo={handleUndo}
        canUndo={history.length > 0}
        onErase={handleErase}
        notesMode={notesMode}
        onToggleNotes={() => setNotesMode(prev => !prev)}
        onHint={handleHint}
        hintsLeft={3 - hintsUsed}
        maxHints={3}
        disabled={gameStatus !== 'playing'}
      />

      {/* Digits 1-9 Number Pad */}
      <NumberPad
        remainingCounts={remainingCounts}
        onInputNumber={handleInputNumber}
        disabled={gameStatus !== 'playing'}
      />

      {/* Modals */}
      <HowToPlay
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />

      <NewGameMenu
        isOpen={showNewGameMenu}
        onClose={() => setShowNewGameMenu(false)}
        onStartNewGame={startNewGame}
        hasSavedGame={!!savedGameData}
        savedGameDetails={savedGameData}
        onContinueSavedGame={handleContinueSavedGame}
        bestTimes={bestTimes}
        isStartup={false}
      />

      <WinScreen
        isOpen={showWinScreen}
        timeTaken={seconds}
        formattedTime={formattedTime}
        bestTime={bestTimes[difficulty]}
        isNewBest={isNewBestRecord}
        mistakes={mistakes}
        hintsUsed={hintsUsed}
        difficulty={difficulty}
        onPlayAgain={() => startNewGame(difficulty)}
        onChangeDifficulty={() => {
          setShowWinScreen(false);
          setShowNewGameMenu(true);
        }}
      />

      <GameOver
        isOpen={showGameOver}
        difficulty={difficulty}
        timeTaken={formattedTime}
        onRetry={handleRetryPuzzle}
        onNewGame={() => {
          setShowGameOver(false);
          setShowNewGameMenu(true);
        }}
      />
    </main>
  );
}
