# 🧩 Zenith Sudoku

A modern, highly polished, and responsive Sudoku puzzle application built with **React** (Functional Components + Hooks) and **Vite**. Features dynamic glassmorphism design, procedural puzzle generation with guaranteed unique solutions, candidate notes, conflict highlighting, hint system, sound synthesis, and persistent statistics.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `v18.0.0` or higher (tested on Node v24 LTS)
- **npm**: `v9.0.0` or higher

### Installation & Launch

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```
   > 💡 Running `npm start` will automatically start Vite and **open your default web browser** to `http://localhost:5173`. You do not need to open any HTML files manually.

3. **Production Build & Preview (Optional):**
   ```bash
   npm run build
   npm run preview
   ```

---

## ⚙️ Changing the Port

If port `5173` is already in use or you prefer a custom port, you can change it in either of the following ways:

### Method 1: In `vite.config.js`
Open [vite.config.js](file:///vite.config.js) and update the `port` number under `server`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // <-- Set your desired port here
    open: true,
  },
});
```

### Method 2: Via Command Line / NPM Script
Run Vite with the `--port` flag:
```bash
npm start -- --port 8080
```

---

## 🎮 Gameplay & Features

- **Backtracking Board Generator**: Generates complete valid boards and prunes clues according to difficulty, verifying that the puzzle retains **exactly one unique solution** using a limited backtracking counter.
- **Difficulty Modes**:
  - **Easy**: ~40 clues
  - **Medium**: ~32 clues
  - **Hard**: ~26 clues
  - **Expert**: ~22 clues
- **Real-time Conflict Highlighting**: Instantly marks duplicate digits in the same row, column, or 3×3 box in crimson red.
- **Dynamic Selection Highlighting**: Clicking any cell highlights its row, column, 3×3 box, and every instance of the same number across the board.
- **Mistakes Counter**: 3 mistakes per game with live broken-heart indicators and Game Over modal with instant Retry.
- **Candidate Notes (Pencil Mode)**: Toggle notes mode (`N`) to add or remove candidate numbers in 3×3 micro-grids. Automatically clears candidate numbers in peers when a digit is placed.
- **Smart Hints**: Up to 3 hints per puzzle. Solves either your selected cell or the next empty cell with the guaranteed solution.
- **Full Undo History**: Revert mistakes, entries, or notes step-by-step (`U` or `Ctrl+Z`).
- **Web Audio API Sound Engine**: Zero audio files loaded over the network. Synthesizes melodious number chimes, error thuds, note clicks, hint arpeggios, and victory fanfares directly in-browser. Includes mute toggle.
- **Dark & Light Mode**: Seamless glassmorphism theme switch with smooth transitions, remembered in `localStorage`.
- **Auto-Save & Continue**: Automatically saves in-progress games and best completion records per difficulty in `localStorage`.
- **Physics Canvas Confetti**: Custom celebratory particle canvas when a puzzle is conquered.

---

## ⌨️ Controls & Shortcuts

| Action | Shortcut / Input |
|---|---|
| **Select Cell** | Mouse click or Arrow Keys (`↑`, `↓`, `←`, `→`) |
| **Enter Number** | Digits `1` – `9` (Keyboard or Number Pad) |
| **Erase Cell / Notes** | `Backspace`, `Delete`, or `E` |
| **Toggle Notes Mode** | `N` or Pencil button |
| **Use Hint** | `H` or Lightbulb button |
| **Undo Move** | `Ctrl + Z` or `U` |
| **Pause / Resume** | Pause button in header / overlay |

---

## 📁 Project Architecture

```
sudoku-react/
├── index.html                   # HTML entry with Google Fonts & responsive meta tags
├── vite.config.js               # Vite config with server.open = true
├── package.json                 # Scripts: start, dev, build, preview
├── README.md                    # Documentation
└── src/
    ├── main.jsx                 # React root renderer
    ├── App.jsx                  # Main application orchestrator & game loop
    ├── styles/
    │   ├── global.css           # Glassmorphism tokens, dark/light themes, typography
    │   └── board.css            # 9x9 grid, 3x3 borders, pop/shake animations, numpad
    ├── components/
    │   ├── Header.jsx           # Brand, timer, mistakes, difficulty badge, toggles
    │   ├── Board.jsx            # 9x9 grid container with pause overlay
    │   ├── Cell.jsx             # Memoized (React.memo) individual cells with animations
    │   ├── NumberPad.jsx        # 1-9 input pad with remaining counts & completion status
    │   ├── Controls.jsx         # Undo, Erase, Notes, Hint controls
    │   ├── Modal.jsx            # Reusable glassmorphic modal with Esc support
    │   ├── HowToPlay.jsx        # Rules, objective & shortcut guide
    │   ├── WinScreen.jsx        # Custom canvas confetti victory celebration & records
    │   ├── GameOver.jsx         # Retry or start new game modal
    │   └── NewGameMenu.jsx      # Difficulty selector with best records & continue button
    ├── hooks/
    │   ├── useTimer.js          # Timer with visibilitychange auto-pause
    │   ├── useLocalStorage.js   # LocalStorage sync helper
    │   ├── useKeyboard.js       # Global keyboard navigation & shortcut listener
    │   └── useSound.js          # Web Audio API procedural synthesizer
    └── utils/
        ├── generator.js         # Procedural board generator with uniqueness check
        ├── solver.js            # Backtracking solver & early-exit solution counter
        └── validator.js         # Conflict detection & remaining digit counting
```
