import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "../api/authAxiosInstance";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      // ✅ 전역 user 수동 업데이트 (id/userId 동기화)
      setUser: (updatedUser) => {
        if (!updatedUser) {
          set({ user: null, isAuthenticated: false });
          return;
        }

        // id 또는 userId 중 하나만 와도 통일
        const normalizedUser = {
          ...updatedUser,
          id: updatedUser.id ?? updatedUser.userId,
          userId: updatedUser.userId ?? updatedUser.id,
        };

        set({
          user: normalizedUser,
          isAuthenticated: !!normalizedUser,
        });
      },

      // ✅ 프로필 가져오기 (accessToken 존재할 때만)
      fetchProfile: async () => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          console.log("🔒 토큰 없음 → fetchProfile 중단");
          set({ user: null, isAuthenticated: false });
          return;
        }

        try {
          // axios 헤더에 토큰 반영
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;

          const res = await axiosInstance.get("/api/auth/profile");
          const result = res.data?.result;

          if (!result) {
            console.warn("⚠️ 프로필 응답이 비어있습니다.");
            set({ user: null, isAuthenticated: false });
            return;
          }

          // ✅ id/userId 동기화 (PaperTrading 호환용)
          const normalizedUser = {
            ...result,
            id: result.id ?? result.userId,
            userId: result.userId ?? result.id,
          };

          set({ user: normalizedUser, isAuthenticated: true });
          console.log("✅ 사용자 프로필 로드 완료:", normalizedUser);
        } catch (err) {
          if (err.response?.status === 401) {
            console.log("⛔ 인증 만료됨 → 상태 초기화");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            delete axiosInstance.defaults.headers.common["Authorization"];
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
          console.warn("이미 로그아웃 상태이거나 요청 실패:", err);
        } finally {
          // ✅ 토큰/헤더 완전 제거
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          delete axiosInstance.defaults.headers.common["Authorization"];

          // ✅ 상태 초기화
          set({ user: null, isAuthenticated: false });

          // ✅ 강제 리다이렉트
          window.location.replace("/");
        }
      },
    }),
    {
      name: "auth-storage", // ✅ localStorage key
      getStorage: () => localStorage,
      partialize: (state) => ({
        // persist 시 user만 저장 (토큰은 직접 관리)
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
