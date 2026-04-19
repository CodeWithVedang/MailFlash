'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, User, Calendar, Mail as MailIcon } from 'lucide-react';
import { mailService } from '@/api/mailService';
import { Message } from '@/types';
import { formatDate } from '@/utils';

interface MessageModalProps {
  messageId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const MessageModal: React.FC<MessageModalProps> = ({ messageId, isOpen, onClose }) => {
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && messageId) {
      const fetchFullMessage = async () => {
        setLoading(true);
        try {
          const fullMsg = await mailService.getMessage(messageId);
          setMessage(fullMsg);
        } catch (err) {
          console.error('Failed to fetch message:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchFullMessage();
    }
  }, [isOpen, messageId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-card border border-border shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col max-h-full"
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-border flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                  {loading ? 'Loading...' : message?.subject || '(No Subject)'}
                </h2>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span className="font-medium text-foreground">{message?.from.name || message?.from.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{message ? formatDate(message.createdAt) : ''}</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                  <div className="h-40 bg-muted animate-pulse rounded w-full" />
                </div>
              ) : (
                <div 
                  className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-foreground"
                >
                  {message?.html && message.html.length > 0 ? (
                    <iframe 
                      srcDoc={message.html[0]} 
                      className="w-full min-h-[400px] border-none"
                      title="Email Content"
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{message?.text || message?.intro || '(No Content)'}</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
