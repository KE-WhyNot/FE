import { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// --- ⬇️ 1. axios 대신 axiosInstance를 import 합니다. ⬇️ ---
import axiosInstance from "../../api/axiosInstance";

// 이미지 및 로고 import
import youthfiLogo from "../../assets/logos/youthfi.png";
import loginDeskImage from "../../assets/images/login_desk.png";
import googleLogo from "../../assets/logos/google.png";
import naverLogo from "../../assets/logos/naver.png";
import kakaoLogo from "../../assets/logos/kakao.png";

const LoginPage = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // --- ⬇️ 2. axios.post를 axiosInstance.post로 변경하고, URL을 수정합니다. ⬇️ ---
      const response = await axiosInstance.post("/api/auth/login", {
        id: id,
        password: password,
      });

      if (response.data.success) {
        console.log("로그인 성공:", response.data);
        localStorage.setItem("token", response.data.token);
        navigate("/main");
      }
    } catch (err) {
      console.error("로그인 실패:", err.response.data);
      setError(err.response.data.message);
    }
  };

  // --- ✨ 소셜 로그인 관련 코드 ---

  const GOOGLE_AUTH_URL =
    "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=618174215491-u3rdo188811ifrti3uvrs0f2an5fdoam.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback%2Fgoogle&scope=openid%20profile%20email&state=test123";
  const NAVER_AUTH_URL =
    "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=F2t5MnE8W6DBr7PfaG94&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback%2Fnaver&scope=name%20email%20profile_image&state=xyz123";
  const KAKAO_AUTH_URL =
    "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=78e3b0999e39cf40232bdd8c78edd504&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback%2Fkakao&scope=account_email%20profile_nickname%20profile_image&state=xyz123";

  const handleSocialLogin = (provider) => {
    let url;
    switch (provider) {
      case "google":
        url = GOOGLE_AUTH_URL;
        break;
      case "naver":
        url = NAVER_AUTH_URL;
        break;
      case "kakao":
        url = KAKAO_AUTH_URL;
        break;
      default:
        return;
    }
    window.location.href = url;
  };

  // ------------------------------------

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
        <img
          src={loginDeskImage}
          alt="Desk Illustration"
          className="desk-illustration"
        />
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
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력해주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="password-toggle-icon"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            <button type="submit" className="login-button">
              로그인 하기
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>

          <div className="signup-prompt-right">
            <a href="/signup">회원가입 하러 가기</a>
          </div>

          <div className="divider">
            <span>또는</span>
          </div>

          <div className="social-login-buttons">
            <button
              className="social-button"
              onClick={() => handleSocialLogin("naver")}
            >
              <img src={naverLogo} alt="Naver Login" />
            </button>
            <button
              className="social-button"
              onClick={() => handleSocialLogin("google")}
            >
              <img src={googleLogo} alt="Google Login" />
            </button>
            <button
              className="social-button"
              onClick={() => handleSocialLogin("kakao")}
            >
              <img src={kakaoLogo} alt="Kakao Login" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
