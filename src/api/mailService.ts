import axios from 'axios';
import { Domain, Account, TokenResponse, Message } from '../types';

const API_BASE = 'https://api.mail.tm';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mailToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const mailService = {
  async getDomains(): Promise<Domain[]> {
    const response = await api.get('/domains');
    return response.data['hydra:member'];
  },

  async createAccount(address: string, password: string): Promise<Account> {
    const response = await api.post('/accounts', { address, password });
    return response.data;
  },

  async getToken(address: string, password: string): Promise<TokenResponse> {
    const response = await api.post('/token', { address, password });
    return response.data;
  },

  async getMessages(page = 1): Promise<Message[]> {
    const response = await api.get(`/messages?page=${page}`);
    return response.data['hydra:member'];
  },

  async getMessage(id: string): Promise<Message> {
    const response = await api.get(`/messages/${id}`);
    return response.data;
  },

  async deleteMessage(id: string): Promise<void> {
    await api.delete(`/messages/${id}`);
  },

  async deleteAccount(id: string): Promise<void> {
    await api.delete(`/accounts/${id}`);
  },
};
