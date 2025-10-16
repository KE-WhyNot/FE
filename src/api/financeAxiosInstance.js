<<<<<<< HEAD
// src/api/financeAxiosInstance.js
import axios from "axios";

const financeAxios = axios.create({
  baseURL: "https://finance.youth-fi.com",
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  withCredentials: true, // ✅ 중요: CORS 인증 포함
});

financeAxios.interceptors.request.use(
  (config) => {
    console.log("📡 [Finance API 요청]", config.url);

    // ✅ 필요한 인증 헤더 추가 (있을 경우만)
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    const userId = localStorage.getItem("userId");
    if (userId) {
      config.headers["X-User-Id"] = userId;
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
=======
import axios from "axios";
import {
  attachAuthInterceptor,
  attachResponseInterceptor,
} from "./interceptors";

// ✅ 금융(포트폴리오, LLM) 서버용 axios 인스턴스
const financeAxiosInstance = axios.create({
  baseURL: "https://finance.youth-fi.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 기존과 동일하게 토큰 자동 주입 및 갱신 인터셉터 적용
attachAuthInterceptor(financeAxiosInstance);
attachResponseInterceptor(financeAxiosInstance);

export default financeAxiosInstance;
>>>>>>> dahyun
