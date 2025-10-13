// src/api/policyAxiosInstance.js
import axios from "axios";

// ✅ 공통 인증 토큰 및 에러 처리 로직 복붙 대신 재사용 가능하도록 함수화
import {
  attachAuthInterceptor,
  attachResponseInterceptor,
} from "./interceptors";

const policyAxios = axios.create({
  baseURL: "https://policy.youth-fi.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 공통 인터셉터 로직 적용
attachAuthInterceptor(policyAxios);
attachResponseInterceptor(policyAxios);

export default policyAxios;
