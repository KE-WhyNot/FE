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