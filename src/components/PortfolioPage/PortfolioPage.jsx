import React from 'react';
import './PortfolioPage.css';
import Header from '../common/Header';
import { ResponsivePie } from '@nivo/pie';
import { FaLandmark, FaMicrochip } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// 종합 추천 데이터
const portfolioDetails = [
  {
    id: '예금',
    percentage: 28,
    value: 16805120,
    color: '#66DA26',
    products: [
      { icon: <FaLandmark />, name: 'SH수협은행', detail: 'Sh첫만남우대예금' }
    ],
    rates: { max: '2.90%', base: '1.85%' },
    linkText: '더 알아보기 >'
  },
  {
    id: '적금',
    percentage: 32,
    value: 19205850,
    color: '#826AF9',
    products: [
      { icon: <FaLandmark />, name: '신한은행', detail: '적금적금적금' }
    ],
    rates: { max: '7.77%', base: '4.56%' },
    linkText: '더 알아보기 >'
  },
  {
    id: '주식',
    percentage: 30,
    value: 18005430,
    color: '#FF6B6B',
    products: [
      { icon: <FaMicrochip />, name: 'sk 하이닉스', detail: '₩78,400' },
      { icon: <FaMicrochip />, name: '엔비디아', detail: '₩567,400' },
    ],
    rates: null,
    linkText: '주식 추천 더보기 >'
  },
];


const donutChartData = portfolioDetails.map(item => ({
  id: item.id,
  label: item.id,
  value: item.value,
  color: item.color,
}));


const pieChartData = [
    { id: '의약품', value: 193.56 }, { id: '철강금속', value: 139.34 },
    { id: '음식료품', value: 200.82 }, { id: '기계', value: 105.87 },
    { id: '건설', value: 185.29 }, { id: 'IT', value: 145.87 },
    { id: '유통업', value: 174.78 }, { id: '운수장비', value: 208.77 },
    { id: '전기전자', value: 103.97 }, { id: '서비스', value: 168.46 },
    { id: '화학', value: 156.37 }, { id: '금융', value: 160.14 },
];

// 종합 추천 차트를 위한 커스텀 라벨 컴포넌트
const CustomArcLinkLabel = ({ datum, style }) => {
  const displayValue = typeof datum.value === 'number' ? datum.value.toLocaleString() : datum.value;
  return (
    <g transform={style.transform} style={{ pointerEvents: 'none' }}>
      <text
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fill: '#555', // ✨ 글자색을 회색으로 고정
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {datum.id}
      </text>
      <text
        textAnchor="middle"
        dominantBaseline="central"
        dy="18"
        style={{
          fill: '#555', // ✨ 글자색을 회색으로 고정
          fontSize: 14,
          fontWeight: 'bold',
        }}
      >
        {displayValue}
      </text>
    </g>
  );
};

const PortfolioPage = () => {
  const totalAmount = portfolioDetails.reduce((sum, item) => sum + item.value, 0);
  const formattedTotal = `${totalAmount.toLocaleString()}원`;
  
  const CenteredMetric = ({ centerX, centerY }) => {
    return (
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: '24px',
          fontWeight: 700,
        }}
      >
        {formattedTotal}
      </text>
    );
  };

  return (
    <div className="portfolio-page-layout">
      <Header />
      <main className="portfolio-content">
        <div className="main-title-section">
            <h2>포트폴리오</h2>
        </div>
        
        <div className="portfolio-columns">
            <div className="portfolio-left">
                <div className="title-section">
                    <h3>종합 추천</h3>
                </div>
                <div className="donut-chart-container">
                    <ResponsivePie
                      data={donutChartData}
                      innerRadius={0.6}
                      padAngle={0.7}
                      cornerRadius={3}
                      margin={{ top: 40, right: 120, bottom: 40, left: 120 }} 
                      colors={{ datum: 'data.color' }}
                      enableArcLabels={false}
                      enableArcLinkLabels={true} 
                      arcLinkLabelsSkipAngle={10}
                      arcLinkLabelsTextColor="#555" // ✨ 지시선 옆 텍스트 색상을 회색으로 고정
                      arcLinkLabelsColor={{ from: 'color' }}
                      arcLinkLabelsComponent={CustomArcLinkLabel}
                      layers={['arcs', 'arcLinkLabels', CenteredMetric]}
                    />
                </div>
                    <div className="summary-cards">
                        {portfolioDetails.map((card) => (
                        <div className="summary-card" key={card.id}>
                        <div className="card-title">
                        <span className="percentage" style={{ color: card.color }}>
                            {card.percentage}%
                        </span>
                        <span>{card.value.toLocaleString()} 원</span>
                        </div>
                        <h4>{card.id}</h4>

                        {card.products.map((product, index) => (
                        <div className="product-item" key={index}>
                            <div className="product-logo">{product.icon}</div>
                            <div className="product-details">
                            <span>{product.name}</span>
                            <strong>{product.detail}</strong>
                            </div>
                        </div>
                        ))}
                        
                        {card.rates && (
                        <div className="product-rates">
                            <span>최고 <strong>{card.rates.max}</strong></span>
                            <span>기본 {card.rates.base}</span>
                        </div>
                        )}
                        {card.id === '주식' ? (
                            <Link to="/portfolio/recommendations" className="more-link">{card.linkText}</Link>
                        ) : (
                            <a href="#" className="more-link">{card.linkText}</a>
                        )}
                    </div>
                    ))}
                </div>
            </div>

            <div className="portfolio-right">
                <div className="title-section">
                    <h3>추천 종목</h3>
                </div>
                <div className="pie-chart-container">
                    <ResponsivePie
                      data={pieChartData}
                      margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
                      innerRadius={0.005}
                      padAngle={0.3}
                      cornerRadius={3}
                      activeOuterRadiusOffset={8}
                      borderWidth={2}
                      borderColor={'#f9fafb'}
                      colors={{ scheme: 'spectral' }}
                      arcLinkLabelsSkipAngle={10}
                      arcLinkLabelsTextColor="#555" // ✨ 지시선 옆 텍스트 색상을 회색으로 고정
                      arcLinkLabelsOffset={-2}
                      arcLinkLabelsThickness={2}
                      arcLinkLabelsColor={{ from: 'color' }}
                      enableArcLabels={false}
                    />
                </div>
                
                <div className="llm-placeholder">
                    LLM 들어갈 자리
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default PortfolioPage;