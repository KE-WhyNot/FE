import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import MainPage from './components/MainPage/MainPage';
import SignupPage from './components/SignupPage/SignupPage';
import PaperTrading from './components/PaperTrading/PaperTrading';
import SettingLayout from './components/Setting/SettingLayout';
import Profile from './components/Setting/Profile';
import Notification from './components/Setting/Notification';
import SavingsPage from './components/SavingsPage/SavingsPage';
import PolicyPage from './components/PolicyPage/PolicyPage';
import PortfolioPage from './components/PortfolioPage/PortfolioPage';
import StockRecommendationPage from './components/StockRecommendationPage/StockRecommendationPage';
import InvestmentPropensityPage from './components/InvestmentPropensityPage/InvestmentPropensityPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/papertrading" element={<PaperTrading />} />
        <Route path="/setting" element={<SettingLayout />}>
          <Route index element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notification" element={<Notification />} />
        </Route>
        <Route path="/savings" element={<SavingsPage />} />
        <Route path="/policy" element={<PolicyPage />} />
        {/* ✨ 1. /portfolio 경로를 투자 성향 분석 페이지로 변경 */}
        <Route path="/portfolio" element={<InvestmentPropensityPage />} /> 
        {/* ✨ 2. 실제 포트폴리오 페이지를 위한 새 경로 추가 */}
        <Route path="/portfolio-main" element={<PortfolioPage />} /> 
        <Route path="/portfolio/recommendations" element={<StockRecommendationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;