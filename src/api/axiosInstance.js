import axios from 'axios';

// 1. Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: 'http://auth.youth-fi.com', // 실제 서버 주소를 기본 URL로 설정
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;