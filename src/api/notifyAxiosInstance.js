import axios from "axios";

// 🚀 proxy 설정 덕분에 baseURL은 /api 로 시작
const notifyAxios = axios.create({
  baseURL: "https://notify.youth-fi.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default notifyAxios;
