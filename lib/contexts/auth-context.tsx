'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer } from '../types';

interface AuthContextType {
  user: Customer | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Customer>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUser: Customer = {
  id: '1',
  name: 'Nguyễn Văn A',
  email: 'user@example.com',
  phone: '0901234567',
  avatar: '',
  addresses: [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      street: '123 Đường Lê Lợi',
      ward: 'Phường Bến Nghé',
      district: 'Quận 1',
      city: 'TP.HCM',
      isDefault: true
    }
  ],
  preferredLanguage: 'vi',
  joinDate: '2023-01-15',
  totalOrders: 15,
  totalSpent: 2500000
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('user');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (savedUser && rememberMe) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, validate with backend
    if (email === 'user@example.com' && password === 'password') {
      setUser(mockUser);
      
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('rememberMe', 'true');
      }
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create new user
    const newUser: Customer = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      avatar: '',
      addresses: [],
      preferredLanguage: 'vi',
      joinDate: new Date().toISOString(),
      totalOrders: 0,
      totalSpent: 0
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('rememberMe', 'true');
    
    setIsLoading(false);
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    
    // Simulate Google OAuth
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock Google user
    const googleUser: Customer = {
      ...mockUser,
      name: 'Google User',
      email: 'google@example.com'
    };
    
    setUser(googleUser);
    localStorage.setItem('user', JSON.stringify(googleUser));
    localStorage.setItem('rememberMe', 'true');
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
  };

  const updateProfile = async (data: Partial<Customer>) => {
    if (!user) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      loginWithGoogle,
      logout,
      updateProfile,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}