import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ToastNotification } from '@/components/ToastNotification';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MailFlash — Disposable Email Service',
  description: 'Instant, secure, disposable email at lightning speed. Stay private and avoid spam.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
          <ToastNotification />
        </ThemeProvider>
      </body>
    </html>
  );
}
