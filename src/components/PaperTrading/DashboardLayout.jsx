import React, { useState } from "react";
import "./DashboardLayout.css";
import Header from "../common/Header";
import Chatbot from "../Chatbot/Chatbot";
import { Outlet, NavLink } from "react-router-dom";
import { BsChatDots } from "react-icons/bs";

const DashboardLayout = () => {
  // 챗봇 팝업의 표시 여부를 관리하는 state는 그대로 사용합니다.
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="layout-grid">
      <Header />

      {/* ✨ 사이드바는 원래의 순수한 메뉴 기능으로 되돌립니다. */}
      <aside className="app-sidebar">
        <h3 className="sidebar-title">사용자 패널</h3>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/papertrading">대시보드</NavLink>
            </li>
            <li>
              <NavLink to="/all-stocks">전체종목</NavLink>
            </li>
            <li>
              <NavLink to="/tutorial">튜토리얼</NavLink>
            </li>
            <li>
              <NavLink to="/quiz">퀴즈</NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>

      {/* ✨ 챗봇 실행 버튼과 챗봇 팝업을 레이아웃 최상위에 배치합니다. */}
      <div className="chatbot-fab" onClick={() => setIsChatOpen(true)}>
        <BsChatDots />
      </div>

      {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} />}
    </div>
  );
};

export default DashboardLayout;
