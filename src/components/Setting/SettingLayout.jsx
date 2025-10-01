import React from 'react';
import './SettingLayout.css'; // 레이아웃 전용 CSS
import Header from '../../components/common/Header';
import { Outlet, NavLink } from 'react-router-dom';
import { FiUser, FiBell, FiLock, FiSettings } from 'react-icons/fi';

const SettingLayout = () => {
  return (
    <div className="setting-page-layout">
      <Header />
      <div className="setting-content-wrapper">
        <aside className="setting-sidebar">
          <div className="sidebar-header">
            <h2>환경설정</h2>
          </div>
          <nav className="setting-nav">
            <ul>
              <li><NavLink to="/setting/profile"><FiUser /> 프로필 설정</NavLink></li>
              <li><NavLink to="/setting/notification"><FiBell /> 알림</NavLink></li>
              {/* ✨ "투자 성향 분석" 링크 제거 */}
              <li><NavLink to="/setting/investment"><FiLock /> 투자</NavLink></li>
              <li><NavLink to="/setting/test"><FiSettings /> 테스트</NavLink></li>
            </ul>
          </nav>
        </aside>
        <main className="setting-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SettingLayout;