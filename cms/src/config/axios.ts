import axios, { InternalAxiosRequestConfig } from "axios";

// Create an axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL ?? "http://localhost:5172/api/",
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    // Example: Assuming user is already authenticated and userId is stored in localStorage
    const userId = localStorage.getItem("userId");
    if (userId) {
      config.headers["x-userid"] = userId || 4;
    } else {
      config.headers["x-userid"] = 4;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: any) => {
    if (error.response && error.response.status === 401) {
      // Optionally not really required as we don't have a login page
      alert("Unauthorized! Please log in.");
    }
    return Promise.reject(
      error.response.data || error.message || "Unknown Error"
    );
  }
);

export default api;
