"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoginModalOpen: boolean;
  isSignUpModalOpen: boolean; // New State
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openSignUpModal: () => void; // New Action
  closeSignUpModal: () => void; // New Action
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const login = (userData: User) => setUser(userData);
  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken"); // Clear token
  };
  
  const openLoginModal = () => { setIsLoginModalOpen(true); setIsSignUpModalOpen(false); };
  const closeLoginModal = () => setIsLoginModalOpen(false);
  
  const openSignUpModal = () => { setIsSignUpModalOpen(true); setIsLoginModalOpen(false); };
  const closeSignUpModal = () => setIsSignUpModalOpen(false);

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, 
      isLoginModalOpen, openLoginModal, closeLoginModal,
      isSignUpModalOpen, openSignUpModal, closeSignUpModal
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}