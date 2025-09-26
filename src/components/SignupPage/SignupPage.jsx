import React, { useState, useEffect } from 'react';
import './SignupPage.css';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import youthfiLogo from '../../assets/logos/youthfi.png';
import loginDeskImage from '../../assets/images/login_desk.png';

const SignupPage = () => {
  // --- 입력 값 State ---
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- 유효성 검사 및 절차 진행 상태 State ---
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isAuthCodeSent, setIsAuthCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // --- UI/UX를 위한 State ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // --- 모든 조건이 충족되었는지 실시간으로 감지하여 등록하기 버튼 활성화 ---
  useEffect(() => {
    const birthdateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // 8자 이상, 영문/숫자 조합

    const isIdValid = isIdChecked;
    const isEmailValid = isVerified;
    const isBirthdateValid = birthdateRegex.test(birthdate);
    const isPasswordValid = passwordRegex.test(password) && password === confirmPassword;

    setIsFormValid(isIdValid && isEmailValid && isBirthdateValid && isPasswordValid);
  }, [id, isIdChecked, isVerified, birthdate, password, confirmPassword]);


  // --- 핸들러 함수들 ---
  const handleIdCheck = () => {
    if (!id) {
      alert('아이디를 먼저 입력해주세요.');
      return;
    }
    // (실제 API 호출) axios.get(`/api/users/check-id?id=${id}`);
    alert(`'${id}'는 사용 가능한 아이디입니다.`);
    setIsIdChecked(true);
  };

  const handleRequestAuthCode = () => {
    if (!email) {
      alert('이메일을 먼저 입력해주세요.');
      return;
    }
    // (실제 API 호출) axios.post('/api/auth/send-code', { email });
    alert(`'${email}'로 인증번호가 발송되었습니다.`);
    setIsAuthCodeSent(true);
  };

  const handleVerifyAuthCode = () => {
    if (!authCode) {
      alert('인증번호를 입력해주세요.');
      return;
    }
    // (실제 API 호출) axios.post('/api/auth/verify-code', { email, code: authCode });
    // 여기서는 '123456'을 정답으로 가정합니다.
    if (authCode === '123456') {
      alert('이메일 인증이 완료되었습니다.');
      setIsVerified(true);
    } else {
      alert('인증번호가 올바르지 않습니다.');
    }
  };
  
  const handleSignup = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      alert('입력 정보를 다시 확인해주세요.');
      return;
    }
    console.log({ id, email, birthdate, password });
    alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
    navigate('/');
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
            {/* 아이디 */}
            <div className="input-group with-button">
              <input type="text" placeholder="아이디를 입력하세요" value={id} onChange={(e) => setId(e.target.value)} disabled={isIdChecked}/>
              <button type="button" className="inline-button" onClick={handleIdCheck} disabled={isIdChecked}>
                {isIdChecked ? '확인완료' : '중복 확인'}
              </button>
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
            {/* 등록하기 버튼 */}
            <button type="submit" className="signup-button" disabled={!isFormValid}>
              등록하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;