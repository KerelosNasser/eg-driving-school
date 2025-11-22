'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

interface AdminContextType {
  user: User | null;
  isAdmin: boolean;
  isEditing: boolean;
  toggleEditMode: () => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth is not initialized.");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        setIsEditing(false); // Disable edit mode if not admin
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleEditMode = () => {
    if (isAdmin) {
      setIsEditing(!isEditing);
    }
  };

  const login = async () => {
    if (!auth) {
      console.error("Auth is not initialized");
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AdminContext.Provider value={{ user, isAdmin, isEditing, toggleEditMode, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
