'use client';

import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { EmailCard } from '@/components/EmailCard';
import { InboxList } from '@/components/InboxList';
import { useAuth } from '@/hooks/useAuth';
import { useMailStore } from '@/store/useMailStore';
import { motion } from 'framer-motion';

export default function Home() {
  const { account, token } = useMailStore();
  const { createAccount } = useAuth();

  useEffect(() => {
    if (!account || !token) {
      createAccount();
    }
  }, [account, token, createAccount]);

  return (
    <main className="flex flex-col items-center min-h-screen">
      <Header />
      
      <div className="flex-1 w-full flex flex-col items-center pt-8 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 px-4"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            Lightning Fast <br />
            <span className="text-primary">Disposable Email</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-lg mx-auto">
            Stay private, avoid spam. Single-use email addresses for all your verification needs.
          </p>
        </motion.div>

        <EmailCard />
        <InboxList />
      </div>

      <footer className="w-full py-10 text-center text-sm text-muted-foreground border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} MailFlash — Secure & Disposable</p>
          <p className="flex items-center gap-1.5">
            Developed with ❤️ by{' '}
            <a 
              href="https://github.com/CodeWithVedang" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary font-bold hover:underline transition-all"
            >
              CodeWithVedang
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
