// src/store/useAuthStore.js
import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";

const useAuthStore = create((set) => ({
  user: null, // 로그인한 사용자 정보
  isLoading: false, // 로딩 상태
  isAuthenticated: false, // 로그인 여부

  // ✅ 프로필 불러오기
  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/api/auth/profile");
      set({ user: res.data.result, isAuthenticated: true });
    } catch (err) {
      console.error("프로필 불러오기 실패:", err);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  // ✅ 로그인 시 사용자 정보 저장
  setUser: (userData) => set({ user: userData, isAuthenticated: true }),

  // ✅ 로그아웃
  logout: async () => {
    try {
      await axiosInstance.delete("/api/auth/logout");
    } catch (err) {
      console.error("로그아웃 실패:", err);
    } finally {
      localStorage.removeItem("accessToken");
      set({ user: null, isAuthenticated: false });
    }
  },
}));

export default useAuthStore;
