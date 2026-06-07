'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser, UsernameType, UserRole } from '@/types';
import { signOut, signIn, useSession, SessionProvider } from "next-auth/react";
import { usePathname, useRouter } from 'next/navigation';
import { apiGetMe, registerUser } from '../httpclient/user.client';
import { useLanguage } from './language-context';
import { toast } from 'sonner';
import { checkUsernameType } from '../utils.username';
import { getLocalCustomer, renewLocalCustomer } from '../utils.localStorage';
import { apiGetNotificationSettings } from '../httpclient/notification.client';

interface AuthContextType {
  user: IUser | null;
  login: (phone: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (fullName: string, username: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<IUser>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <_AuthProviderContent>{children}</_AuthProviderContent>
    </SessionProvider>
  );
}

function _AuthProviderContent({ children }: { children: React.ReactNode }) {
  const pathName = usePathname()
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();
  const { t } = useLanguage();

  const fetchGetMe = async () => {
    try {
      setIsLoading(true)
      if (session?.user?.id) {
        const res = await Promise.all([
          apiGetMe(session.user.id),
          apiGetNotificationSettings(session.user.id)
        ])
        setUser(res[0])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username: string, password: string, rememberMe: boolean = false) => {
    try {
      setIsLoading(true);
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
        rememberMe,
      });
      if (res.error) {
        toast(t("auth.register.account.alert"), {
          position: "bottom-left",
          description: t("auth.register.account.wrongLoginInfo"),
        })
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, username: string, password: string) => {
    try {
      setIsLoading(true);
      const checkUsername = checkUsernameType(username)
      const newUser: IUser = {
        fullName: fullName,
        username: username,
        password,
        passwordSalt: "",
        role: UserRole.customer,
        active: true,
        lastLogin: new Date(),
        email: checkUsername === UsernameType.email ? username : '',
        phone: checkUsername === UsernameType.phone ? username : ''
      };
      const data = await registerUser(newUser)
      if (data.success) {
        router.push('/login');
      }
      else {
        toast(t("auth.register.account.alert"), {
          position: "bottom-left",
          description: t("auth.register.account.existed"),
        })
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { redirect: true });
    } catch (error) {
      console.error("Google login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      renewLocalCustomer();
      setUser(null);
      await signOut({ callbackUrl: "/" });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<IUser>) => {
    if (!user) return;
    setIsLoading(true);
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    if (rememberMe) localStorage.setItem('ecom_user', JSON.stringify(updatedUser));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchGetMe()
  }, [session]);

  useEffect(() => {
    if (user) {
      if (pathName === '/login' || pathName === "/register") {
        router.replace('/account');
      }
    } else {
      if (pathName === '/account') {
        router.replace('/login');
      }
    }
  }, [pathName, user])

  useEffect(() => {
    // Generate customer information for guest user to track orders and save notes.
    // getLocalCustomer only creates a new customer when local storage is empty.
    getLocalCustomer();
  }, [])

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
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
