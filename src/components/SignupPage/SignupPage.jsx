import React, { useState } from 'react';
import './SignupPage.css';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import youthfiLogo from '../../assets/logos/youthfi.png';
import loginDeskImage from '../../assets/images/login_desk.png';
// import axiosInstance from '../../api/axiosInstance'; // 실제 API 연동 시 주석 해제

const SignupPage = () => {
  // --- 입력 값 State ---
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- 절차 진행 상태 State ---
  const [isAuthCodeSent, setIsAuthCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // --- UI/UX를 위한 State ---
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // --- 핸들러 함수들 ---
  const handleRequestAuthCode = () => {
    // ... (이전과 동일)
    if (!email) {
      alert('이메일을 먼저 입력해주세요.');
      return;
    }
    // (API 호출) axiosInstance.post('/api/auth/send-code', { email });
    alert(`'${email}'로 인증번호가 발송되었습니다.`);
    setIsAuthCodeSent(true);
  };

  const handleVerifyAuthCode = () => {
    // ... (이전과 동일)
    if (!authCode) {
      alert('인증번호를 입력해주세요.');
      return;
    }
    // (API 호출) axiosInstance.post('/api/auth/verify-code', { email, code: authCode });
    if (authCode === '123456') {
      alert('이메일 인증이 완료되었습니다.');
      setIsVerified(true);
      setError('');
    } else {
      alert('인증번호가 올바르지 않습니다.');
    }
  };
  
  // ✨ '등록하기' 버튼 클릭 시 모든 유효성 검사를 여기서 처리
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // --- 1. 프론트엔드 자체 유효성 검사 ---
    if (!id.trim() || !name.trim() || !birthdate.trim()) {
      setError('아이디, 이름, 생년월일을 모두 입력해주세요.');
      return;
    }
    const birthdateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!birthdateRegex.test(birthdate)) {
      setError('생년월일 형식이 올바르지 않습니다. (예: 1990-01-01)');
      return;
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('비밀번호는 영문, 숫자를 포함하여 8자 이상이어야 합니다.');
      return;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // --- 2. 백엔드 API를 통한 유효성 검사 (현재는 주석 처리) ---
    try {
      // (실제 API 호출 예시)
      // const checkResponse = await axiosInstance.post('/api/auth/validate-signup', {
      //   id: id,
      //   email: email, 
      // });

      // // 백엔드에서 중복 또는 유효하지 않다고 응답한 경우
      // if (!checkResponse.data.isSuccess) {
      //   throw new Error(checkResponse.data.message);
      // }

      // --- 모든 검증 통과 후 최종 회원가입 요청 ---
      
      // (실제 API 호출 예시)
      // await axiosInstance.post('/api/auth/signup', {
      //   id, email, name, birthdate, password
      // });
      
      console.log({ id, email, name, birthdate, password });
      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      navigate('/');

    } catch (err) {
      // API 호출 실패 시 에러 메시지 표시
      // setError(err.message);
      console.error(err);
      setError('회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <div className="signup-page-container">
      <img src={youthfiLogo} alt="YOUTHFI Logo" className="main-logo" />
      <div className="left-panel">
        <div className="welcome-text">
          <h1>회원가입으로 시작하기</h1>
          <p>나만의 금융플랜을 세워보세요!</p>
        </div>
        <div className="signup-prompt-left">
          <span>이미 계정이 있으신가요?</span>
          <a href="/">로그인하러 가기</a>
        </div>
        <img src={loginDeskImage} alt="Desk Illustration" className="desk-illustration" />
      </div>
      <div className="right-panel">
        <div className="signup-form-container">
          <h2>회원가입</h2>
          <form onSubmit={handleSignup}>
            {/* ✨ 아이디 (중복확인 버튼 제거) */}
            <div className="input-group">
              <input type="text" placeholder="아이디를 입력하세요" value={id} onChange={(e) => setId(e.target.value)} />
            </div>
            {/* 이메일 */}
            <div className="input-group with-button">
              <input type="email" placeholder="이메일을 입력하세요" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isAuthCodeSent} />
              <button type="button" className="inline-button" onClick={handleRequestAuthCode} disabled={isAuthCodeSent}>
                인증번호 받기
              </button>
            </div>
            {/* 인증번호 */}
            <div className="input-group with-button">
              <input type="text" placeholder="인증번호를 입력하세요" value={authCode} onChange={(e) => setAuthCode(e.target.value)} disabled={!isAuthCodeSent || isVerified} />
              <button type="button" className="inline-button" onClick={handleVerifyAuthCode} disabled={!isAuthCodeSent || isVerified}>
                {isVerified ? '인증완료' : '인증번호 확인'}
              </button>
            </div>
            {/* 생년월일 */}
            <div className="input-group">
              <input type="text" placeholder="생년월일을 입력하세요 (예시: 1990-01-01)" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
            </div>
            {/* 이름 */}
            <div className="input-group">
              <input type="text" placeholder="이름을 입력하세요" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            {/* 비밀번호 */}
            <div className="input-group">
              <input type={showPassword ? 'text' : 'password'} placeholder="비밀번호 (영문, 숫자 포함 8자 이상)" value={password} onChange={(e) => setPassword(e.target.value)} />
              <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}</span>
            </div>
            {/* 비밀번호 확인 */}
            <div className="input-group">
              <input type={showConfirmPassword ? 'text' : 'password'} placeholder="비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <span className="password-toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}</span>
            </div>
            
            {error && <p className="error-message">{error}</p>}

            {/* 등록하기 버튼: isVerified가 true일 때만 활성화 */}
            <button type="submit" className="signup-button" disabled={!isVerified}>
              등록하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;