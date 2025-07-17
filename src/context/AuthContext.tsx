import { createContext } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  accessToken: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

