import React, { useState } from 'react';
import './Notification.css';
// 아이콘 import
import { FaMoneyBillWave, FaChartLine, FaTrophy } from 'react-icons/fa';

// 임의의 알림 데이터
const mockNotifications = [
  { id: 1, type: 'trade', message: 'SK하이닉스 2주 매수가 체결되었습니다.', time: '2시간 전', read: false },
  { id: 2, type: 'dividend', message: '코카콜라(KO)에서 배당금이 지급되었습니다.', time: '1일 전', read: false },
  { id: 3, type: 'ranking', message: '모의투자 랭킹이 상위 10%에 진입했습니다!', time: '3일 전', read: true },
  { id: 4, type: 'trade', message: '삼성전자 1주 매도가 체결되었습니다.', time: '5일 전', read: true },
];

// 알림 타입에 따라 아이콘을 반환하는 함수
const getIconForType = (type) => {
  switch (type) {
    case 'dividend': return <FaMoneyBillWave />;
    case 'trade': return <FaChartLine />;
    case 'ranking': return <FaTrophy />;
    default: return null;
  }
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  // 알림 클릭 시 '읽음'으로 처리하는 함수
  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <>
      <h1>알림</h1>
      <div className="notification-list">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            onClick={() => handleMarkAsRead(notification.id)}
          >
            <div className={`icon-wrapper ${notification.type}`}>
              {getIconForType(notification.type)}
            </div>
            <div className="notification-content">
              <p>{notification.message}</p>
              <small>{notification.time}</small>
            </div>
            {!notification.read && <div className="unread-dot"></div>}
          </div>
        ))}
      </div>
    </>
  );
};

export default NotificationsPage;