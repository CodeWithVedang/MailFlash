'use client';

import React, { useState } from 'react';
import { Message } from '@/types';
import { formatDate, extractOTP, extractConfirmationLink, cn } from '@/utils';
import { Mail, ChevronRight, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';
import { MessageModal } from './MessageModal';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const otp = extractOTP(message.intro);
  const confirmLink = extractConfirmationLink(message.intro);

  const handleCopyOTP = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (otp) {
      navigator.clipboard.writeText(otp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmLink) window.open(confirmLink, '_blank');
  };

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="group relative bg-card hover:bg-muted/50 border border-border p-5 rounded-2xl cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
            <Mail className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-foreground truncate max-w-[70%]">
                {message.from.name || message.from.address}
              </h3>
              <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                {formatDate(message.createdAt)}
              </span>
            </div>
            
            <h4 className="text-sm font-semibold text-foreground/90 truncate mb-1">
              {message.subject || '(No Subject)'}
            </h4>
            
            <p className="text-sm text-muted-foreground line-clamp-1">
              {message.intro}
            </p>

            {(otp || confirmLink) && (
              <div className="flex items-center gap-2 mt-3">
                {otp && (
                  <button
                    onClick={handleCopyOTP}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                      copied ? "bg-green-500 text-white" : "bg-primary/10 text-primary hover:bg-primary/20"
                    )}
                  >
                    {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : `OTP: ${otp}`}
                  </button>
                )}
                {confirmLink && (
                  <button
                    onClick={handleLinkClick}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg text-xs font-bold transition-all"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Activate
                  </button>
                )}
              </div>
            )}
          </div>
          
          <ChevronRight className="w-5 h-5 text-muted-foreground self-center opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <MessageModal 
        messageId={message.id} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
};
