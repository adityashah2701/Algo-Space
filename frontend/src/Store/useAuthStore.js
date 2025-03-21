import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  setUser: (user) => set({ user }),
  isLoading: false,
  isError: false,
  error: null,
  // Add other state variables here
  signup: async (data) => {
    try {
      set({ isLoading: true, isError: false, error: null });
      const response = await axiosInstance.post("/auth/register", data);
      set({ user: response.data.data, isLoading: false });
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      localStorage.setItem("token", response.data.data.token);
      return response.data.data;
    } catch (error) {
      set({
        isLoading: false,
        isError: true,
        error: error.response.data.message,
      });
      return error.response.data;
    }
  },
  login: async (data) => {
    try {
      set({ isLoading: true, isError: false, error: null });
      const response = await axiosInstance.post("/auth/login", data);
      set({ user: response.data.data, isLoading: false });
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      localStorage.setItem("token", response.data.data.token);
      return response.data.data;
    } catch (error) {
      set({
        isLoading: false,
        isError: true,
        error: error.response.data.message,
      });
      return error.response.data;
    }
  },
  completeProfile: async (data) => {
    try {
      set({ isLoading: true, isError: false, error: null });
      const response = await axiosInstance.post(
        "/auth/register/complete-profile",
        data
      );
      set({ user: response.data.data, isLoading: false });
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      localStorage.setItem("token", response.data.data.token);
      return response.data.data;
    } catch (error) {
      set({
        isLoading: false,
        isError: true,
        error: error.response.data.message,
      });
      return error.response.data;
    }
  },
}));
