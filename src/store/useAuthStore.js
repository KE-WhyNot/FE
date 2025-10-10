import { create } from "zustand";
import axiosInstance from "../api/authAxiosInstance";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  fetchProfile: async () => {
    try {
      const res = await axiosInstance.get("/api/auth/profile");
      set({ user: res.data.result, isAuthenticated: true });
    } catch (err) {
      if (err.response?.status === 401) {
        console.log("⛔ 인증이 만료됨. fetchProfile 중단");
        set({ user: null, isAuthenticated: false });
        return; // ✅ 무한 루프 방지
      }
      console.error("프로필 가져오기 실패:", err);
    }
  },

  logout: async () => {
    try {
      await axiosInstance.delete("/api/auth/logout");
    } catch (err) {
      console.warn("이미 로그아웃된 상태이거나 요청 실패:", err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({ user: null, isAuthenticated: false });
      window.location.href = "/";
    }
  },
}));

export default useAuthStore;
