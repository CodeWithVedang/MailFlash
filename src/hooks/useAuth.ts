import { useCallback } from 'react';
import { mailService } from '../api/mailService';
import { useMailStore } from '../store/useMailStore';

export const useAuth = () => {
  const { setAccount, setToken, setLoading, setError, logout: storeLogout } = useMailStore();

  const createAccount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const domains = await mailService.getDomains();
      if (!domains.length) throw new Error('No domains available');
      
      const domain = domains[0].domain;
      const randomName = Math.random().toString(36).substring(2, 10);
      const address = `${randomName}@${domain}`;
      const password = Math.random().toString(36);

      await mailService.createAccount(address, password);
      const tokenData = await mailService.getToken(address, password);
      
      setAccount({ address, password });
      setToken(tokenData.token);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      console.error('Auth Error:', err);
    } finally {
      setLoading(false);
    }
  }, [setAccount, setToken, setLoading, setError]);

  const logout = useCallback(() => {
    storeLogout();
  }, [storeLogout]);

  return { createAccount, logout };
};
