# YouthFi Frontend

## 1. 프로젝트 개요

- **프로젝트명:** YouthFi (청년 금융 서비스)
- **담당 파트:** 프론트엔드 개발
- **개발 기간:** 2025.09 ~ 2025.10
- **주요 역할:**
  - 전체 UI 화면 구현 및 반응형 디자인 적용
  - API 연동 및 상태 관리 구조 설계
  - 데이터 시각화 구현
  - 협업 툴(Figma, Cursor MCP) 활용을 통한 개발 효율화

---

## 2. 협업 및 설계 도구

- **Figma:**
  - 디자인 시안 공유 및 컴포넌트 가이드라인 확인
  - 반응형 UI 비율, 색상, 간격 기준 참고
- **Cursor MCP:**
  - 초기 코드 구조 생성 및 컴포넌트 자동 제안 활용
  - 반복적인 코드 패턴 생성 효율화

---

## 3. 폴더 구조

```
src/
 ┣ api/                      # Axios 인스턴스 및 API 통신 로직
 ┣ assets/                   # 이미지, 로고 등 정적 리소스
 ┣ components/               # 주요 화면 구성 컴포넌트
 ┃ ┣ Chatbot/                # 대화형 챗봇 UI
 ┃ ┣ common/                 # Header, Footer 등 공용 UI 컴포넌트
 ┃ ┣ InvestmentPropensityPage/
 ┃ ┣ LoginPage/
 ┃ ┣ MainPage/
 ┃ ┣ PaperTrading/
 ┃ ┣ PolicyPage / PolicyDetailPage/
 ┃ ┣ PortfolioPage/
 ┃ ┣ SavingsPage / SavingsDetailPage/
 ┃ ┣ Setting/
 ┃ ┣ SignupPage/
 ┃ ┗ StockRecommendationPage/
 ┣ hooks/                    # 커스텀 훅 (상태/로직 재사용)
 ┣ mocks/                    # MSW(Mock Service Worker) 기반 테스트용 API Mock
 ┣ store/                    # Zustand 상태 관리 스토어
 ┣ tutorials/                # 개발 참고용 예시 코드
 ┣ utils/                    # 포맷팅, 계산 등 유틸 함수
 ┣ App.jsx / index.js        # 진입점 및 전역 라우팅
 ┗ setupProxy.js             # API 프록시 설정
```

---

## 4. 주요 기술 스택

| 분류                      | 기술                     | 설명                             |
| ------------------------- | ------------------------ | -------------------------------- |
| **Frontend Framework**    | React 18                 | 컴포넌트 기반 SPA 개발           |
| **Routing**               | React Router v7          | 페이지 간 라우팅 처리            |
| **State Management**      | Zustand, React Query     | 전역 상태 관리 및 서버 상태 캐싱 |
| **HTTP 통신**             | Axios                    | API 요청 및 interceptor 관리     |
| **Mocking/Test**          | MSW, Testing Library     | Mock 서버 및 단위 테스트         |
| **Chart / Visualization** | ECharts, Nivo, D3.js     | 금융 데이터 시각화               |
| **UI / Icons**            | React Icons, CSS Modules | 스타일 구성 및 아이콘 사용       |
| **Calendar**              | react-calendar           | 날짜 선택 기능 구현              |
| **Proxy Middleware**      | http-proxy-middleware    | 개발 환경에서 API 프록시 설정    |

---

## 5. 상태 관리 구조

- **Zustand:**  
  사용자 로그인, 알림, 유저 정보 등 클라이언트 전역 상태 관리
- **React Query:**  
  서버 요청 결과 캐싱 및 비동기 데이터 관리

---

## 6. API 구조

`src/api/` 내부에서 Axios 인스턴스를 도메인별로 분리하여 관리

- `authAxiosInstance.js` – 인증 및 로그인 관련
- `financeAxiosInstance.js` – 금융 및 투자 데이터
- `notifyAxiosInstance.js` – 알림 관련
- `policyAxiosInstance.js`, `policyApi.js` – 정책 관련 API

---

## 7. 주요 페이지 구성

| 페이지                          | 기능 요약                           |
| ------------------------------- | ----------------------------------- |
| MainPage                        | 대시보드 요약, 추천 섹션 표시       |
| LoginPage / SignupPage          | 사용자 로그인 및 회원가입           |
| PolicyPage / PolicyDetailPage   | 청년 정책 목록 및 상세 정보         |
| InvestmentPropensityPage        | 투자 성향 분석 및 결과 표시         |
| PortfolioPage                   | 개인 포트폴리오 관리 및 수익률 계산 |
| StockRecommendationPage         | AI 기반 종목 추천                   |
| SavingsPage / SavingsDetailPage | 예적금 상품 비교 및 상세 조회       |
| Setting                         | 사용자 설정 페이지                  |
| Chatbot                         | 금융/정책 관련 대화형 기능 제공     |

---

## 8. 데이터 시각화

- **ECharts / Nivo / D3.js** 활용
  - 포트폴리오 수익률, 투자 성향 분석, 주식 변동 차트 등 구현
  - 반응형 차트 및 커스터마이징 지원

---

## 9. 개발 및 배포

- **개발 환경:** React Scripts 기반 (CRA)
- **테스트:** Testing Library + Jest
- **Mock 서버:** MSW (public 디렉터리 내 worker 설정)
- **배포 환경:** Vercel (vercel.json 기반 자동 배포)

---

## 10. 프로젝트 특징 요약

- 초기 설계 단계에서 **Figma + Cursor MCP**를 활용하여 UI 구조 및 코드 패턴 신속 정립
- **Axios 인스턴스 분리**를 통한 API 모듈화 관리
- **React Query + Zustand**로 서버/클라이언트 상태 통합 관리
- **ECharts/Nivo** 기반의 시각화 구현으로 직관적인 사용자 경험 제공
- **MSW Mock 서버**로 백엔드 의존도를 줄인 개발 환경 구성
