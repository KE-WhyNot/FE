import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import youthfiLogo from "../../assets/logos/youthfi.png";
import userAvatar from "../../assets/images/avatar.png";
import { IoMdNotifications } from "react-icons/io";
import useAuthStore from "../../store/useAuthStore"; // ✅ Zustand 스토어 import

const mockNotifications = [
  { id: 1, message: "새로운 튜토리얼이 추가되었습니다.", read: false },
  {
    id: 2,
    message: "Nvidia 주식 관련 퀴즈가 업데이트되었습니다.",
    read: false,
  },
  { id: 3, message: "포트폴리오 수익률이 5%를 달성했습니다!", read: true },
  { id: 4, message: "9월 예적금 정책이 변경되었습니다.", read: false },
];

const Header = () => {
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // ✅ Zustand에서 전역 로그인 정보 가져오기
  const { user, isAuthenticated } = useAuthStore();

  const navigate = useNavigate();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleNotificationPanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleNotificationClick = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleViewAllNotifications = () => {
    navigate("/setting/notification");
    setIsPanelOpen(false);
  };

  return (
    <div className="header-container">
      <header className="app-header">
        {/* --- 로고 --- */}
        <div className="logo-container">
          <img src={youthfiLogo} alt="YOUTHFI Logo" className="header-logo" />
        </div>

        {/* --- 네비게이션 메뉴 --- */}
        <nav
          className={`header-nav ${isNavHovered ? "is-hovered" : ""}`}
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

        {/* --- 사용자 정보 + 알림 --- */}
        <div className="user-info-container">
          <div
            className="user-profile-link"
            onClick={() => navigate("/setting/profile")}
          >
            <img src={userAvatar} alt="User Avatar" className="user-avatar" />

            {/* ✅ Zustand 상태에서 바로 이름 표시 */}
            {isAuthenticated && (user?.name || user?.userId) ? (
              <span className="user-name">{user.name || user.userId}</span>
            ) : (
              <span className="user-name">로그인 필요</span>
            )}
          </div>

          {/* --- 알림 아이콘 --- */}
          <div className="notification-container">
            <div
              className="notification-bell"
              onClick={toggleNotificationPanel}
            >
              <IoMdNotifications />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </div>

            {/* --- 알림 패널 --- */}
            {isPanelOpen && (
              <div className="notification-panel">
                <div className="notification-list-popup">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${
                          notification.read ? "read" : "unread"
                        }`}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        {notification.message}
                      </div>
                    ))
                  ) : (
                    <div className="notification-item">
                      새로운 알림이 없습니다.
                    </div>
                  )}
                </div>

                <div className="notification-footer">
                  <button
                    onClick={handleViewAllNotifications}
                    className="view-all-btn"
                  >
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
