'use client';

import React from 'react';
import { useMailStore } from '@/store/useMailStore';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useMailStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-foreground" />
      ) : (
        <Sun className="w-5 h-5 text-foreground" />
      )}
    </button>
  );
};

export const Header = () => {
  return (
    <header className="flex items-center justify-between py-6 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-xl">M</span>
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
          MailFlash
        </h1>
      </div>
      <ThemeToggle />
    </header>
  );
};
