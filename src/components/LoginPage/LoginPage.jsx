import React, { useState } from 'react';
import './LoginPage.css';
// ✨ 1. react-router-dom에서 useNavigate를 가져옵니다.
import { useNavigate } from 'react-router-dom';

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

  // ✨ 2. useNavigate 훅을 초기화합니다.
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // ✨ 3. 폼 제출(로그인 버튼 클릭) 시 실행될 함수를 만듭니다.
  const handleLogin = (e) => {
    e.preventDefault(); // 폼 제출 시 페이지가 새로고침되는 것을 방지합니다.
    // 여기에 실제 로그인 처리 로직을 추가할 수 있습니다 (예: API 호출).
    
    // 로그인 성공 후 /main 경로로 이동시킵니다.
    navigate('/main');
  };


  return (
    <div className="login-page-container">
      <img src={youthfiLogo} alt="YOUTHFI Logo" className="main-logo" />
      <div className="left-panel">
        <div className="welcome-text">
          <h1>로그인하여 시작하기</h1>
          <p>나만의 금융플랜을 세워보세요!</p>
        </div>
        <div className="signup-prompt-left">
          <span>계정이 없으신가요?</span>
          <a href="/signup">회원가입 하러 가기</a>
        </div>
        <img src={loginDeskImage} alt="Desk Illustration" className="desk-illustration" />
      </div>

      <div className="right-panel">
        <div className="login-form-container">
          <h2>로그인 하기</h2>
          {/* ✨ 4. form 태그에 onSubmit 이벤트를 연결합니다. */}
          <form onSubmit={handleLogin}>
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