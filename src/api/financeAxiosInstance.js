// src/api/financeAxiosInstance.js
import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const financeAxios = axios.create({
  baseURL: "https://finance.youth-fi.com",
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  withCredentials: true,
});

// ✅ 요청 인터셉터
financeAxios.interceptors.request.use(
  (config) => {
    console.log("📡 [Finance API 요청]", config.url);

    // ✅ accessToken 자동 추가
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // ✅ zustand에서 로그인된 유저 ID 가져오기
    const user = useAuthStore.getState().user;
    const userId = user?.id ?? user?.userId ?? null;

    if (userId) {
      config.headers["X-User-Id"] = userId;
    } else {
      console.warn("⚠️ 로그인 유저 ID 없음 → X-User-Id 헤더 미포함");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

financeAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ [Finance API 오류]", error.response || error);
    return Promise.reject(error);
  }
);

export default financeAxios;
