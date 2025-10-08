import axios from "axios";

// 1️⃣ Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: "https://auth.youth-fi.com", // 실제 서버 주소를 기본 URL로 설정
  headers: {
    "Content-Type": "application/json",
  },
});

// 2️⃣ 요청 인터셉터: 모든 요청에 토큰 자동 포함
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // 로그인 시 저장된 토큰
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 헤더에 토큰 추가
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3️⃣ 응답 인터셉터 (선택): 토큰 만료 처리나 공통 에러 핸들링
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 예시: accessToken이 만료되어 401 응답이 온 경우
    if (error.response && error.response.status === 401) {
      console.warn("🔐 토큰이 만료되었거나 유효하지 않습니다.");
      // 여기서 refreshToken을 사용해 자동 갱신 로직을 추가할 수도 있음.
      // (지금은 단순히 로그인 페이지로 이동하게 두는게 좋음)
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/"; // 로그인 페이지로 이동
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
