import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { tokenUtils } from '../services/auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return tokenUtils.getToken();
  });

  const isAuthenticated = !!accessToken;

  const login = (token: string) => {
    tokenUtils.setToken(token);
    setAccessToken(token);
  };

  const logout = () => {
    tokenUtils.removeToken();
    setAccessToken(null);
  };

  useEffect(() => {
    const token = tokenUtils.getToken();
    if (token) setAccessToken(token);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
}; 