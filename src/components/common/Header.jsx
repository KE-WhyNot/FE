import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import youthfiLogo from "../../assets/logos/youthfi.png";
import userAvatar from "../../assets/images/avatar.png";
import { IoMdNotifications } from "react-icons/io";
import axiosInstance from "../../api/axiosInstance";

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
  const [userProfile, setUserProfile] = useState({}); // ✅ null → {} 로 변경
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

  // ✅ 프로필 정보 가져오기
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axiosInstance.get("/api/auth/profile");
        console.log("📄 받은 프로필 데이터:", res.data);
        setUserProfile(res.data.result);
      } catch (err) {
        console.error("프로필 조회 실패:", err);
        setUserProfile({ userId: "게스트" });
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="header-container">
      <header className="app-header">
        <div className="logo-container">
          <img src={youthfiLogo} alt="YOUTHFI Logo" className="header-logo" />
        </div>

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

        <div className="user-info-container">
          <div
            className="user-profile-link"
            onClick={() => navigate("/setting/profile")}
          >
            <img src={userAvatar} alt="User Avatar" className="user-avatar" />
            {/* ✅ 이름이 있을 때만 span 렌더링 */}
            {userProfile?.name || userProfile?.userId ? (
              <span className="user-name">
                {userProfile.name || userProfile.userId}
              </span>
            ) : null}
          </div>

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
