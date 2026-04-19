'use client';

import React, { useState } from 'react';
import { useMailStore } from '@/store/useMailStore';
import { MessageItem } from './MessageItem';
import { SkeletonLoader } from './SkeletonLoader';
import { Mail, Search, Inbox as InboxIcon } from 'lucide-react';

export const InboxList = () => {
  const { messages, isLoading, account } = useMailStore();
  const [search, setSearch] = useState('');

  const filteredMessages = messages.filter(m => 
    m.subject.toLowerCase().includes(search.toLowerCase()) ||
    m.from.address.toLowerCase().includes(search.toLowerCase()) ||
    m.from.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!account) return null;

  return (
    <div className="w-full max-w-2xl px-4 mt-8 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <InboxIcon className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Inbox</h2>
          <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-bold">
            {messages.length}
          </span>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-secondary border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 w-40 sm:w-60 transition-all outline-none"
          />
        </div>
      </div>

      {isLoading && messages.length === 0 ? (
        <SkeletonLoader count={5} />
      ) : filteredMessages.length > 0 ? (
        <div className="grid gap-4">
          {filteredMessages.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">
            {search ? 'No results found' : 'No messages yet'}
          </h3>
          <p className="text-sm text-muted-foreground max-w-[240px]">
            {search ? 'Try a different search term or clear the filter.' : 'Messages will appear here as soon as they arrive.'}
          </p>
        </div>
      )}
    </div>
  );
};
