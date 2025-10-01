import React, { useState } from 'react';
import './SettingPage.css';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/common/Modal'; // ✨ 재사용 Modal 컴포넌트 import

const SettingPage = () => {
  // 알림 설정 State
  const [dividendAlert, setDividendAlert] = useState(true);
  const [tradeAlert, setTradeAlert] = useState(true);
  const [rankingAlert, setRankingAlert] = useState(false);
  
  // ✨ 모달 열림 상태를 관리하는 state
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleSaveSettings = (e) => {
    e.preventDefault();
    alert('알림 설정이 저장되었습니다.');
  };

  // ✨ 로그아웃 '확인' 버튼을 눌렀을 때 실행될 함수
  const confirmLogout = () => {
    localStorage.removeItem('token');
    alert('로그아웃 되었습니다.');
    setIsLogoutModalOpen(false); // 모달 닫기
    navigate('/');
  };

  // ✨ 계정 삭제 '확인' 버튼을 눌렀을 때 실행될 함수
  const confirmDeleteAccount = () => {
    // (API 호출) axios.delete('/api/user/delete');
    localStorage.removeItem('token');
    alert('계정이 삭제되었습니다.');
    setIsDeleteModalOpen(false); // 모달 닫기
    navigate('/');
  };

  return (
    <>
      {/* --- 알림 설정 섹션 --- */}
      <form onSubmit={handleSaveSettings}>
        <h1>알림 설정</h1>
        <div className="setting-list">
          {/* ... (토글 스위치들은 동일) ... */}
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

      {/* --- 계정 설정 섹션 --- */}
      <div className="account-settings">
        <h2>계정 설정</h2>
        <div className="setting-item">
          <span>로그아웃</span>
          {/* ✨ 버튼 클릭 시 alert 대신 모달을 열도록 변경 */}
          <button className="action-button" onClick={() => setIsLogoutModalOpen(true)}>로그아웃</button>
        </div>
        <div className="setting-item">
          <span>계정 삭제</span>
          {/* ✨ 버튼 클릭 시 window.confirm 대신 모달을 열도록 변경 */}
          <button className="action-button delete" onClick={() => setIsDeleteModalOpen(true)}>계정 삭제하기</button>
        </div>
      </div>

      {/* --- ✨ 팝업 모달들 --- */}
      <Modal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)}
        title="로그아웃"
      >
        <div className="confirmation-modal-content">
          <p>정말 로그아웃 하시겠습니까?</p>
          <div className="modal-actions">
            <button className="cancel-button" onClick={() => setIsLogoutModalOpen(false)}>취소</button>
            <button className="confirm-button" onClick={confirmLogout}>확인</button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="계정 삭제"
      >
        <div className="confirmation-modal-content">
          <p>정말로 계정을 삭제하시겠습니까?<br/>이 작업은 되돌릴 수 없습니다.</p>
          <div className="modal-actions">
            <button className="cancel-button" onClick={() => setIsDeleteModalOpen(false)}>취소</button>
            <button className="confirm-button delete" onClick={confirmDeleteAccount}>삭제</button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SettingPage;