import React from 'react';
import './PaperTrading.css';
import Header from '../common/Header'; 

const PaperTrading = () => {
  return (
    // ✨ 페이지 전체를 감싸는 레이아웃 컨테이너
    <div className="paper-trading-layout">
      {/* ✨ Header 컴포넌트를 페이지 내부에 배치 */}
      <Header />

      {/* --- 사이드바 시작 --- */}
      <aside className="app-sidebar">
        <h3 className="sidebar-title">사용자 패널</h3>
        <nav className="sidebar-nav">
          <ul>
            <li className="active"><a href="/dashboard">대시보드</a></li>
            <li><a href="/all-stocks">전체종목</a></li>
            <li><a href="/tutorial">튜토리얼</a></li>
            <li><a href="/quiz">퀴즈</a></li>
            <li><a href="/test1">테스트</a></li>
            <li><a href="/test2">테스트</a></li>
            <li><a href="/test3">테스트</a></li>
          </ul>
        </nav>
      </aside>
      {/* --- 사이드바 끝 --- */}

      {/* --- 메인 대시보드 시작 --- */}
      <main className="paper-trading-container">
        <div className="dashboard-header">
          <h2>내 주식</h2>
          <div className="header-actions">
            <input type="text" placeholder="주식 검색" className="stock-search" />

          </div>
        </div>

        <section className="my-stocks-slider">
          <div className="stock-card highlight">Nvidia</div>
          <div className="stock-card">META</div>
          <div className="stock-card">Tesla Inc</div>
          <div className="stock-card">Apple Inc</div>
          <div className="stock-card">AMD</div>
        </section>

        <div className="dashboard-grid">
          <div className="widget chart-widget">
            <h3>KOSPI / KOSDAQ</h3>
            <div className="placeholder">
              <p>차트가 여기에 표시됩니다.</p>
            </div>
          </div>

          <div className="widget watchlist-widget">
            <h3>관심 종목</h3>
            <div className="placeholder scrollable">
              <p>관심 종목 리스트가 여기에 표시됩니다.</p>
            </div>
          </div>

          <div className="widget holdings-widget">
            <h3>내 종목 보기</h3>
            <div className="placeholder">
              <p>보유 종목 현황이 여기에 표시됩니다.</p>
            </div>
          </div>

          <div className="widget-group">
            <div className="widget transaction-widget">
              <h3>거래 내역</h3>
              <div className="placeholder scrollable">
                <p>거래 내역이 여기에 표시됩니다.</p>
              </div>
            </div>
            <div className="widget portfolio-widget">
              <h3>포트폴리오</h3>
              <div className="placeholder">
                <p>포트폴리오 차트가 여기에 표시됩니다.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* --- 메인 대시보드 끝 --- */}
    </div>
  );
};

export default PaperTrading;