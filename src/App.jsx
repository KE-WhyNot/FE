import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import MainPage from './components/MainPage/MainPage'; // Main 페이지 컴포넌트
import SignupPage from './components/SignupPage/SignupPage';
import PaperTrading from './components/PaperTrading/PaperTrading';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/papertrading" element={<PaperTrading />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;