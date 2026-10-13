import React, { useEffect, useRef } from 'react';
import Modal from './Modal.jsx';

/**
 * Win Screen with animated Canvas Confetti and statistics
 */
export default function WinScreen({
  isOpen,
  timeTaken,
  formattedTime,
  bestTime,
  isNewBest,
  mistakes,
  hintsUsed,
  difficulty,
  onPlayAgain,
  onChangeDifficulty
}) {
  const canvasRef = useRef(null);

  // Canvas confetti animation
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate confetti particles
    const particleCount = 140;
    const colors = [
      '#6366f1', '#a855f7', '#ec4899', '#3b82f6',
      '#10b981', '#f59e0b', '#06b6d4', '#e11d48'
    ];

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.4 - height * 0.2,
        w: Math.random() * 9 + 5,
        h: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1
      });
    }

    let startTime = Date.now();
    const duration = 7000; // 7 seconds celebration

    const render = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) return;

      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.vy += 0.05; // Gravity

        // Wrap around top if needed or fade
        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - elapsed / duration);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen]);

  const formatSecs = (sec) => {
    if (!sec || sec === Infinity) return '--:--';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <>
      {isOpen && (
        <canvas
          ref={canvasRef}
          className="confetti-canvas"
          aria-hidden="true"
        />
      )}

      <Modal isOpen={isOpen} showCloseBtn={false} title="">
        <div className="win-modal-content">
          <div className="win-trophy-badge">🏆</div>
          <h2 className="win-title">Puzzle Completed!</h2>
          <p className="win-subtitle">
            Outstanding logic! You've conquered the {difficulty.toUpperCase()} board.
          </p>

          {isNewBest && (
            <div className="new-record-banner">
              ⭐ NEW BEST TIME RECORD! ⭐
            </div>
          )}

          <div className="win-stats-grid">
            <div className="win-stat-box">
              <span className="win-stat-label">Time Taken</span>
              <span className="win-stat-value">{formattedTime}</span>
            </div>
            <div className="win-stat-box">
              <span className="win-stat-label">Best Time</span>
              <span className="win-stat-value">{formatSecs(bestTime)}</span>
            </div>
            <div className="win-stat-box">
              <span className="win-stat-label">Mistakes</span>
              <span className="win-stat-value">{mistakes} / 3</span>
            </div>
            <div className="win-stat-box">
              <span className="win-stat-label">Hints Used</span>
              <span className="win-stat-value">{hintsUsed} / 3</span>
            </div>
          </div>

          <div className="modal-actions-row">
            <button className="btn btn-primary" onClick={onPlayAgain}>
              Play Again
            </button>
            <button className="btn btn-secondary" onClick={onChangeDifficulty}>
              Change Difficulty
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
