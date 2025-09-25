import React, { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import axios from 'axios';

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
  // ✨ 2. 에러 메시지를 저장할 state를 추가합니다.
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // 함수 시작 시 에러 메시지 초기화

    try {
      // axios를 사용해 '/login' API에 POST 요청을 보냅니다.
      const response = await axios.post('/login', {
        id: id,
        password: password,
      });

      // MSW 핸들러에서 보낸 성공 응답을 받으면
      if (response.data.success) {
        console.log('로그인 성공:', response.data);
        // 예: 받은 토큰을 localStorage에 저장
        localStorage.setItem('token', response.data.token);
        // /main 경로로 이동
        navigate('/main');
      }
    } catch (err) {
      // MSW 핸들러에서 보낸 에러 응답을 받으면
      console.error('로그인 실패:', err.response.data);
      setError(err.response.data.message); // 에러 state에 메시지 저장
    }
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
            {/* ✨ 4. 에러 메시지를 화면에 표시합니다. */}
            {error && <p className="error-message">{error}</p>}
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