import React, { useState } from 'react';
import './LoginPage.css';

import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

// 이미지 및 로고 import
import youthfiLogo from '../../assets/logos/youthfi.png';
import loginDeskImage from '../../assets/images/login_desk.png';
import googleLogo from '../../assets/logos/google.png';
import naverLogo from '../../assets/logos/naver.png';
import kakaoLogo from '../../assets/logos/kakao.png';

const LoginPage = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page-container">
      {/* ✨ 로고를 페이지 컨테이너 바로 아래로 이동 (CSS로 절대 위치 지정) */}
      <img src={youthfiLogo} alt="YOUTHFI Logo" className="main-logo" />

      {/* 왼쪽 섹션: 텍스트와 이미지를 모두 포함 */}
      <div className="left-panel">
        <div className="welcome-text">
          <h1>로그인하여 시작하기</h1>
          <p>나만의 금융플랜을 세워보세요!</p>
        </div>
        <div className="signup-prompt-left">
          <span>계정이 없으신가요?</span>
          <a href="/signup">회원가입 하러 가기</a>
        </div>
        {/* 이미지는 여전히 left-panel 안에 위치 */}
        <img src={loginDeskImage} alt="Desk Illustration" className="desk-illustration" />
      </div>

      {/* 오른쪽 섹션 (로그인 폼) */}
      <div className="right-panel">
        <div className="login-form-container">
          <h2>로그인 하기</h2>
          <form>
            <div className="input-group">
              <input
                type="text"
                placeholder="아이디를 입력해주세요"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력해주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            <a href="/forgot-password" className="forgot-password-link">
              비밀번호를 잊으셨나요?
            </a>
            <button type="submit" className="login-button">
              로그인 하기
            </button>
          </form>

          <div className="signup-prompt-right">
            <a href="/signup">회원가입 하러 가기</a>
          </div>

          <div className="divider">
            <span>또는</span>
          </div>
          <div className="social-login-buttons">
            <button className="social-button">
              <img src={naverLogo} alt="Naver Login" />
            </button>
            <button className="social-button">
              <img src={googleLogo} alt="Google Login" />
            </button>
            <button className="social-button">
              <img src={kakaoLogo} alt="Kakao Login" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;