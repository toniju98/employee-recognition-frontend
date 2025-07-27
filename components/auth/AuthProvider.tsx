// context/AuthContext.tsx
"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  initKeycloak,
  getKeycloakInstance,
  getAccessToken,
  getUserInfo,
  logout,
  hasRole,
} from "@/lib/auth/keycloak";

interface AuthContextType {
  keycloak: any;
  authenticated: boolean;
  accessToken: string | null;
  userInfo: any;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [keycloak, setKeycloak] = useState<any>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      initKeycloak().then((instance) => {
        if (instance) {
          setKeycloak(instance);
          setAuthenticated(true);
          setAccessToken(getAccessToken());
          getUserInfo().then((user) => setUserInfo(user));
        }
        setInitialized(true);
      });
    }
  }, [initialized]);

  return (
    <AuthContext.Provider
      value={{ keycloak, authenticated, accessToken, userInfo, logout, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
