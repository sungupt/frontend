import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthenticatedUser } from '../shared/types';
import api from '../shared/services/api';

interface AuthContextType {
  user: AuthenticatedUser | null;
  loading: boolean;
  login: (credentials: { emailId: string; password: string }) => Promise<void>;
  register: (data: {
    emailId: string;
    name: string;
    password: string;
    newPassword: string;
    phoneNumber: string;
    address: string;
  }) => Promise<void>;
  logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');
  if (token && email) {
    setUser({ emailId: email } as any);
  } else {
    setUser(null);
  }
  setLoading(false);
}, []);

  const login = async (credentials: { emailId: string; password: string }) => {
    const response = await api.post('/customer-api/login', credentials);
    const { token, emailId } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('email', emailId);
    const userData = { emailId };
    localStorage.setItem('user', JSON.stringify(userData));

    setUser(userData as any);
  };

  const register = async (data: any) => {
    await api.post('/customer-api/register', data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};