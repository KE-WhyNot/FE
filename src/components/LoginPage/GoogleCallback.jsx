import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance'; // 1번에서 만든 인스턴스 import

const GoogleCallback = () => {
  // ✨ 1. 로딩 및 결과 메시지를 관리하기 위한 state
  const [message, setMessage] = useState('로그인 처리 중입니다. 잠시만 기다려주세요...');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // ✨ 2. API 요청 및 처리를 위한 async 함수를 useEffect 내부에 정의
    const handleAuth = async (code) => {
      try {
        // API 명세에 따라 POST 요청을 보냅니다.
        const response = await axiosInstance.post('/api/auth/login/google', {
          code: code,
        });

        // API 요청 성공 시
        const { data } = response;
        if (data.isNewUser) {
          // 신규 유저이면 추가 정보 입력 페이지로 이동
          setMessage('추가 정보 입력 페이지로 이동합니다.');
          navigate('/signup/social', { state: { socialProfile: data.socialProfile } });
        } else {
          // 기존 유저이면 토큰 저장 후 메인 페이지로 이동
          localStorage.setItem('token', data.accessToken);
          setMessage('로그인 성공! 메인 페이지로 이동합니다.');
          navigate('/papertrading');
        }
      } catch (error) {
        // API 요청 실패 시
        console.error("소셜 로그인 에러:", error);
        setMessage('로그인에 실패했습니다. 잠시 후 로그인 페이지로 돌아갑니다.');
        setTimeout(() => navigate('/'), 3000); // 3초 후 로그인 페이지로 이동
      }
    };

    // 3. URL에서 'code' 파라미터를 추출합니다.
    const code = searchParams.get('code');

    if (code) {
      // 4. 추출한 코드로 핸들러 함수를 호출합니다.
      handleAuth(code);
    } else {
      setMessage('잘못된 접근입니다. 로그인 페이지로 돌아갑니다.');
      setTimeout(() => navigate('/'), 3000);
    }
  }, [searchParams, navigate]); // useEffect 종속성 배열

  // API 처리 상태에 따라 사용자에게 메시지를 보여줍니다.
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h2>{message}</h2>
    </div>
  );
};

export default GoogleCallback;