import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from '../types';

interface MailStore {
  account: { id: string; address: string; password: string } | null;
  token: string | null;
  messages: Message[];
  isLoading: boolean;
  isPolling: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  
  setAccount: (account: { id: string; address: string; password: string } | null) => void;
  setToken: (token: string | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessages: (newMessages: Message[]) => void;
  setLoading: (isLoading: boolean) => void;
  setPolling: (isPolling: boolean) => void;
  setError: (error: string | null) => void;
  toggleTheme: () => void;
  logout: () => void;
}

export const useMailStore = create<MailStore>()(
  persist(
    (set) => ({
      account: null,
      token: null,
      messages: [],
      isLoading: false,
      isPolling: false,
      error: null,
      theme: 'dark', // Modern default

      setAccount: (account) => set({ account }),
      setToken: (token) => {
        if (token) localStorage.setItem('mailToken', token);
        else localStorage.removeItem('mailToken');
        set({ token });
      },
      setMessages: (messages) => set({ messages }),
      addMessages: (newMessages) => 
        set((state) => {
          const existingIds = new Set(state.messages.map(m => m.id));
          const uniqueNewMessages = newMessages.filter(m => !existingIds.has(m.id));
          return { messages: [...uniqueNewMessages, ...state.messages] };
        }),
      setLoading: (isLoading) => set({ isLoading }),
      setPolling: (isPolling) => set({ isPolling }),
      setError: (error) => set({ error }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      logout: () => {
        localStorage.removeItem('mailToken');
        set({ account: null, token: null, messages: [], error: null });
      },
    }),
    {
      name: 'mailflash-storage',
      partialize: (state) => ({ 
        account: state.account, 
        token: state.token, 
        theme: state.theme 
      }),
    }
  )
);
