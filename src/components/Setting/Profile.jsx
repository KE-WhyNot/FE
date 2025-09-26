import React, { useState } from 'react';
import './Profile.css'; 

const Profile = () => {
  // ✨ 1. '이름'을 수정할 수 있도록 state 추가
  const [name, setName] = useState('홍길동'); 
  // ✨ 2. '생년월일'을 위한 state 이름 변경
  const [birthDate, setBirthDate] = useState(''); 
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    // ✨ 저장할 데이터에 name 추가
    console.log({ name, birthDate, currentPassword, newPassword });
    alert('저장되었습니다.');
  };

  return (
    <>
      <h1>프로필 설정</h1>
      <form onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="name">이름</label>
          {/* ✨ 3. 이름 input을 수정 가능하도록 변경 */}
          <input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="userId">아이디</label>
          <input type="text" id="userId" value="Hongildong123" readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input type="email" id="email" value="hongildong123@gachon.ac.kr" readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="birthDate">생년월일</label>
          {/* ✨ 4. 생년월일 select를 input으로 변경 */}
          <input 
            type="text"
            id="birthDate"
            placeholder="입력하세요 (예시: 1990-01-01)"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>
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
        <div className="form-actions">
          <button type="button" className="cancel-button">취소</button>
          <button type="submit" className="save-button">저장</button>
        </div>
      </form>
    </>
  );
};

export default Profile;