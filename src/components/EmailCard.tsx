'use client';

import React, { useState } from 'react';
import { useMailStore } from '@/store/useMailStore';
import { useAuth } from '@/hooks/useAuth';
import { useInbox } from '@/hooks/useInbox';
import { Copy, RefreshCw, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils';

export const EmailCard = () => {
  const { account, isLoading } = useMailStore();
  const { createAccount, logout } = useAuth();
  const { fetchInbox } = useInbox();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefresh = () => {
    fetchInbox(true);
  };

  const handleDelete = () => {
    logout();
    createAccount();
  };

  if (!account) return (
    <div className="w-full max-w-2xl px-4">
      <button 
        onClick={createAccount}
        disabled={isLoading}
        className="w-full py-4 bg-primary text-white rounded-2xl font-semibold text-lg hover:bg-primary/90 transition-all disabled:opacity-50"
      >
        {isLoading ? 'Generating...' : 'Generate New Email'}
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card border border-border p-5 md:p-6 rounded-[2rem] shadow-xl shadow-primary/5 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 text-center md:text-left overflow-hidden w-full">
          <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Your temporary email</p>
          <h2 className="text-xl md:text-2xl font-bold truncate text-foreground selection:bg-primary/30">
            {account.address}
          </h2>
        </div>
        
        <div className="flex items-center justify-center gap-3 w-full md:w-auto mt-2 md:mt-0">
          <button
            onClick={handleCopy}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center w-full md:w-12 h-12 rounded-2xl transition-all active:scale-95",
              copied ? "bg-green-500 text-white" : "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20"
            )}
            title="Copy to clipboard"
          >
            {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            <span className="ml-2 md:hidden font-bold">Copy</span>
          </button>
          
          <button
            onClick={handleRefresh}
            className="flex-1 md:flex-none flex items-center justify-center w-full md:w-12 h-12 rounded-2xl bg-secondary text-foreground hover:bg-secondary/80 transition-all active:scale-95"
            title="Refresh inbox"
          >
            <RefreshCw className={cn("w-5 h-5", isLoading && "animate-spin")} />
            <span className="ml-2 md:hidden font-bold">Refresh</span>
          </button>
          
          <button
            onClick={handleDelete}
            className="flex-1 md:flex-none flex items-center justify-center w-full md:w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all active:scale-95"
            title="Delete and regenerate"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
