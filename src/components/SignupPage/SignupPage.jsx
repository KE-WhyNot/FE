import React, { useState, useEffect } from "react";
import Calendar from "react-calendar"; // ✅ 달력 라이브러리 추가
import "react-calendar/dist/Calendar.css"; // ✅ 기본 스타일 불러오기
import { useLocation, useNavigate } from "react-router-dom";
import "./SignupPage.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import youthfiLogo from "../../assets/logos/youthfi.png";
import loginDeskImage from "../../assets/images/login_desk.png";
import axiosInstance from "../../api/authAxiosInstance";

const SignupPage = () => {
  // --- 상태 ---
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAuthCodeSent, setIsAuthCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false); // ✅ 캘린더 표시 상태 추가
  const navigate = useNavigate();
  const location = useLocation();

  // --- 구글 로그인에서 넘어온 이메일 자동 반영 ---
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      setIsVerified(location.state.verified || false);
      setIsAuthCodeSent(location.state.verified || false);
    }
  }, [location.state]);

  // --- 이메일 인증 요청 ---
  const handleRequestAuthCode = async () => {
    if (!email) {
      alert("이메일을 먼저 입력해주세요.");
      return;
    }
    try {
      await axiosInstance.post("/api/email/verification/send", { email });
      alert(`'${email}'로 인증번호가 발송되었습니다.`);
      setIsAuthCodeSent(true);
    } catch (err) {
      console.error("인증번호 발송 실패:", err);
      alert(err.response?.data?.message || "인증번호 발송에 실패했습니다.");
    }
  };

  // --- 이메일 인증 확인 ---
  const handleVerifyAuthCode = async () => {
    if (!authCode) {
      alert("인증번호를 입력해주세요.");
      return;
    }
    try {
      await axiosInstance.post("/api/email/verification/verify", {
        email: email,
        verificationCode: authCode,
      });
      alert("이메일 인증이 완료되었습니다.");
      setIsVerified(true);
      setError("");
    } catch (err) {
      console.error("인증번호 검증 실패:", err);
      alert(err.response?.data?.message || "인증번호가 올바르지 않습니다.");
    }
  };

  // ✅ 캘린더 날짜 선택 핸들러
  const handleDateChange = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formatted = `${year}-${month}-${day}`; // YYYY-MM-DD 형식
    setBirthdate(formatted);
    setShowCalendar(false); // 날짜 선택 후 캘린더 닫기
  };


  // --- 회원가입 처리 ---
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!id.trim() || !name.trim() || !birthdate.trim()) {
      setError("아이디, 이름, 생년월일을 모두 입력해주세요.");
      return;
    }
    const birthdateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!birthdateRegex.test(birthdate)) {
      setError("생년월일 형식이 올바르지 않습니다. (예: 1990-01-01)");
      return;
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("비밀번호는 영문, 숫자를 포함하여 8자 이상이어야 합니다.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!isVerified) {
      setError("이메일 인증을 완료해주세요.");
      return;
    }

    try {
      await axiosInstance.post("/api/auth/signup", {
        email: email,
        userId: id,
        password: password,
        name: name,
        birth: birthdate,
      });

      alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      navigate("/");
    } catch (err) {
      console.error("회원가입 실패:", err);
      setError(
        err.response?.data?.message || "회원가입 중 오류가 발생했습니다."
      );
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
        <img
          src={loginDeskImage}
          alt="Desk Illustration"
          className="desk-illustration"
        />
      </div>

      <div className="right-panel">
        <div className="signup-form-container">
          <h2>회원가입</h2>
          <form onSubmit={handleSignup}>
            {/* 아이디 */}
            <div className="input-group">
              <input
                type="text"
                placeholder="아이디를 입력하세요"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>

            {/* 이메일 */}
            <div className="input-group with-button">
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                disabled={isVerified}
                onChange={(e) => setEmail(e.target.value)}
              />
              {!isVerified && (
                <button
                  type="button"
                  className="inline-button"
                  onClick={handleRequestAuthCode}
                  disabled={isAuthCodeSent}
                >
                  인증번호 받기
                </button>
              )}
            </div>

            {/* 인증번호 입력 */}
            {!isVerified && (
              <div className="input-group with-button">
                <input
                  type="text"
                  placeholder="인증번호를 입력하세요"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  disabled={!isAuthCodeSent}
                />
                <button
                  type="button"
                  className="inline-button"
                  onClick={handleVerifyAuthCode}
                  disabled={!isAuthCodeSent}
                >
                  인증번호 확인
                </button>
              </div>
            )}

            {/* ✅ 생년월일 (캘린더) */}
            <div className="input-group" style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="생년월일을 선택하세요"
                value={birthdate}
                readOnly
                onClick={() => setShowCalendar(!showCalendar)} // 클릭 시 달력 표시
              />
              {showCalendar && (
                <div
                  style={{
                    position: "absolute",
                    top: "45px",
                    zIndex: 10,
                    backgroundColor: "white",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
                    borderRadius: "8px",
                  }}
                >
                  <Calendar
                    onChange={handleDateChange}
                    value={birthdate ? new Date(birthdate) : new Date()}
                    maxDate={new Date()} // 미래 선택 불가
                  />
                </div>
              )}
            </div>

            {/* 이름 */}
            <div className="input-group">
              <input
                type="text"
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* 비밀번호 */}
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호 (영문, 숫자 포함 8자 이상)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>

            {/* 비밀번호 확인 */}
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )}
              </span>
            </div>

            {/* 에러 메시지 */}
            {error && <p className="error-message">{error}</p>}

            {/* 등록 버튼 */}
            <button
              type="submit"
              className="signup-button"
              disabled={!isVerified}
            >
              등록하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
