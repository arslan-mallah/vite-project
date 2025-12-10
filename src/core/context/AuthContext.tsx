import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthState, User } from '../services/auth.service';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => authService.getAuthState());
  const [isLoading, setIsLoading] = useState(false);

  // Subscribe to auth service changes
  useEffect(() => {
    const unsubscribe = authService.subscribe(() => {
      setAuthState(authService.getAuthState());
    });

    return unsubscribe;
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    const result = await authService.login(username, password);
    setIsLoading(false);

    return result;
  };

  const logout = () => {
    authService.logout();
    setAuthState(authService.getAuthState());
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
