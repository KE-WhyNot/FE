// src/api/financeAxiosInstance.js
import axios from "axios";

const financeAxios = axios.create({
  baseURL: "https://finance.youth-fi.com", // ✅ 금융 API 기본 주소
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  withCredentials: false, // ✅ 쿠키 불필요 (필요시 true로 변경)
});

// ✅ 요청/응답 인터셉터 (옵션)
financeAxios.interceptors.request.use(
  (config) => {
    console.log("📡 [Finance API 요청]", config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

financeAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ [Finance API 오류]", error);
    return Promise.reject(error);
  }
);

export default financeAxios;
