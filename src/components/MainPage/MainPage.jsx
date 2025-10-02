import React from 'react';
import './MainPage.css'; // MainPage를 위한 CSS 파일을 import합니다.
import Header from '../common/Header'; // Header 컴포넌트를 import합니다.
import { ResponsivePie } from '@nivo/pie'; // 포트폴리오 차트를 위한 Nivo Pie 차트
import { FaGraduationCap, FaSchool, FaChild, FaLandmark } from 'react-icons/fa'; // 아이콘 import
import { Link } from 'react-router-dom';

// ✨ 메인 배너 이미지는 이제 CSS에서 처리하므로 여기서 import할 필요가 없습니다.

const MainPage = () => {
  // (나머지 코드는 이전과 동일)
  const portfolioDetails = [
    { id: '예금', value: 16805120, color: '#66DA26' },
    { id: '적금', value: 19205850, color: '#826AF9' },
    { id: '주식', value: 18005430, color: '#FF6B6B' },
  ];

  const donutChartData = portfolioDetails.map(item => ({
    id: item.id,
    label: item.id,
    value: item.value,
    color: item.color,
  }));

  const totalAmount = portfolioDetails.reduce((sum, item) => sum + item.value, 0);
  const formattedTotal = `${totalAmount.toLocaleString()}원`;

  const CenteredMetric = ({ centerX, centerY }) => {
    return (
      <text x={centerX} y={centerY} textAnchor="middle" dominantBaseline="central" style={{ fontSize: '16px', fontWeight: 700, fill: '#555' }}>
        {formattedTotal}
      </text>
    );
  };
  
  const CustomArcLinkLabel = ({ datum, style }) => {
    return (
      <g transform={style.transform} style={{ pointerEvents: 'none' }}>
        <text textAnchor="middle" dominantBaseline="central" style={{ fill: '#555', fontSize: 12, fontWeight: 600 }}>
          {datum.id}
        </text>
      </g>
    );
  };

  return (
    <div className="main-page-container">
      <Header />
      <main className="main-content">
        {/* --- 상단 배너 섹션 --- */}
        <section className="main-banner">
          <div className="banner-text">
            <h2>투자의 첫걸음, YOUTHFI 모의투자와 함께!</h2>
            <p>
              실제 같은 투자 환경에서 위험 부담 없이 안전하게 배우고 경험하세요.
              <br />
              이곳에서의 연습이 당신을 자신감 있는 투자자로 만들어줍니다.
            </p>
            <button>지금 바로 시작하세요!</button>
          </div>
          {/* ✨ 이 부분을 삭제했습니다. */}
        </section>

        {/* --- 하단 3단 카드 섹션 (이하 동일) --- */}
        <section className="card-section">
          {/* 청년정책 카드 */}
          <div className="info-card">
            <div className="card-header">
              <h3>청년정책</h3>
              <Link to="/policy">자세히보기 &gt;</Link>
            </div>
            <div className="card-content">
              <ul className="policy-list">
                <li>
                  <div className="item-icon"><FaGraduationCap /></div>
                  <div className="item-details">
                    <span className="item-title">대학생 지원 사업</span>
                    <span className="item-source">경기도</span>
                  </div>
                  <span className="item-dday highlight">D-12</span>
                </li>
                <li>
                  <div className="item-icon"><FaSchool /></div>
                  <div className="item-details">
                    <span className="item-title">중학생 지원 사업</span>
                    <span className="item-source">경기도</span>
                  </div>
                  <span className="item-dday">D-125</span>
                </li>
                <li>
                  <div className="item-icon"><FaChild /></div>
                  <div className="item-details">
                    <span className="item-title">초등학생 지원 사업</span>
                    <span className="item-source">서울시</span>
                  </div>
                  <span className="item-dday">D-234</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 예적금 카드 */}
          <div className="info-card">
            <div className="card-header">
              <h3>예·적금</h3>
              <Link to="/savings">자세히보기 &gt;</Link>
            </div>
            <div className="card-content">
              <ul className="savings-list">
                <li>
                  <div className="item-icon bank-icon"><FaLandmark /></div>
                  <div className="item-details">
                    <span className="item-title">Sh첫만남우대예금</span>
                    <span className="item-source">SH수협은행</span>
                  </div>
                  <div className="item-interest">
                    <span className="rate-label">최고</span>
                    <span className="rate-value">2.90%</span>
                    <span className="rate-base">기본 1.85%</span>
                  </div>
                </li>
                <li>
                  <div className="item-icon bank-icon"><FaLandmark /></div>
                  <div className="item-details">
                    <span className="item-title">e-그린세이브예금</span>
                    <span className="item-source">SC제일은행</span>
                  </div>
                  <div className="item-interest">
                    <span className="rate-label">최고</span>
                    <span className="rate-value">2.85%</span>
                    <span className="rate-base">기본 2.55%</span>
                  </div>
                </li>
                <li>
                  <div className="item-icon bank-icon"><FaLandmark /></div>
                  <div className="item-details">
                    <span className="item-title">우리 첫거래 우대 정기예금</span>
                    <span className="item-source">우리은행</span>
                  </div>
                  <div className="item-interest">
                    <span className="rate-label">최고</span>
                    <span className="rate-value">2.80%</span>
                    <span className="rate-base">기본 1.80%</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* 포트폴리오 카드 */}
          <div className="info-card">
            <div className="card-header">
              <h3>포트폴리오</h3>
              <Link to="/portfolio">자세히보기 &gt;</Link>
            </div>
            <div className="card-content chart-container">
              <ResponsivePie
                data={donutChartData}
                margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
                innerRadius={0.6}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ datum: 'data.color' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                enableArcLabels={false}
                enableArcLinkLabels={true}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#555"
                arcLinkLabelsColor={{ from: 'color' }}
                arcLinkLabelsComponent={CustomArcLinkLabel}
                layers={['arcs', 'arcLinkLabels', CenteredMetric]}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MainPage;