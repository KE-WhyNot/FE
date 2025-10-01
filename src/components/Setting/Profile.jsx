import React, { useState } from 'react';
import './Profile.css'; 

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({ name: '홍길동', birthDate: '1990-01-01' });
  
  const [name, setName] = useState('홍길동');
  const [birthDate, setBirthDate] = useState('1990-01-01'); 
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleEditClick = () => {
    setOriginalData({ name, birthDate }); 
    setIsEditing(true);
  };
  
  const handleSave = (e) => {
    e.preventDefault();
    console.log({ name, birthDate, currentPassword, newPassword });
    alert('저장되었습니다.');
    setIsEditing(false);
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleCancel = () => {
    setName(originalData.name);
    setBirthDate(originalData.birthDate);
    setIsEditing(false);
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <>
      <h1>{isEditing ? '프로필 수정' : '내 프로필'}</h1>

      <form onSubmit={handleSave}>
        {/* 이름 */}
        <div className="form-group">
          <label htmlFor="name">이름</label>
          {isEditing ? (
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          ) : (
            <p className="view-mode-text">{name}</p>
          )}
        </div>
        
        {/* 아이디 */}
        <div className="form-group">
          <label htmlFor="userId">아이디</label>
          {/* 아이디는 수정 불가하므로 항상 p 태그로 표시 */}
          <p className="view-mode-text disabled">Hongildong123</p>
        </div>

        {/* 이메일 */}
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          {/* 이메일은 수정 불가하므로 항상 p 태그로 표시 */}
          <p className="view-mode-text disabled">hongildong123@gachon.ac.kr</p>
        </div>

        {/* 생년월일 */}
        <div className="form-group">
          <label htmlFor="birthDate">생년월일</label>
          {isEditing ? (
            <input 
              type="text"
              id="birthDate"
              placeholder="입력하세요 (예시: 1990-01-01)"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          ) : (
            <p className="view-mode-text">{birthDate}</p>
          )}
        </div>

        {/* 비밀번호 필드 (수정 모드에서만 보임) */}
        {isEditing && (
          <>
            <div className="form-group">
              <label htmlFor="currentPassword">현재 비밀번호 입력</label>
              <input 
                type="password" 
                id="currentPassword" 
                placeholder="현재 비밀번호를 입력하세요" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">변경할 비밀번호 입력</label>
              <input 
                type="password" 
                id="newPassword" 
                placeholder="변경할 비밀번호를 입력하세요" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
              />
            </div>
          </>
        )}
        
        <div className="form-actions">
          {isEditing ? (
            <>
              <button type="button" className="cancel-button" onClick={handleCancel}>취소</button>
              <button type="submit" className="save-button">저장</button>
            </>
          ) : (
            <button type="button" className="edit-button" onClick={handleEditClick}>
              프로필 수정
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default Profile;