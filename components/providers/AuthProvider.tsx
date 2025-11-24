"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { UserProfile } from "@/types/user";
import { generateInvitationCode } from "@/lib/utils";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
  updateProfile: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (currentUser: User) => {
    if (!db) return;

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile);
      } else {
        // Create new profile
        const newProfile: UserProfile = {
          uid: currentUser.uid,
          email: currentUser.email,
          firstName: currentUser.displayName?.split(" ")[0] || "User",
          lastName:
            currentUser.displayName?.split(" ").slice(1).join(" ") || "",
          displayName: currentUser.displayName || "User",
          phoneNumber: currentUser.phoneNumber || null,
          photoURL: currentUser.photoURL || null,
          invitationCode: generateInvitationCode(),
          role: "user", // Default role
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await setDoc(userDocRef, newProfile);
        setProfile(newProfile);
      }
    } catch (error) {
      console.error("Error fetching/creating user profile:", error);
    }
  };

  useEffect(() => {
    if (!auth) {
      // Use setTimeout to avoid synchronous state update during render
      setTimeout(() => setLoading(false), 0);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        await fetchProfile(currentUser);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
      setProfile(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user || !db) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, data, { merge: true });

      setProfile((prev) => (prev ? { ...prev, ...data } : null));
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signOut, refreshProfile, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
