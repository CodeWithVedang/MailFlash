'use client';

import React, { useEffect, useState } from 'react';
import { useMailStore } from '@/store/useMailStore';
import { cn } from '@/utils';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useMailStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    }
  }, [theme, mounted]);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
};
