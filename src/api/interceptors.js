// src/api/interceptors.js
let isLoggingOut = false;

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

export const attachResponseInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && !isLoggingOut) {
        isLoggingOut = true;
        console.warn("🔐 토큰이 만료되었거나 유효하지 않습니다.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
      }
      return Promise.reject(error);
    }
  );
};
