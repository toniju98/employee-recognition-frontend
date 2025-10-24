import axios from "axios";
import { initKeycloak, getKeycloakInstance } from "../auth/keycloak";

const axiosInstance = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_BASE_URL ? `${(import.meta as any).env.VITE_API_BASE_URL}/api` : "/api",
  timeout: 100000,
  // Add cache headers to help with browser caching
  headers: {
    'Cache-Control': 'no-cache', // Let backend handle caching
  },
});

// Keep track of the initialization
let isInitialized = false;

axiosInstance.interceptors.request.use(async (config) => {
  if (!isInitialized) {
    await initKeycloak();
    isInitialized = true;
  }

  const keycloak = getKeycloakInstance();
  if (keycloak?.authenticated && keycloak?.token) {
    // Simply add the current token - let response interceptor handle refresh
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running or not accessible at port 5000');
    }
    
    // Handle 401 Unauthorized - try to refresh token first
    if (error.response?.status === 401) {
      const keycloak = getKeycloakInstance();
      if (keycloak?.authenticated) {
        try {
          // Try to refresh the token
          const refreshed = await keycloak.updateToken(5);
          if (refreshed) {
            // Token refreshed successfully, retry the original request
            const originalRequest = error.config;
            originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
        
        // If refresh failed or token is invalid, logout
        console.log('Token expired or invalid, redirecting to login');
        keycloak.logout();
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
