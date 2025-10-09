import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import useAuthStore from "../../store/useAuthStore";

const AuthCallbackKakao = () => {
  const navigate = useNavigate();
  const { fetchProfile } = useAuthStore();
  const hasRunRef = useRef(false); // ✅ StrictMode 방지용 flag

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const handleKakaoCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        alert("카카오 인증 코드가 없습니다.");
        navigate("/");
        return;
      }

      try {
        const decodedCode = decodeURIComponent(code);

        // ✅ 카카오 로그인 API 요청
        const res = await axiosInstance.post("/api/auth/login/kakao", {
          code: decodedCode,
        });

        console.log("카카오 로그인 응답:", res.data);

        const { accessToken, refreshToken, isNewUser, email } =
          res.data.result || {};

        if (accessToken && refreshToken) {
          // ✅ 토큰 저장
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          // ✅ axios 헤더에 반영
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;

          // ✅ 프로필 정보 갱신
          await fetchProfile();

          if (isNewUser) {
            navigate("/signup", {
              state: { email: email || "", verified: true },
            });
          } else {
            alert("카카오 로그인 성공!");
            navigate("/main");
          }
        } else {
          alert("토큰 정보를 불러올 수 없습니다.");
          navigate("/");
        }
      } catch (err) {
        console.error("카카오 로그인 처리 실패:", err.response?.data || err);
        alert(
          `카카오 로그인 실패: ${
            err.response?.data?.message || "서버 에러가 발생했습니다."
          }`
        );
        navigate("/");
      }
    };

    handleKakaoCallback();
  }, [navigate]); // ✅ fetchProfile 제외 (중복 실행 방지)

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>카카오 로그인 처리중...</h2>
      <p>잠시만 기다려주세요.</p>
    </div>
  );
};

export default AuthCallbackKakao;
