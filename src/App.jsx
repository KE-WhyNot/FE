import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./components/LoginPage/LoginPage";
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
import SavingsDetailPage from "./components/SavingsDetailPage/SavingsDetailPage"; // ✨ 1. 상세 페이지 import


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/setting" element={<SettingLayout />}>
          <Route index element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notification" element={<Notification />} />
          <Route path="settings" element={<Settings />} />
          {/* ✨ '투자' 메뉴에 대한 경로를 추가했습니다. */}
          <Route path="investment" element={<InvestmentPropensityPage />} />
        </Route>
        <Route path="/savings" element={<SavingsPage />} />
        <Route path="/savings/:productId" element={<SavingsDetailPage />} /> {/* ✨ 2. 상세 페이지 경로 추가 */}
        <Route path="/policy" element={<PolicyPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/papertrading" element={<PaperTrading />} />
          <Route path="/all-stocks" element={<AllStocks />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Route>
        <Route path="/portfolio" element={<InvestmentPropensityPage />} /> 
        <Route path="/portfolio-main" element={<PortfolioPage />} /> 
        <Route path="/portfolio/recommendations" element={<StockRecommendationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;