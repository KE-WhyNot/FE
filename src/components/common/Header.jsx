import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import youthfiLogo from '../../assets/logos/youthfi.png';
import userAvatar from '../../assets/images/avatar.png';
import { IoMdNotifications } from 'react-icons/io';

// ✨ 1. 백엔드 연결 전 사용할 임의의 알림 데이터
const mockNotifications = [
  { id: 1, message: '새로운 튜토리얼이 추가되었습니다.', read: false },
  { id: 2, message: 'Nvidia 주식 관련 퀴즈가 업데이트되었습니다.', read: false },
  { id: 3, message: '포트폴리오 수익률이 5%를 달성했습니다!', read: true },
  { id: 4, message: '9월 예적금 정책이 변경되었습니다.', read: false },
];

const Header = () => {
  const [isNavHovered, setIsNavHovered] = useState(false);
  const navigate = useNavigate();

  // ✨ 2. 알림 데이터와 패널 열림 상태를 위한 state 추가
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // ✨ 3. 안 읽은 알림 개수를 계산 (뱃지에 표시용)
  const unreadCount = notifications.filter(n => !n.read).length;

  // ✨ 4. 알림 아이콘 클릭 시 패널 열고 닫는 함수
  const toggleNotificationPanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  // ✨ 5. 특정 알림을 클릭했을 때 '읽음'으로 처리하는 함수
  const handleNotificationClick = (id) => {
    setNotifications(
      notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    // 선택적으로, 알림 클릭 시 관련 페이지로 이동하는 로직도 추가 가능
    // navigate('/some-path');
  };

  return (
    <div className="header-container">
      <header className="app-header">
        <div className="logo-container">
          <img src={youthfiLogo} alt="YOUTHFI Logo" className="header-logo" />
        </div>
        
        <nav
          className={`header-nav ${isNavHovered ? 'is-hovered' : ''}`}
          onMouseEnter={() => setIsNavHovered(true)}
          onMouseLeave={() => setIsNavHovered(false)}
        >
          {/* ... (네비게이션 링크는 동일) ... */}
          <NavLink to="/main">홈</NavLink>
          <NavLink to="/policy">정책</NavLink>
          <NavLink to="/savings">예적금</NavLink>
          <NavLink to="/papertrading">모의투자</NavLink>
          <NavLink to="/portfolio">포트폴리오</NavLink>
          <NavLink to="/mypage">마이페이지</NavLink>
        </nav>
        
        <div className="user-info-container">
          <div className="user-profile-link" onClick={() => navigate('/setting/profile')}>
            <img src={userAvatar} alt="User Avatar" className="user-avatar" />
            <span className="user-name">Honglidong123</span>
          </div>
          
          {/* ✨ 6. 알림 아이콘 영역 수정 */}
          <div className="notification-container">
            <div className="notification-bell" onClick={toggleNotificationPanel}>
              <IoMdNotifications />
              {/* 안 읽은 알림이 있을 때만 뱃지 표시 */}
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </div>

            {/* 패널이 열려있을 때만 알림 목록 표시 */}
            {isPanelOpen && (
              <div className="notification-panel">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      {notification.message}
                    </div>
                  ))
                ) : (
                  <div className="notification-item">새로운 알림이 없습니다.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;