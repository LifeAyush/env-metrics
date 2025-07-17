import React, { useContext, createContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  accessToken: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  accessToken: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem('access_token');
  });

  const isAuthenticated = !!accessToken;

  const login = (token: string) => {
    localStorage.setItem('access_token', token);
    setAccessToken(token);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setAccessToken(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) setAccessToken(token);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};