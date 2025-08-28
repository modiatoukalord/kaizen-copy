
'use client';

import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getUserByUsername, createUser, updateUserByUsername } from '@/lib/data';

type User = {
  id: string;
  username: string;
  pinHash: string;
};

type AuthContextType = {
  user: { username: string } | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (username: string, pin: string) => Promise<void>;
  logout: () => void;
  changePin: (oldPin: string, newPin: string) => Promise<void>;
  changeUsername: (newUsername: string, pin: string) => Promise<void>;
  isRegistering: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A mock hashing function for the PIN. In a real app, use a robust library like bcrypt.
const mockHash = (pin: string) => `hashed-${pin}`;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
        try {
          const sessionUserJson = sessionStorage.getItem('finance-app-session');
          if (sessionUserJson) {
            setUser(JSON.parse(sessionUserJson));
          } else {
            // Check if any user exists in the DB to determine if we are in a register or login state
             const checkUser = await getUserByUsername(null); 
             setIsRegistering(!checkUser);
          }
        } catch (error) {
          console.error("Failed to parse session user:", error);
          sessionStorage.removeItem('finance-app-session');
        } finally {
          setIsAuthLoading(false);
        }
    };
    checkUserStatus();
  }, []);

  const login = useCallback(async (username: string, pin: string) => {
    const existingUser = await getUserByUsername(username);
    
    if (existingUser) {
      // Login existing user
      if (mockHash(pin) === existingUser.pinHash) {
        const currentUser = { username: existingUser.username };
        setUser(currentUser);
        sessionStorage.setItem('finance-app-session', JSON.stringify(currentUser));
        router.replace('/dashboard');
      } else {
        throw new Error('Nom d\'utilisateur ou code PIN incorrect.');
      }
    } else {
       // Check if any user exists at all
       const anyUser = await getUserByUsername(null);
       if (anyUser) {
            // If users exist but this one doesn't, it's wrong credentials
            throw new Error('Nom d\'utilisateur ou code PIN incorrect.');
       } else {
            // No users exist, so register this new user
            const pinHash = mockHash(pin);
            await createUser(username, pinHash);
            const currentUser = { username };
            setUser(currentUser);
            sessionStorage.setItem('finance-app-session', JSON.stringify(currentUser));
            router.replace('/dashboard');
       }
    }
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('finance-app-session');
    router.replace('/login');
  }, [router]);

  const changePin = useCallback(async (oldPin: string, newPin: string) => {
    if (!user) throw new Error("Utilisateur non connecté.");
    
    const storedUser = await getUserByUsername(user.username);
    if (!storedUser) throw new Error("Utilisateur non trouvé.");
    
    if (mockHash(oldPin) === storedUser.pinHash) {
        const newPinHash = mockHash(newPin);
        await updateUserByUsername(user.username, { pinHash: newPinHash });
    } else {
        throw new Error("L'ancien code PIN est incorrect.");
    }
  }, [user]);
  
  const changeUsername = useCallback(async (newUsername: string, pin: string) => {
    if (!user) throw new Error("Utilisateur non connecté.");

    const storedUser = await getUserByUsername(user.username);
    if (!storedUser) throw new Error("Utilisateur non trouvé.");

    if (mockHash(pin) !== storedUser.pinHash) {
      throw new Error("Le code PIN est incorrect.");
    }
    
    // Check if new username already exists
    const newUsernameExists = await getUserByUsername(newUsername);
    if (newUsernameExists) {
        throw new Error("Ce nom d'utilisateur est déjà pris.");
    }

    await updateUserByUsername(user.username, { username: newUsername });
    const currentUser = { username: newUsername };
    setUser(currentUser);
    sessionStorage.setItem('finance-app-session', JSON.stringify(currentUser));
  }, [user]);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isAuthLoading,
    isRegistering,
    login,
    logout,
    changePin,
    changeUsername,
  }), [user, isAuthLoading, isRegistering, login, logout, changePin, changeUsername]);

  return (
    <AuthContext.Provider value={value}>
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
