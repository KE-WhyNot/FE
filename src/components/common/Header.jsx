import React from 'react';
import './Header.css';
import youthfiLogo from '../../assets/logos/youthfi.png'; // ✨ 로고 이미지 경로
import userAvatar from '../../assets/images/avatar.png'; // ✨ 사용자 아바타 이미지 경로
import { IoMdNotifications } from 'react-icons/io'; // ✨ react-icons에서 알림 아이콘 import

const Header = () => {
  return (
    // ✨ 전체를 감싸는 컨테이너 추가
    <div className="header-container"> 
      <header className="app-header">
        {/* 로고 영역 */}
        <div className="logo-container">
          <img src={youthfiLogo} alt="YOUTHFI Logo" className="header-logo" />
        </div>
        
        {/* 네비게이션 메뉴 */}
        <nav className="header-nav">
          <a href="/main">홈</a>
          <a href="/policy">정책</a>
          <a href="/savings">예적금</a>
          <a href="/trading" className="active">모의투자</a>
          <a href="/portfolio">포트폴리오</a>
          <a href="/mypage">마이페이지</a>
        </nav>
        
        {/* 사용자 정보 및 알림 영역 */}
        <div className="user-info-container">
          <img src={userAvatar} alt="User Avatar" className="user-avatar" />
          <span className="user-name">Honglidong123</span>
          <div className="notification-bell">
            <IoMdNotifications />
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;