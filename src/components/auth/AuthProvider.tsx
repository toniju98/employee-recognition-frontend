// context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  initKeycloak,
  getAccessToken,
  getUserInfo,
  logout,
  hasRole,
} from "@/lib/auth/keycloak";

interface KeycloakUser {
  _id?: string;
  sub: string;
  email: string;
  given_name: string;
  family_name: string;
  name: string;
  preferred_username: string;
  role?: string;
  realm_access?: {
    roles: string[];
  };
}

interface KeycloakInstance {
  authenticated?: boolean;
  token?: string | null;
  tokenParsed?: {
    realm_access?: {
      roles: string[];
    };
  };
  loadUserInfo: () => Promise<KeycloakUser>;
  logout: () => void;
  updateToken: (minValidity: number) => Promise<boolean>;
}

interface AuthContextType {
  keycloak: KeycloakInstance | null;
  authenticated: boolean;
  accessToken: string | null;
  userInfo: KeycloakUser | null;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [keycloak, setKeycloak] = useState<KeycloakInstance | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<KeycloakUser | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      initKeycloak().then((instance) => {
        if (instance) {
          setKeycloak(instance as unknown as KeycloakInstance);
          setAuthenticated(true);
          setAccessToken(getAccessToken());
          getUserInfo().then((user) => setUserInfo(user as KeycloakUser || null));
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
