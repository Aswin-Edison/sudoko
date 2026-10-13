import { useEffect } from 'react';

/**
 * Custom hook for keyboard shortcuts & board navigation
 */
export function useKeyboard({
  selectedCell,
  setSelectedCell,
  onInputNumber,
  onErase,
  onToggleNotes,
  onUndo,
  onHint,
  isDisabled = false
}) {
  useEffect(() => {
    if (isDisabled) return;

    const handleKeyDown = (e) => {
      // Ignore if user is interacting with an input or button modal element
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        return;
      }

      // Undo shortcut: Ctrl+Z or 'u' / 'U'
      if ((e.ctrlKey && e.key.toLowerCase() === 'z') || (!e.ctrlKey && e.key.toLowerCase() === 'u')) {
        e.preventDefault();
        onUndo?.();
        return;
      }

      // Hint shortcut: 'h' / 'H'
      if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        onHint?.();
        return;
      }

      // Notes toggle shortcut: 'n' / 'N'
      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        onToggleNotes?.();
        return;
      }

      // Erase shortcut: Backspace, Delete, 'e' / 'E'
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key.toLowerCase() === 'e') {
        e.preventDefault();
        onErase?.();
        return;
      }

      // Numbers 1-9 (standard numbers or numpad)
      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        onInputNumber?.(parseInt(e.key, 10));
        return;
      }

      // Arrow navigation
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        let r = selectedCell ? selectedCell[0] : 0;
        let c = selectedCell ? selectedCell[1] : 0;

        if (!selectedCell) {
          setSelectedCell([0, 0]);
          return;
        }

        switch (e.key) {
          case 'ArrowUp':
            r = (r - 1 + 9) % 9;
            break;
          case 'ArrowDown':
            r = (r + 1) % 9;
            break;
          case 'ArrowLeft':
            c = (c - 1 + 9) % 9;
            break;
          case 'ArrowRight':
            c = (c + 1) % 9;
            break;
          default:
            break;
        }

        setSelectedCell([r, c]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    selectedCell,
    setSelectedCell,
    onInputNumber,
    onErase,
    onToggleNotes,
    onUndo,
    onHint,
    isDisabled
  ]);
}
