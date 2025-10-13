import axios from "axios";

// 🚀 proxy 설정 덕분에 baseURL은 /api 로 시작
const notifyAxios = axios.create({
  baseURL: "/api", // ✅ 중요: localhost 프록시가 이걸 자동으로 https://notify.youth-fi.com 으로 전달
  headers: {
    "Content-Type": "application/json",
  },
});

export default notifyAxios;
