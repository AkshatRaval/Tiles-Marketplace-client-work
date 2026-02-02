// lib/api.ts

import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Only add headers if running in browser
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      if (userId) {
        config.headers["x-user-id"] = userId;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor - DON'T auto-redirect, let components handle it
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Just log the error, don't redirect automatically
    if (error.response?.status === 401) {
      console.warn("Authentication required for this request");
    }
    return Promise.reject(error);
  }
);