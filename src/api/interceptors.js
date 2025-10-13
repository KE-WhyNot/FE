import axios from "axios";

let isRefreshing = false;
let refreshSubscribers = [];

// ✅ 새 토큰 발급되면 대기 중인 요청들에 전달
const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// ✅ 새 토큰 기다리는 요청들 큐에 추가
const addSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// ✅ Request Interceptor — 매 요청 시 accessToken 자동 첨부
export const attachAuthInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );
};

// ✅ Response Interceptor — 401 발생 시 refreshToken으로 재발급 처리
export const attachResponseInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      // 🔸 axios에서 네트워크 오류 등으로 response가 없을 수 있음
      if (!error.response) {
        console.error("🚨 네트워크 오류 또는 서버 응답 없음:", error);
        return Promise.reject(error);
      }

      // 🔸 401 Unauthorized인 경우만 처리
      if (error.response.status === 401 && !originalRequest._retry) {
        const refreshToken = localStorage.getItem("refreshToken");

        // ❌ refreshToken이 없으면 로그인 페이지로
        if (!refreshToken) {
          console.warn("⚠️ refreshToken 없음 → 로그인 필요");
          localStorage.removeItem("accessToken");
          window.location.href = "/";
          return Promise.reject(error);
        }

        // ✅ 이미 재발급 중이라면 큐에 추가
        if (isRefreshing) {
          console.log("⏳ 이미 refresh 진행 중... 요청 대기열에 추가");
          return new Promise((resolve) => {
            addSubscriber((newToken) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(axiosInstance(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          console.log("🔁 refreshToken으로 새 accessToken 요청 중...");

          const res = await axios.post(
            "https://auth.youth-fi.com/api/auth/reissue",
            { refreshToken },
            { headers: { "Content-Type": "application/json" } }
          );

          // ✅ 응답 구조에 따라 accessToken/refreshToken 추출
          const newAccessToken =
            res.data?.data?.accessToken || res.data?.accessToken;
          const newRefreshToken =
            res.data?.data?.refreshToken || res.data?.refreshToken;

          if (!newAccessToken) {
            console.error("❌ 새 accessToken이 응답에 없음:", res.data);
            throw new Error("accessToken 갱신 실패");
          }

          // ✅ 로컬 스토리지 갱신
          localStorage.setItem("accessToken", newAccessToken);
          if (newRefreshToken)
            localStorage.setItem("refreshToken", newRefreshToken);

          // ✅ axios 인스턴스 기본 헤더 갱신
          axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

          console.log("✅ 새 accessToken 저장 완료, 대기 요청 처리 중...");

          // ✅ 대기 중이던 요청들에 새 토큰 전달
          onRefreshed(newAccessToken);

          // ✅ 실패했던 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (reissueError) {
          console.error("❌ refresh token 재발급 실패:", reissueError);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/";
          return Promise.reject(reissueError);
        } finally {
          isRefreshing = false;
        }
      }

      // ✅ 401 외의 오류는 그대로 반환
      return Promise.reject(error);
    }
  );
};
