import { useCallback } from 'react';
import { mailService } from '../api/mailService';
import { useMailStore } from '../store/useMailStore';

export const useAuth = () => {
  const { setAccount, setToken, setLoading, setError, logout: storeLogout } = useMailStore();

  const createAccount = useCallback(async (customAddress?: string, customPassword?: string) => {
    setLoading(true);
    setError(null);
    try {
      let address = customAddress;
      let password = customPassword || Math.random().toString(36).substring(2, 12);

      if (!address) {
        const domains = await mailService.getDomains();
        if (!domains.length) throw new Error('No domains available');
        const domain = domains[0].domain;
        const randomName = Math.random().toString(36).substring(2, 10);
        address = `${randomName}@${domain}`;
      }

      await mailService.createAccount(address, password);
      const tokenData = await mailService.getToken(address, password);
      
      setAccount({ address, password });
      setToken(tokenData.token);
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.['hydra:description'] || err.message || 'Failed to create account';
      setError(errorMsg);
      console.error('Auth Error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setAccount, setToken, setLoading, setError]);

  const getAvailableDomains = useCallback(async () => {
    try {
      return await mailService.getDomains();
    } catch (err) {
      console.error('Failed to fetch domains:', err);
      return [];
    }
  }, []);

  return { createAccount, logout, getAvailableDomains };
};
