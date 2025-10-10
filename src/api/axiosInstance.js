// axiosInstance.js
import axios from "axios";

let isLoggingOut = false; // ✅ 로그아웃 중 여부 플래그

const axiosInstance = axios.create({
  baseURL: "https://auth.youth-fi.com",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401 && !isLoggingOut) {
      isLoggingOut = true; // ✅ 중복 방지

      console.warn("🔐 토큰이 만료되었거나 유효하지 않습니다.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
