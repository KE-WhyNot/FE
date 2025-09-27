import React, { useState } from 'react';
import './DashboardLayout.css';
import Header from '../common/Header';
import Chatbot from '../Chatbot/Chatbot';
import { Outlet, NavLink } from 'react-router-dom';
import { BsChatDots } from 'react-icons/bs'; // ✨ 챗봇 아이콘 import

const DashboardLayout = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="layout-grid">
      <Header />

      <aside className="app-sidebar">
        {/* ✨ isChatOpen 상태에 따라 사이드바 내용물을 교체합니다. */}
        {isChatOpen ? (
          // --- 챗봇이 열렸을 때 ---
          <Chatbot onClose={() => setIsChatOpen(false)} />
        ) : (
          // --- 기본 상태 (네비게이션 메뉴) ---
          <>
            <div className="sidebar-content">
              <h3 className="sidebar-title">사용자 패널</h3>
              <nav className="sidebar-nav">
                <ul>
                  <li><NavLink to="/papertrading">대시보드</NavLink></li>
                  <li><NavLink to="/all-stocks">전체종목</NavLink></li>
                  <li><NavLink to="/tutorial">튜토리얼</NavLink></li>
                  <li><NavLink to="/quiz">퀴즈</NavLink></li>
                </ul>
              </nav>
            </div>
            
            {/* ✨ 사이드바 하단에 위치할 챗봇 실행 버튼 */}
            <div className="sidebar-footer">
              <button className="chatbot-trigger" onClick={() => setIsChatOpen(true)}>
                <BsChatDots />
                <span>유스파이 챗봇</span>
              </button>
            </div>
          </>
        )}
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;