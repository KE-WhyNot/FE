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
            <h2>마이페이지</h2>
          </div>
          <nav className="setting-nav">
            <ul>
              <li><NavLink to="/setting/profile"><FiUser /> 프로필</NavLink></li>
              <li><NavLink to="/setting/notification"><FiBell /> 알림함</NavLink></li>
              <li><NavLink to="/setting/investment"><FiLock /> 투자</NavLink></li>
              <li><NavLink to="/setting/settings"><FiSettings /> 설정</NavLink></li>
            </ul>
          </nav>
        </aside>
        <main className="setting-main-content">
          <Outlet /> {/* 이 자리에 Profile, Notification 컴포넌트가 표시됩니다. */}
        </main>
      </div>
    </div>
  );
};

export default SettingLayout;