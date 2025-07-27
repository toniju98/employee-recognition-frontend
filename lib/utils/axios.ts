import axios from "axios";
import { initKeycloak, getKeycloakInstance } from "../auth/keycloak";

const axiosInstance = axios.create({
  baseURL: "/api",
  timeout: 100000,
});

// Keep track of the initialization
let isInitialized = false;

axiosInstance.interceptors.request.use(async (config) => {
  if (!isInitialized) {
    await initKeycloak();
    isInitialized = true;
  }
  
  const keycloak = getKeycloakInstance();
  if (keycloak?.token) {
    try {
      await keycloak.updateToken(5);
      console.log("keycloak.token", keycloak.token);
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    } catch (error) {
      console.error('Failed to refresh token', error);
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running or not accessible at port 5000');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
