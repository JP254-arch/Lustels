import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true, // only needed if using cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    if (!config.headers) config.headers = {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized: redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
