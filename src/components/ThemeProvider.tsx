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

  return (
    <div className={cn(mounted && theme, "min-h-screen bg-background text-foreground")}>
      {children}
    </div>
  );
};
