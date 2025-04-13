'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login as apiLogin, logout as apiLogout, isAuthenticated, AuthResponse } from '@/lib/api/authApi';
import { getCurrentUser } from '@/lib/api/usersApi';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Sprawdzenie, czy użytkownik jest zalogowany przy ładowaniu strony
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          // Pobieranie danych użytkownika
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Błąd sprawdzania autentykacji:', error);
        // Jeśli nie udało się pobrać danych użytkownika, wylogowanie
        await apiLogout();
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiLogin({ email, password });
      setUser(response.user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Błąd logowania:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiLogout();
      setUser(null);
      router.push('/auth/login');
    } catch (error) {
      console.error('Błąd wylogowania:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
