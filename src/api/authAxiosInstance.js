// src/api/axiosInstance.js
import axios from "axios";
import {
  attachAuthInterceptor,
  attachResponseInterceptor,
} from "./interceptors";

// ✅ 인증 서버용 axios
const axiosInstance = axios.create({
  baseURL: "https://auth.youth-fi.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 공통 인터셉터 적용
attachAuthInterceptor(axiosInstance);
attachResponseInterceptor(axiosInstance);

export default axiosInstance;
