'use client';

import React, { useState, useEffect } from 'react';
import { useMailStore } from '@/store/useMailStore';
import { useAuth } from '@/hooks/useAuth';
import { useInbox } from '@/hooks/useInbox';
import { Copy, RefreshCw, Trash2, CheckCircle2, Settings2, Sparkles, AtSign, Globe, Lock } from 'lucide-react';
import { cn } from '@/utils';
import { Domain } from '@/types';

export const EmailCard = () => {
  const { account, isLoading, error: storeError } = useMailStore();
  const { createAccount, logout, getAvailableDomains } = useAuth();
  const { fetchInbox } = useInbox();
  
  const [copied, setCopied] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [initials, setInitials] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [domains, setDomains] = useState<Domain[]>([]);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isCustomizing) {
      getAvailableDomains().then(data => {
        setDomains(data);
        if (data.length > 0) setSelectedDomain(data[0].domain);
      });
    }
  }, [isCustomizing, getAvailableDomains]);

  const handleCopy = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCreateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initials || !selectedDomain) return;
    
    const address = `${initials.toLowerCase().replace(/\s+/g, '')}@${selectedDomain}`;
    // We optionally use the password if provided, otherwise hook generates one
    const success = await createAccount(address, password || undefined);
    if (success) {
      setIsCustomizing(false);
      setInitials('');
      setPassword('');
    }
  };

  const handleRefresh = () => {
    fetchInbox(true);
  };

  const handleDelete = () => {
    logout();
    createAccount();
  };

  if (isCustomizing) {
    return (
      <div className="w-full max-w-2xl px-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-card border border-border p-6 md:p-8 rounded-[2.5rem] shadow-2xl">
          <div className="mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-primary" />
              Customize Your Mail
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Choose your own address and optional password.</p>
          </div>

          <form onSubmit={handleCreateCustom} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Initials</label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. vedang"
                    value={initials}
                    onChange={(e) => setInitials(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-secondary rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Domain</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-secondary rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none"
                  >
                    {domains.map((d) => (
                      <option key={d.id} value={d.domain}>{d.domain}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password (Optional)</label>
                <span className="text-[10px] text-muted-foreground lowercase italic">Leave blank to auto-generate</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="Secret key..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {storeError && (
              <p className="text-xs font-semibold text-red-500 bg-red-500/10 px-4 py-2 rounded-xl">
                {storeError}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCustomizing(false)}
                className="flex-1 py-4 bg-secondary text-foreground font-bold rounded-2xl hover:bg-secondary/80 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-[2] py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
              >
                {isLoading ? 'Creating...' : 'Create Email'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (!account) return (
    <div className="w-full max-w-2xl px-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => createAccount()}
          disabled={isLoading}
          className="flex-1 py-5 bg-primary text-white rounded-[2rem] font-bold text-lg hover:bg-primary/90 transition-all disabled:opacity-50 shadow-xl shadow-primary/10 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          {isLoading ? 'Generating...' : 'Auto-Generate'}
        </button>
        <button 
          onClick={() => setIsCustomizing(true)}
          disabled={isLoading}
          className="flex-1 py-5 bg-secondary text-foreground rounded-[2rem] font-bold text-lg hover:bg-secondary/80 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Settings2 className="w-5 h-5" />
          Customize
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card border border-border p-5 md:p-6 rounded-[2.5rem] shadow-2xl shadow-primary/5 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 text-center md:text-left overflow-hidden w-full">
          <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Your temporary email</p>
          <h2 className="text-xl md:text-2xl font-black truncate text-foreground selection:bg-primary/30">
            {account.address}
          </h2>
        </div>
        
        <div className="flex items-center justify-center gap-3 w-full md:w-auto mt-2 md:mt-0">
          <button
            onClick={handleCopy}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center w-full md:w-14 h-14 rounded-2xl transition-all active:scale-95",
              copied ? "bg-green-500 text-white" : "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
            )}
            title="Copy to clipboard"
          >
            {copied ? <CheckCircle2 className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
            <span className="ml-2 md:hidden font-bold">Copy</span>
          </button>
          
          <button
            onClick={handleRefresh}
            className="flex-1 md:flex-none flex items-center justify-center w-full md:w-14 h-14 rounded-2xl bg-secondary text-foreground hover:bg-secondary/80 transition-all active:scale-95 border border-border/50"
            title="Refresh inbox"
          >
            <RefreshCw className={cn("w-6 h-6", isLoading && "animate-spin")} />
            <span className="ml-2 md:hidden font-bold">Refresh</span>
          </button>
          
          <button
            onClick={handleDelete}
            className="flex-1 md:flex-none flex items-center justify-center w-full md:w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all active:scale-95 border border-red-500/10"
            title="Delete and regenerate"
          >
            <Trash2 className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
