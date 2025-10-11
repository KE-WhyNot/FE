import React, { useEffect, useState } from "react";
import "./Notification.css";
import {
  FaMoneyBillWave,
  FaChartLine,
  FaTrophy,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import useNotificationStore from "../../store/useNotificationStore";
import useAuthStore from "../../store/useAuthStore";

// 아이콘 매핑 함수
const getIconForType = (type) => {
  switch (type) {
    case "dividend":
      return <FaMoneyBillWave />;
    case "trade":
      return <FaChartLine />;
    case "ranking":
      return <FaTrophy />;
    default:
      return null;
  }
};

const Notification = () => {
  const [page, setPage] = useState(0);

  const { user } = useAuthStore();
  const userId = user?.id || 1; // ✅ fallback

  const { notifications, totalPages, loading, fetchNotifications, markAsRead } =
    useNotificationStore();

  // ✅ 페이지 변경 시 자동 새로고침
  useEffect(() => {
    fetchNotifications(userId, page, 10);
  }, [userId, page, fetchNotifications]);

  // ✅ 알림 클릭 시 읽음 처리
  const handleMarkAsRead = async (id) => {
    await markAsRead(userId, id);
  };

  // ✅ 페이지 이동
  const handlePrevPage = () => setPage((p) => Math.max(p - 1, 0));
  const handleNextPage = () => setPage((p) => (p + 1 < totalPages ? p + 1 : p));

  return (
    <>
      <h1>알림</h1>

      {loading ? (
        <p className="loading-text">불러오는 중...</p>
      ) : notifications.length === 0 ? (
        <p className="no-data">표시할 알림이 없습니다.</p>
      ) : (
        <div className="notification-list">
          {notifications.map((n) => (
            <div
              key={n.notificationId}
              className={`notification-item ${n.read ? "read" : "unread"}`}
              onClick={() => handleMarkAsRead(n.notificationId)}
            >
              <div className={`icon-wrapper ${n.type}`}>
                {getIconForType(n.type)}
              </div>
              <div className="notification-content">
                <p>{n.message}</p>
                <small>{n.time || n.createdAt}</small>
              </div>
              {!n.read && <div className="unread-dot"></div>}
            </div>
          ))}
        </div>
      )}

      {/* ✅ 페이지네이션 */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={page === 0}>
            <FaChevronLeft /> 이전
          </button>
          <span>
            {page + 1} / {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={page + 1 >= totalPages}>
            다음 <FaChevronRight />
          </button>
        </div>
      )}
    </>
  );
};

export default Notification;
