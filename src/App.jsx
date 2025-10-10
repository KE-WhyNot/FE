import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import StockRecommendationPage from "./components/StockRecommendationPage/StockRecommendationPage";
import InvestmentPropensityPage from "./components/InvestmentPropensityPage/InvestmentPropensityPage";
import PrivateRoute from "./api/PrivateRoute";
import SavingsDetailPage from "./components/SavingsDetailPage/SavingsDetailPage";
import PolicyDetailPage from "./components/PolicyDetailPage/PolicyDetailPage";

function App() {
  const { fetchProfile } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchProfile();
    }
  }, [fetchProfile]);

  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ 로그인 & 회원가입 페이지 (비보호) */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* ✅ 소셜 로그인 콜백 (비보호) */}
        <Route path="/auth/callback/google" element={<AuthCallbackGoogle />} />
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

        {/* ✅ 예금/정책 페이지 + 상세 페이지 (보호됨) */}
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
        <Route
          path="/portfolio/recommendations"
          element={
            <PrivateRoute>
              <StockRecommendationPage />
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

        {/* ✅ PaperTrading 관련 (DashboardLayout으로 감쌈) */}
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
  );
}

export default App;
