import React, { useState } from 'react';
import './DashboardLayout.css';
import Header from '../common/Header';
import Chatbot from '../Chatbot/Chatbot';
import Tutorial from '../PaperTrading/Tutorial'; 
import { dashboardSteps } from '../../tutorials/dashboardSteps'; 
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { BsChatDots } from 'react-icons/bs';

const DashboardLayout = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTutorialActive, setTutorialActive] = useState(false);
  const location = useLocation();

  const startTutorial = () => {
    if (location.pathname === '/papertrading') {
      setTutorialActive(true);
    } else {
      alert('이 페이지에는 튜토리얼이 없습니다.');
    }
  };

  return (
    // ✨ 1. 전체를 Fragment(<>)로 감싸서 레이아웃과 챗봇 버튼을 형제 요소로 만듭니다.
    <>
      <div className="layout-grid">
        <Header />

        <aside className="app-sidebar">
          {/* ✨ 2. 사이드바 하단(footer)은 제거하고 원래 메뉴만 남깁니다. */}
          <div className="sidebar-content">
            <h3 className="sidebar-title">사용자 패널</h3>
            <nav className="sidebar-nav">
              <ul>
                <li><NavLink to="/papertrading">대시보드</NavLink></li>
                <li><NavLink to="/all-stocks">전체종목</NavLink></li>
                <li>
                  <button className="sidebar-button" onClick={startTutorial}>
                    튜토리얼
                  </button>
                </li>
                <li><NavLink to="/quiz">퀴즈</NavLink></li>
              </ul>
            </nav>
          </div>
        </aside>

        <main className="main-content">
          <Outlet />
        </main>
      </div>

      {/* ✨ 3. 챗봇 실행 버튼을 layout-grid 바깥으로 빼서 화면 기준으로 위치를 잡도록 합니다. */}
      <div className="chatbot-fab" onClick={() => setIsChatOpen(true)}>
        <BsChatDots />
      </div>

      {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} />}

      {isTutorialActive && (
        <Tutorial 
          steps={dashboardSteps} 
          onFinish={() => setTutorialActive(false)} 
        />
      )}
    </>
  );
};

export default DashboardLayout;