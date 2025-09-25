import React, { useState } from 'react';
import './Notification.css'; 

const Notification = () => {
  const [dividendAlert, setDividendAlert] = useState(true);
  const [tradeAlert, setTradeAlert] = useState(true);
  const [rankingAlert, setRankingAlert] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    alert('알림 설정이 저장되었습니다.');
  };

  return (
    <>
      <h1>알림 설정</h1>
      <form onSubmit={handleSave}>
        <div className="setting-list">
          <div className="setting-item">
            <span>배당금 지급</span>
            <label className="toggle-switch">
              <input type="checkbox" checked={dividendAlert} onChange={() => setDividendAlert(!dividendAlert)} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <span>매수/매도 체결</span>
            <label className="toggle-switch">
              <input type="checkbox" checked={tradeAlert} onChange={() => setTradeAlert(!tradeAlert)} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <span>모의투자 수익률 랭킹</span>
            <label className="toggle-switch">
              <input type="checkbox" checked={rankingAlert} onChange={() => setRankingAlert(!rankingAlert)} />
              <span className="slider"></span>
            </label>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="cancel-button">취소</button>
          <button type="submit" className="save-button">저장</button>
        </div>
      </form>
    </>
  );
};

export default Notification;