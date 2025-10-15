import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import useAuthStore from "./store/useAuthStore";

// ✅ 로그인 & 회원가입
import LoginPage from "./components/LoginPage/LoginPage";
import AuthCallbackGoogle from "./components/LoginPage/AuthCallbackGoogle";
import AuthCallbackKakao from "./components/LoginPage/AuthCallbackKakao";
import SignupPage from "./components/SignupPage/SignupPage";

// ✅ 메인 페이지
import MainPage from "./components/MainPage/MainPage";

// ✅ PaperTrading 관련
import PaperTrading from "./components/PaperTrading/PaperTrading";
import DashboardLayout from "./components/PaperTrading/DashboardLayout";
import AllStocksList from "./components/PaperTrading/AllStocksList";
import AllStocksDetail from "./components/PaperTrading/AllStocksDetail";
import QuizPage from "./components/PaperTrading/Quiz";

// ✅ 포트폴리오 관련
import PortfolioPage from "./components/PortfolioPage/PortfolioPage";
import StockRecommendationPage from "./components/StockRecommendationPage/StockRecommendationPage";
import InvestmentPropensityPage from "./components/InvestmentPropensityPage/InvestmentPropensityPage";

// ✅ 설정 관련
import SettingLayout from "./components/Setting/SettingLayout";
import Profile from "./components/Setting/Profile";
import Investment from "./components/Setting/Investment";
import Settings from "./components/Setting/SettingPage";
import Notification from "./components/Setting/Notification";

// ✅ 예금 & 정책
import SavingsPage from "./components/SavingsPage/SavingsPage";
import SavingsDetailPage from "./components/SavingsDetailPage/SavingsDetailPage";
import PolicyPage from "./components/PolicyPage/PolicyPage";
import PolicyDetailPage from "./components/PolicyDetailPage/PolicyDetailPage";

// ✅ 인증 라우트
import PrivateRoute from "./api/PrivateRoute";

// ✅ React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 3,
    },
  },
});

function App() {
  const { fetchProfile } = useAuthStore();

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
          {/* ✅ 로그인 & 회원가입 */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* ✅ 소셜 로그인 콜백 */}
          <Route path="/auth/callback/google" element={<AuthCallbackGoogle />} />
          <Route path="/auth/callback/kakao" element={<AuthCallbackKakao />} />

          {/* ✅ 메인 페이지 (보호됨) */}
          <Route
            path="/main"
            element={
              <PrivateRoute>
                <MainPage />
              </PrivateRoute>
            }
          />

          {/* ✅ 예금 관련 페이지 */}
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

          {/* ✅ 정책 관련 페이지 */}
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

          {/* ✅ 포트폴리오 관련 페이지 */}
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
          <Route
            path="/portfolio/recommendations"
            element={
              <PrivateRoute>
                <StockRecommendationPage />
              </PrivateRoute>
            }
          />

          {/* ✅ 설정 관련 (SettingLayout 구조 유지) */}
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
            <Route path="investment" element={<Investment />} />
          </Route>

          {/* ✅ PaperTrading 관련 페이지 (DashboardLayout 내부 라우팅) */}
          <Route
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route path="/papertrading" element={<PaperTrading />} />

            {/* ✅ 전체 종목 리스트 및 상세 페이지 */}
            <Route path="/all-stocks" element={<AllStocksList />} />
            <Route
              path="/all-stocks/:stockId"
              element={<AllStocksDetail />}
            />

            <Route path="/quiz" element={<QuizPage />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* ✅ React Query Devtools (선택사항) */}
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
