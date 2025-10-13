// src/api/client.js
import axiosInstance from './axiosInstance'; // 1. axiosInstance를 import 합니다.

// REACT_APP_API_BASE_URL은 이제 axiosInstance에서 관리하므로 여기서 직접 사용할 필요가 없습니다.
// const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080').trim();

export async function fetchFinanceProductDetail(finproductId) {
  // 2. finance API의 기본 URL을 직접 지정해줍니다.
  const url = `https://policy.youth-fi.com/api/finproduct/${encodeURIComponent(finproductId)}`;

  console.groupCollapsed('[api] GET', url);
  try {
    // 3. 기존 fetch 대신 axiosInstance.get을 사용합니다.
    //    axiosInstance가 자동으로 Authorization 헤더에 토큰을 포함시켜 줍니다.
    const res = await axiosInstance.get(url, {
      // proxy 설정 대신 전체 URL을 사용하므로 withCredentials는 필요 없을 수 있습니다.
      // baseURL도 policy.youth-fi.com으로 다르기 때문에 전체 URL을 사용합니다.
    }); 
    
    console.log('[api] status', res.status, res.statusText);
    console.log('[api] response data', res.data);
    console.groupEnd();
    
    // axios는 응답 데이터를 res.data에 담아주므로 바로 반환합니다.
    return res.data;
  } catch (e) {
    console.log('[api] error', e);
    console.groupEnd();
    throw e;
  }
}