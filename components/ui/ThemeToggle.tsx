'use client';

import * as React from 'react';
import { Moon, Sun } from '@phosphor-icons/react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      className="text-text-secondary hover:text-accent h-9 w-9 rounded-lg border border-transparent hover:border-border transition-all"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun
        size={20}
        weight="duotone"
        className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Moon
        size={20}
        weight="duotone"
        className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
