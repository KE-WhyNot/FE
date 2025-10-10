import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import useAuthStore from "../../store/useAuthStore";

const AuthCallbackGoogle = () => {
  const navigate = useNavigate();
  const { fetchProfile } = useAuthStore();

  // ✅ 실행 여부 체크용 ref (StrictMode 중복 호출 방지)
  const hasRunRef = useRef(false);

  useEffect(() => {
    // 이미 한 번 실행되었다면 더 이상 실행하지 않음
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const handleGoogleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        alert("Google 인증 코드가 없습니다.");
        navigate("/");
        return;
      }

      try {
        const decodedCode = decodeURIComponent(code);

        // ✅ 백엔드로 code 전송
        const res = await axiosInstance.post("/api/auth/login/google", {
          code: decodedCode,
        });

        console.log("구글 로그인 응답:", res.data);

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

          // ✅ 신규 사용자 여부에 따라 분기
          if (isNewUser) {
            navigate("/signup", {
              state: { email: email || "", verified: true },
            });
          } else {
            console.log("구글 로그인 성공!");
            navigate("/main");
          }
        } else {
          alert("토큰 정보를 불러올 수 없습니다.");
          navigate("/");
        }
      } catch (err) {
        console.error("Google 로그인 처리 실패:", err.response?.data || err);
        alert(
          `Google 로그인 실패: ${
            err.response?.data?.message || "서버 에러가 발생했습니다."
          }`
        );
        navigate("/");
      }
    };

    handleGoogleCallback();
  }, [navigate]); // ✅ fetchProfile 제거 (state 변경에 의해 재실행 방지)

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Google 로그인 처리중...</h2>
      <p>잠시만 기다려주세요.</p>
    </div>
  );
};

export default AuthCallbackGoogle;
