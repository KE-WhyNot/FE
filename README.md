# 💹 Youth-Fi Frontend

> **청년 금융 통합 서비스 플랫폼**  
> 투자 모의 체험부터 정책 추천, 예·적금 비교, 알림 서비스까지 —  
> 실제 금융 흐름을 학습하고 실전 대비 역량을 높이는 웹 애플리케이션입니다.

---

## 🚀 프로젝트 개요

**Youth-Fi**는 청년층을 위한 금융 교육 및 실습용 플랫폼입니다.  
다양한 기능을 통해 **실제 투자 및 금융 환경을 체험**할 수 있도록 설계되었습니다.

### 🎯 주요 목적
- 📈 **모의투자(Paper Trading)** — 실제 주식 시장 데이터 기반의 투자 연습  
- 👥 **회원 관리(Auth)** — 로그인, 회원가입, JWT 기반 인증  
- 🏛️ **청년정책(Policy)** — 연령·소득·지역 맞춤형 정책 추천  
- 💰 **예적금 비교(Savings)** — 다양한 금융 상품 비교  
- 🔔 **알림(Notification)** — 가격 변동, 정책 업데이트, 포인트 적립 등 알림 기능 제공  

---

## 🧱 기술 스택

| 구분 | 기술 | 설명 |
|------|------|------|
| **Frontend Framework** | [React 18](https://react.dev/) | UI 구축 |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) | 경량 상태관리 |
| **Routing** | [React Router DOM 7](https://reactrouter.com/en/main) | SPA 라우팅 |
| **Chart / Data Visualization** | [ECharts 6](https://echarts.apache.org/), [Nivo](https://nivo.rocks/), [D3.js](https://d3js.org/) | 주가 차트, 데이터 시각화 |
| **HTTP Client** | [Axios](https://axios-http.com/) | REST API 통신 |
| **Testing / Mocking** | [React Testing Library](https://testing-library.com/), [MSW(Mock Service Worker)](https://mswjs.io/) | 컴포넌트 단위 테스트 및 API Mock 테스트 |
| **Icons / UI** | [React Icons](https://react-icons.github.io/react-icons/) | 일관된 아이콘 시스템 |
| **Build Tool** | [CRA 5 (react-scripts)](https://create-react-app.dev/) | 빌드 및 개발 서버 |
| **Performance** | [Web Vitals](https://web.dev/vitals/) | 성능 모니터링 |
| **Mock Server** | `msw` | 실제 API 통합 전 단계에서 통신 테스트용 가상 서버 구축 |

---

## 📂 폴더 구조

```bash
src/
 ├─ components/        # 공용 UI 컴포넌트
 ├─ pages/             # 주요 페이지 (예: Auth, Policy, PaperTrading 등)
 ├─ store/             # Zustand 전역 상태관리
 ├─ api/               # Axios 인스턴스 및 API 함수
 ├─ hooks/             # 커스텀 훅
 ├─ assets/            # 이미지, 스타일, 아이콘
 ├─ utils/             # 공통 유틸 함수
 └─ App.js             # 라우팅 및 전역 설정
```

---

## ⚙️ 실행 방법

### 1️⃣ 설치

```bash
npm install
```

### 2️⃣ 개발 서버 실행

```bash
npm start
```
- 개발 환경 URL: [http://localhost:3000](http://localhost:3000)  
- 백엔드 프록시: `https://auth.youth-fi.com`

### 3️⃣ 테스트 실행

```bash
npm test
```
- `MSW` 기반으로 실제 API 호출 없이 Mock 서버로 통합 테스트 가능  

### 4️⃣ 프로덕션 빌드

```bash
npm run build
```
- 빌드 결과물은 `/build` 폴더에 생성됩니다.  
- `nginx`, `Vercel`, `Netlify` 등에 배포 가능

---

## 🧩 주요 기능 상세

### 💹 **모의투자 (Paper Trading)**
- ECharts 기반 캔들차트, 이동평균선, 거래량 시각화
- 실시간 시세 변동 (랜덤 혹은 API 연동)
- 매수/매도 시뮬레이션
- 시가/종가/고가/저가 툴팁 및 SMA 라인 표시
- 관심 종목 즐겨찾기 기능

### 👥 **회원 인증 (Auth)**
- JWT 기반 로그인/회원가입/로그아웃
- 사용자 세션 유지 및 토큰 자동 재발급
- 비밀번호 유효성 검증 및 회원 정보 수정

### 🏛️ **청년 정책 추천 (Policy)**
- 정부 및 지자체 청년정책 API 연동
- 지역·나이·소득 조건 기반 필터링
- 즐겨찾기 및 북마크 기능

### 💰 **예적금 비교 (Deposit & Savings)**
- 여러 금융기관 상품을 비교
- 금리·기간별 정렬
- 관심 상품 저장 및 추천

### 🔔 **알림(Notification)**
- 정책 업데이트, 가격 변동, 적금 만기 등의 알림 발송
- 실시간 알림창 구현 (Polling/WebSocket 예정)

---

## 🧪 테스트 및 품질 관리

| 구분 | 설명 |
|------|------|
| **MSW(Mock Service Worker)** | 서버 없이 API 동작을 시뮬레이션, 테스트 환경 격리 |
| **React Testing Library** | UI 컴포넌트 단위 테스트 및 사용자 인터랙션 검증 |
| **Web Vitals** | 렌더링 속도 및 UX 품질 측정 |

---

## 🌐 배포

> **환경별 설정 분리**
> - `.env.development` — 개발 환경  
> - `.env.production` — 배포 환경  
> - 백엔드 서버: `https://auth.youth-fi.com`  
> - 정적 배포: `Vercel` 또는 `Netlify` 권장  

---

## 📈 향후 계획

- [ ] 실시간 주가 WebSocket 반영  
- [ ] 알림 푸시(Push Notification) 기능  
- [ ] 모바일 UI 최적화  
- [ ] 다크모드 및 사용자 설정 페이지  

---

## 🧑‍💻 팀 정보

| 역할 | 담당자 | 주요 업무 |
|------|--------|-----------|
| FE 리드 | Watchiiee | ECharts, UI/UX, 상태관리 |
| BE 연동 | Backend Team | Auth / Policy / Trading API |
| QA & Mock | FE Team | MSW 테스트, 컴포넌트 검증 |

---

## 🪪 라이선스

```text
MIT License © 2025 Youth-Fi
```

---

> ⚡ **"청년의 금융 독립을 위한 한 걸음, Youth-Fi"**
