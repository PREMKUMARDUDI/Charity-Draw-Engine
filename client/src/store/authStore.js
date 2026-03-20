// client/src/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/login", { email, password });
          // Assuming your backend sends the token in the response body now,
          // or we grab the token to store it locally.
          set({
            user: response.data,
            token: response.data.token,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error.response?.data?.message || "Login failed",
            isLoading: false,
          });
        }
      },

      logout: async () => {
        try {
          await api.post("/auth/logout");
          set({ user: null, token: null });
        } catch (error) {
          console.error("Logout failed", error);
        }
      },
    }),
    {
      name: "auth-storage", // This automatically saves to localStorage!
    },
  ),
);

export default useAuthStore;
