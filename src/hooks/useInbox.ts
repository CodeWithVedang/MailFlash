import { useEffect, useCallback, useRef } from 'react';
import { mailService } from '../api/mailService';
import { useMailStore } from '../store/useMailStore';

export const useInbox = () => {
  const { 
    token, 
    setMessages, 
    addMessages, 
    setLoading, 
    setError, 
    setPolling,
    isPolling 
  } = useMailStore();
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchInbox = useCallback(async (isInitial = false) => {
    if (!token) return;
    if (isInitial) setLoading(true);
    
    try {
      const messages = await mailService.getMessages();
      if (isInitial) {
        setMessages(messages);
      } else {
        addMessages(messages);
      }
    } catch (err: any) {
      if (isInitial) setError(err.message || 'Failed to fetch messages');
      console.error('Inbox Error:', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [token, setMessages, addMessages, setLoading, setError]);

  const startPolling = useCallback(() => {
    if (pollingRef.current) return;
    setPolling(true);
    fetchInbox(); // Fetch immediately
    pollingRef.current = setInterval(() => {
      fetchInbox();
    }, 5000); // Poll every 5 seconds
  }, [fetchInbox, setPolling]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setPolling(false);
  }, [setPolling]);

  useEffect(() => {
    if (token) {
      startPolling();
    } else {
      stopPolling();
    }
    return () => stopPolling();
  }, [token, startPolling, stopPolling]);

  return { fetchInbox, startPolling, stopPolling, isPolling };
};
