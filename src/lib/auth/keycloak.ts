// lib/keycloak.ts
import Keycloak from "keycloak-js";

let keycloak: Keycloak | null = null;
let initPromise: Promise<Keycloak | null> | null = null;

export const initKeycloak = (): Promise<Keycloak | null> => {
  if (initPromise) {
    return initPromise;
  }

  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  initPromise = new Promise((resolve) => {
    if (!keycloak) {
      keycloak = new Keycloak({
        url: (import.meta as any).env?.VITE_KEYCLOAK_URL || "http://localhost:8080",
        realm: (import.meta as any).env?.VITE_KEYCLOAK_REALM || "employee-recognition",
        clientId: (import.meta as any).env?.VITE_KEYCLOAK_CLIENT_ID || "employee-recognition-frontend",
      });
      
      keycloak.init({
        onLoad: "login-required",
        checkLoginIframe: false,
        pkceMethod: "S256",
        enableLogging: false, // Disabled for production security
      })
      .then((authenticated) => {
        if (authenticated) {
          setInterval(() => {
            keycloak?.updateToken(70);
          }, 60000);
        }
        resolve(keycloak);
      })
      .catch((error) => {
        console.error("Keycloak initialization failed", error);
        resolve(null);
      });
    } else {
      resolve(keycloak);
    }
  });

  return initPromise;
};

export const getKeycloakInstance = () => keycloak;
export const getAccessToken = () => keycloak?.token || null;

// Logout
export const logout = () => {
  if (keycloak) {
    keycloak.logout();
  }
};

// User Info
export const getUserInfo = async () => {
  if (keycloak) {
    try {
      const userInfo = await keycloak.loadUserInfo();
      return userInfo;
    } catch (err) {
      console.error("Failed to load user info", err);
    }
  }
  return null;
};

// Add role checking function for UI purposes
export const hasRole = (role: string): boolean => {
  return keycloak?.tokenParsed?.realm_access?.roles?.includes(role) || false;
};

// Get current user's keycloak ID
export const getCurrentUserId = (): string | null => {
  return keycloak?.tokenParsed?.sub || null;
};
