import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import useAuthStore from "../../store/useAuthStore";

const AuthCallbackGoogle = () => {
  const navigate = useNavigate();
  const { fetchProfile } = useAuthStore();

  useEffect(() => {
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

        // ✅ 백엔드 구조가 res.data.result에 들어있기 때문에 이렇게 변경!
        const { accessToken, refreshToken } = res.data.result || {};
        const email = res.data.result?.email || null; // 이메일 있을 경우

        if (accessToken && refreshToken) {
          // ✅ 토큰 저장
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          // ✅ axios 헤더에 즉시 반영 (fetchProfile이 토큰을 필요로 하기 때문)
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;

          // ✅ 유저 프로필 요청 (전역 상태 갱신)
          await fetchProfile();

          // ✅ 신규 회원 여부에 따라 분기
          if (res.data.result?.isNewUser) {
            // 신규 사용자라면 회원가입 페이지로 이동
            navigate("/signup", {
              state: {
                email: email || "",
                verified: true,
              },
            });
          } else {
            alert("구글 로그인 성공!");
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
  }, [navigate, fetchProfile]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Google 로그인 처리중...</h2>
      <p>잠시만 기다려주세요.</p>
    </div>
  );
};

export default AuthCallbackGoogle;
