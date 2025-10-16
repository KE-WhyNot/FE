import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // ✅ React Query 추가
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // ✅ Devtools (선택)

import useAuthStore from "./store/useAuthStore";

import LoginPage from "./components/LoginPage/LoginPage";
import AuthCallbackGoogle from "./components/LoginPage/AuthCallbackGoogle";
import AuthCallbackKakao from "./components/LoginPage/AuthCallbackKakao";
import MainPage from "./components/MainPage/MainPage";
import SignupPage from "./components/SignupPage/SignupPage";
import PaperTrading from "./components/PaperTrading/PaperTrading";
import SettingLayout from "./components/Setting/SettingLayout";
import Profile from "./components/Setting/Profile";
import Settings from "./components/Setting/SettingPage";
import Notification from "./components/Setting/Notification";
import SavingsPage from "./components/SavingsPage/SavingsPage";
import PolicyPage from "./components/PolicyPage/PolicyPage";
import DashboardLayout from "./components/PaperTrading/DashboardLayout";
import AllStocks from "./components/PaperTrading/AllStocks";
import QuizPage from "./components/PaperTrading/Quiz";
import PortfolioPage from "./components/PortfolioPage/PortfolioPage";
import InvestmentPropensityPage from "./components/InvestmentPropensityPage/InvestmentPropensityPage";
import PrivateRoute from "./api/PrivateRoute";
import SavingsDetailPage from "./components/SavingsDetailPage/SavingsDetailPage";
import PolicyDetailPage from "./components/PolicyDetailPage/PolicyDetailPage";

// ✅ React Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 탭 전환 시 재요청 방지
      retry: 1, // 실패 시 1회만 재시도
      staleTime: 1000 * 60 * 3, // 3분간 fresh 상태 유지
    },
  },
});

function App() {
  const { fetchProfile } = useAuthStore();

  // ✅ 로그인 상태 유지용 (accessToken 있을 경우 프로필 자동 불러오기)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchProfile();
    }
  }, [fetchProfile]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* ✅ 로그인 & 회원가입 페이지 (비보호) */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* ✅ 소셜 로그인 콜백 (비보호) */}
          <Route
            path="/auth/callback/google"
            element={<AuthCallbackGoogle />}
          />
          <Route path="/auth/callback/kakao" element={<AuthCallbackKakao />} />

          {/* ✅ 보호된 라우트 영역 */}
          <Route
            path="/main"
            element={
              <PrivateRoute>
                <MainPage />
              </PrivateRoute>
            }
          />

          {/* ✅ 예금 관련 페이지 (보호됨) */}
          <Route
            path="/savings"
            element={
              <PrivateRoute>
                <SavingsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/savings/:productId"
            element={
              <PrivateRoute>
                <SavingsDetailPage />
              </PrivateRoute>
            }
          />

          {/* ✅ 정책 관련 페이지 (보호됨) */}
          <Route
            path="/policy"
            element={
              <PrivateRoute>
                <PolicyPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/policy/:policyId"
            element={
              <PrivateRoute>
                <PolicyDetailPage />
              </PrivateRoute>
            }
          />

          {/* ✅ 포트폴리오 관련 페이지 (보호됨) */}
          <Route
            path="/portfolio"
            element={
              <PrivateRoute>
                <InvestmentPropensityPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/portfolio-main"
            element={
              <PrivateRoute>
                <PortfolioPage />
              </PrivateRoute>
            }
          />

          {/* ✅ 설정 관련 페이지 (SettingLayout 내부 구조 유지) */}
          <Route
            path="/setting"
            element={
              <PrivateRoute>
                <SettingLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Profile />} />
            <Route path="profile" element={<Profile />} />
            <Route path="notification" element={<Notification />} />
            <Route path="settings" element={<Settings />} />
            <Route path="investment" element={<InvestmentPropensityPage />} />
          </Route>

          {/* ✅ PaperTrading 관련 페이지 (DashboardLayout으로 감쌈) */}
          <Route
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route path="/papertrading" element={<PaperTrading />} />
            <Route path="/all-stocks" element={<AllStocks />} />
            <Route path="/quiz" element={<QuizPage />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* ✅ React Query 개발자 도구 (선택사항, 개발용) */}
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;