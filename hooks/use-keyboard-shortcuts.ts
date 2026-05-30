'use client';

import { useEffect } from 'react';
import { useQueryStore } from '@/lib/store';

export function useKeyboardShortcuts() {
  const { runQuery, resetQuery } = useQueryStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl + Enter or Cmd + Enter to Run Query
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        runQuery();
      }

      // Ctrl + Backspace or Cmd + Backspace to Reset (with shift to avoid accidental reset)
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'Backspace') {
        event.preventDefault();
        resetQuery();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [runQuery, resetQuery]);
}
