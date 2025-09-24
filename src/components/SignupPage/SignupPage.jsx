import React, { useState } from 'react';
import './SignupPage.css'; // ✨ SignupPage.css를 import 합니다.
import { useNavigate } from 'react-router-dom';

import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // 비밀번호 보이기/숨기기 아이콘

// 이미지 및 로고 import (LoginPage와 동일)
import youthfiLogo from '../../assets/logos/youthfi.png';
import loginDeskImage from '../../assets/images/login_desk.png';

const SignupPage = () => {
  // ✨ 회원가입에 필요한 상태값들
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 비밀번호 확인용

  const navigate = useNavigate();

  // ✨ 비밀번호 보이기/숨기기 토글 함수
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // ✨ 비밀번호 확인 보이기/숨기기 토글 함수
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // ✨ 회원가입 버튼 클릭 시 실행될 함수
  const handleSignup = (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    // 여기에 실제 회원가입 처리 로직 (예: API 호출)을 추가합니다.
    console.log({ id, email, authCode, birthdate, password, confirmPassword });

    // 예시: 회원가입 성공 후 로그인 페이지로 이동
    navigate('/'); // 회원가입 후 로그인 페이지로 이동
  };

  return (
    <div className="signup-page-container"> {/* ✨ 컨테이너 클래스명 변경 */}
      <img src={youthfiLogo} alt="YOUTHFI Logo" className="main-logo" />

      {/* 왼쪽 섹션: 텍스트와 이미지를 모두 포함 */}
      <div className="left-panel">
        <div className="welcome-text">
          <h1>회원가입으로 시작하기</h1> {/* ✨ 문구 변경 */}
          <p>나만의 금융플랜을 세워보세요!</p>
        </div>
        <div className="signup-prompt-left"> {/* ✨ 문구 변경 */}
          <span>이미 계정이 있으신가요?</span>
          <a href="/login">로그인하러 가기</a> {/* ✨ 링크 변경 */}
        </div>
        <img src={loginDeskImage} alt="Desk Illustration" className="desk-illustration" />
      </div>

      {/* 오른쪽 섹션 (회원가입 폼) */}
      <div className="right-panel">
        <div className="signup-form-container"> {/* ✨ 컨테이너 클래스명 변경 */}
          <h2>회원가입</h2> {/* ✨ 제목 변경 */}
          <form onSubmit={handleSignup}>
            {/* 아이디 입력 필드 */}
            <div className="input-group">
              <input
                type="text"
                placeholder="아이디를 입력하세요"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
              {/* 시안에 보이는 아이디 옆의 체크 아이콘을 위한 공간 (기능은 없음) */}
              <span className="input-icon check-icon">✔</span> 
            </div>

            {/* 이메일 입력 필드 */}
            <div className="input-group">
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* 인증번호 입력 필드 */}
            <div className="input-group">
              <input
                type="text"
                placeholder="인증번호를 입력하세요"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
              />
            </div>

            {/* 생년월일 입력 필드 */}
            <div className="input-group">
              <input
                type="text" 
                placeholder="생년월일을 입력하세요 (예시: 1990-01-01)" // ✨ placeholder 문구 변경
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="date-input"
              />
            </div>

            {/* 비밀번호 입력 필드 */}
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>

            {/* 비밀번호 확인 입력 필드 */}
            <div className="input-group">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span className="password-toggle-icon" onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>

            {/* 등록하기 버튼 */}
            <button type="submit" className="signup-button"> {/* ✨ 클래스명 변경 */}
              등록하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;