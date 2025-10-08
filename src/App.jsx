import React, { useEffect } from "react"; // ✅ useEffect 추가!
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useAuthStore from "./store/useAuthStore";

import LoginPage from "./components/LoginPage/LoginPage";
import AuthCallbackGoogle from "./components/LoginPage/AuthCallbackGoogle"; // ✅ 구글 콜백 import
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
        {/* ✅ 로그인 & 회원가입 페이지는 보호 안함 */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* ✅ 구글 로그인 콜백 (보호 X, 로그인 전에도 접근 가능) */}
        <Route path="/auth/callback/google" element={<AuthCallbackGoogle />} />

        {/* ✅ 로그인된 사용자만 접근 가능한 보호 라우트 */}
        <Route
          path="/main"
          element={
            <PrivateRoute>
              <MainPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/savings"
          element={
            <PrivateRoute>
              <SavingsPage />
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

        {/* ✅ SettingLayout 및 하위 페이지들도 보호 */}
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

        {/* ✅ PaperTrading 관련 페이지들도 보호 */}
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
