import React from 'react';

export default function Header({
  difficulty,
  mistakes,
  maxMistakes = 3,
  formattedTime,
  isPaused,
  onTogglePause,
  onOpenNewGame,
  onOpenHowToPlay,
  isMuted,
  onToggleMute,
  theme,
  onToggleTheme
}) {
  const difficultyLabels = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    expert: 'Expert'
  };

  return (
    <header className="game-header glass-card">
      <div className="header-top-row">
        <div className="brand-group">
          <div className="brand-logo-icon">
            <span>9</span>
          </div>
          <div className="brand-text">
            <h1 className="brand-title">Zenith Sudoku</h1>
            <span className={`difficulty-badge badge-${difficulty}`}>
              {difficultyLabels[difficulty] || 'Medium'}
            </span>
          </div>
        </div>

        <div className="header-action-buttons">
          {/* Sound Mute Toggle */}
          <button
            className="icon-btn"
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          {/* Theme Toggle */}
          <button
            className="icon-btn"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle dark/light theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* How to Play Help */}
          <button
            className="icon-btn"
            onClick={onOpenHowToPlay}
            title="How to Play"
            aria-label="Game rules and help"
          >
            ❓
          </button>

          {/* New Game Button */}
          <button
            className="btn btn-primary btn-sm new-game-btn"
            onClick={onOpenNewGame}
            aria-label="Start a new puzzle"
          >
            New Game
          </button>
        </div>
      </div>

      <div className="header-stats-row">
        {/* Mistakes / Hearts */}
        <div className="stat-card mistakes-card" aria-label={`Mistakes: ${mistakes} of ${maxMistakes}`}>
          <span className="stat-label">Mistakes</span>
          <div className="hearts-display">
            {Array.from({ length: maxMistakes }).map((_, idx) => {
              const isLost = idx < mistakes;
              return (
                <span
                  key={idx}
                  className={`heart-icon ${isLost ? 'heart-lost' : 'heart-active'}`}
                >
                  {isLost ? '💔' : '❤️'}
                </span>
              );
            })}
          </div>
        </div>

        {/* Timer */}
        <div className="stat-card timer-card">
          <span className="stat-label">Time</span>
          <div className="timer-display-group">
            <span className="timer-clock-icon">⏱️</span>
            <span className="timer-text">{formattedTime}</span>
            <button
              className="timer-pause-btn"
              onClick={onTogglePause}
              title={isPaused ? 'Resume Game' : 'Pause Game'}
              aria-label={isPaused ? 'Resume Game' : 'Pause Game'}
            >
              {isPaused ? '▶️' : '⏸️'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
