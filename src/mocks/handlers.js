// ✨ 'rest' 대신 'http'와 'HttpResponse'를 import 합니다.
import { http, HttpResponse } from 'msw';

export const handlers = [
  // ✨ 'rest.post'를 'http.post'로 변경합니다.
  http.post('/login', async ({ request }) => {
    // ✨ 핸들러 함수의 인자가 { request } 객체로 변경되었습니다.
    const { id, password } = await request.json();

    if (id === 'test' && password === '123') {
      // ✨ 성공 시: 'HttpResponse.json'을 사용해 응답을 생성합니다.
      return HttpResponse.json(
        {
          success: true,
          message: '로그인 성공!',
          token: 'fake-jwt-token-string',
        },
        {
          status: 200, // status는 두 번째 인자로 전달합니다.
        }
      );
    } else {
      // ✨ 실패 시: 동일하게 HttpResponse.json을 사용합니다.
      return HttpResponse.json(
        {
          success: false,
          message: '아이디 또는 비밀번호가 일치하지 않습니다.',
        },
        {
          status: 401,
        }
      );
    }
  }),
];