import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "../api/authAxiosInstance";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      // ✅ 전역 user 수동 업데이트용
      setUser: (updatedUser) =>
        set((state) => ({
          user: updatedUser,
          isAuthenticated: !!updatedUser,
        })),

      // ✅ 프로필 가져오기
      fetchProfile: async () => {
        try {
          const res = await axiosInstance.get("/api/auth/profile");
          set({ user: res.data.result, isAuthenticated: true });
        } catch (err) {
          if (err.response?.status === 401) {
            console.log("⛔ 인증이 만료됨. fetchProfile 중단");
            set({ user: null, isAuthenticated: false });
            return;
          }
          console.error("프로필 가져오기 실패:", err);
        }
      },

      // ✅ 로그아웃
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
    }),
    {
      name: "auth-storage", // ✅ localStorage key
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
