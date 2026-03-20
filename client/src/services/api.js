import axios from "axios";

const api = axios.create({
  // This uses the variable from your client/.env file
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// This interceptor grabs the token before EVERY request
api.interceptors.request.use(
  (config) => {
    // We will store the user data in localStorage via Zustand shortly
    const userStorage = localStorage.getItem("auth-storage");

    if (userStorage) {
      const { state } = JSON.parse(userStorage);
      if (state.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
