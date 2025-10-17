import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import youthfiLogo from "../../assets/logos/youthfi.png";
import userAvatar from "../../assets/images/avatar.png";
import { IoMdNotifications } from "react-icons/io";
import useAuthStore from "../../store/useAuthStore";
import useNotificationStore from "../../store/useNotificationStore";

const Header = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isNavHovered, setIsNavHovered] = useState(false);

  const { user, isAuthenticated } = useAuthStore();
  const {
    headerNotifications,
    unreadCount,
    fetchHeaderNotifications,
    fetchUnreadCount,
    markAsRead,
  } = useNotificationStore();

  const navigate = useNavigate();

  // ✅ 스토어에 따라 id/userId 모두 대응
  const uid = user?.id ?? user?.userId ?? null;

  // ✅ 로그인 & uid 준비된 뒤에만 호출
  useEffect(() => {
    if (!isAuthenticated || !uid) return;
    fetchHeaderNotifications(uid);
    fetchUnreadCount(uid);
  }, [isAuthenticated, uid, fetchHeaderNotifications, fetchUnreadCount]);

  const toggleNotificationPanel = () => {
    setIsPanelOpen((v) => !v);
  };

  const handleNotificationClick = async (id) => {
    if (!uid) return;
    await markAsRead(uid, id);
    await fetchHeaderNotifications(uid);
    await fetchUnreadCount(uid);
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

        {/* --- 네비게이션 --- */}
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
                  {headerNotifications.length > 0 ? (
                    headerNotifications.map((n) => (
                      <div
                        key={n.notificationId}
                        className={`notification-item ${
                          n.read ? "read" : "unread"
                        }`}
                        onClick={() =>
                          handleNotificationClick(n.notificationId)
                        }
                      >
                        {n.message}
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
