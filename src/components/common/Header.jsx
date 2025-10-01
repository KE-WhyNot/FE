import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import youthfiLogo from '../../assets/logos/youthfi.png';
import userAvatar from '../../assets/images/avatar.png';
import { IoMdNotifications } from 'react-icons/io';

const mockNotifications = [
  { id: 1, message: '새로운 튜토리얼이 추가되었습니다.', read: false },
  { id: 2, message: 'Nvidia 주식 관련 퀴즈가 업데이트되었습니다.', read: false },
  { id: 3, message: '포트폴리오 수익률이 5%를 달성했습니다!', read: true },
  { id: 4, message: '9월 예적금 정책이 변경되었습니다.', read: false },
];

const Header = () => {
  const [isNavHovered, setIsNavHovered] = useState(false);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotificationPanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleNotificationClick = (id) => {
    setNotifications(
      notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // ✨ '전체 알림 보기' 버튼 클릭 핸들러
  const handleViewAllNotifications = () => {
    navigate('/setting/notification'); // 알림함 페이지로 이동
    setIsPanelOpen(false); // 패널 닫기
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
          <NavLink to="/main">홈</NavLink>
          <NavLink to="/policy">정책</NavLink>
          <NavLink to="/savings">예적금</NavLink>
          <NavLink to="/papertrading">모의투자</NavLink>
          <NavLink to="/portfolio">포트폴리오</NavLink>
          <NavLink to="/setting/profile">마이페이지</NavLink>
        </nav>
        
        <div className="user-info-container">
          <div className="user-profile-link" onClick={() => navigate('/setting/profile')}>
            <img src={userAvatar} alt="User Avatar" className="user-avatar" />
            <span className="user-name">Honglidong123</span>
          </div>
          
          <div className="notification-container">
            <div className="notification-bell" onClick={toggleNotificationPanel}>
              <IoMdNotifications />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </div>

            {isPanelOpen && (
              <div className="notification-panel">
                {/* ✨ 알림 목록을 감싸는 div 추가 */}
                <div className="notification-list-popup">
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
                {/* ✨ '전체 알림 보기' 버튼을 위한 footer 추가 */}
                <div className="notification-footer">
                  <button onClick={handleViewAllNotifications} className="view-all-btn">
                    전체 알림 보기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
