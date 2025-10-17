import React, { useEffect, useState } from 'react';
import './PortfolioPage.css';
import Header from '../common/Header';
import { ResponsivePie } from '@nivo/pie';
import { FaLandmark, FaMicrochip } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import financeAxiosInstance from '../../api/financeAxiosInstance';
import policyAxios from '../../api/policyAxiosInstance';
import useAuthStore from '../../store/useAuthStore';

// ✅ 양쪽 차트에서 함께 사용할 새로운 커스텀 라벨 컴포넌트
const CustomArcLinkLabel = ({ datum, style }) => {
  return (
    <g transform={style.transform} style={{ pointerEvents: 'none' }}>
      {/* 첫 번째 줄: 퍼센트(%) 표시 */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          fill: style.textColor,
        }}
      >
        {datum.value}%
      </text>
      {/* 두 번째 줄: 항목 이름(ID) 표시 */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        dy="18"
        style={{
          fontSize: 14,
          fill: '#555',
        }}
      >
        {datum.id}
      </text>
    </g>
  );
};

const PortfolioPage = () => {
  const { user } = useAuthStore();
  const [portfolioData, setPortfolioData] = useState(null);
  const [investmentProfile, setInvestmentProfile] = useState(null);
  const [depositData, setDepositData] = useState(null);
  const [savingData, setSavingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReason, setSelectedReason] = useState('');

  // ✅ 데이터 불러오기
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        // 1️⃣ 포트폴리오 추천 정보
        const portfolioRes = await financeAxiosInstance.get(
          '/api/user/portfolio-recommendation/my',
          { headers: { 'X-User-Id': user?.userId } }
        );
        const result = portfolioRes.data?.result;
        setPortfolioData(result || null);

        // 2️⃣ 투자 성향 정보 (availableAssets 포함)
        const profileRes = await financeAxiosInstance.get(
          '/api/user/investment-profile/my',
          { headers: { 'X-User-Id': user?.userId } }
        );
        const profileResult = profileRes.data?.result;
        setInvestmentProfile(profileResult || null);

        // 3️⃣ 예금 정보
        const depositRes = await policyAxios.get('/api/finproduct/list', {
          params: {
            page_num: 1,
            page_size: 1,
            product_type: 1,
            interest_rate_sort: 'include_bonus',
          },
        });
        const depositProduct = depositRes.data?.result?.finProductList?.[0];
        setDepositData(depositProduct || null);

        // 4️⃣ 적금 정보
        const savingRes = await policyAxios.get('/api/finproduct/list', {
          params: {
            page_num: 1,
            page_size: 1,
            product_type: 2,
            interest_rate_sort: 'include_bonus',
          },
        });
        const savingProduct = savingRes.data?.result?.finProductList?.[0];
        setSavingData(savingProduct || null);
      } catch (error) {
        console.error('❌ 데이터 요청 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [user?.userId]);

  // ✅ 로딩 중
  if (loading) {
    return (
      <div className="portfolio-page-layout">
        <Header />
        <main className="portfolio-content">
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        </main>
      </div>
    );
  }

  // ✅ 데이터 없는 경우
  if (!portfolioData || !investmentProfile) {
    return (
      <div className="portfolio-page-layout">
        <Header />
        <main className="portfolio-content">
          <p>포트폴리오 데이터를 불러올 수 없습니다.</p>
        </main>
      </div>
    );
  }

  // ✅ 비율 계산
  const allocationSavings = portfolioData.allocationSavings ?? 50;
  const allocationStocks = 100 - allocationSavings;
  const availableAssets = investmentProfile.availableAssets ?? 0;

  // ✅ 예적금 / 주식 금액 계산
  const savingsAmount = Math.round((availableAssets * allocationSavings) / 100);
  const stocksAmount = Math.round((availableAssets * allocationStocks) / 100);

  // ✅ 차트용 데이터
  const donutChartData = [
    { id: '예적금', value: allocationSavings, color: '#66DA26' },
    { id: '주식', value: allocationStocks, color: '#FF6B6B' },
  ];

  // ✅ 카드 데이터
  const portfolioDetails = [
    {
      id: '예적금',
      percentage: allocationSavings,
      value: savingsAmount,
      color: '#66DA26',
      products: [
        depositData && {
          type: '예금',
          icon: <FaLandmark />,
          name: depositData.bank_name,
          detail: depositData.product_name,
          image: depositData.image_url,
          rates: {
            max: `${depositData.max_interest_rate}%`,
            base: `${depositData.min_interest_rate}%`,
          },
        },
        savingData && {
          type: '적금',
          icon: <FaLandmark />,
          name: savingData.bank_name,
          detail: savingData.product_name,
          image: savingData.image_url,
          rates: {
            max: `${savingData.max_interest_rate}%`,
            base: `${savingData.min_interest_rate}%`,
          },
        },
      ].filter(Boolean),
      linkText: '더 알아보기 >',
    },
    {
      id: '주식',
      percentage: allocationStocks,
      value: stocksAmount,
      color: '#FF6B6B',
      products: portfolioData.recommendedStocks || [],
      linkText: '더보기 >',
    },
  ];

  // ✅ 중앙 금액 표시용
  const formattedTotal = `${availableAssets.toLocaleString()}원`;

  const CenteredMetric = ({ centerX, centerY }) => (
    <text
      x={centerX}
      y={centerY}
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: '24px', fontWeight: 700, fill: '#333' }}
    >
      {formattedTotal}
    </text>
  );

  // ✅ 추천 종목 파이차트 데이터
  const pieChartData =
    portfolioData.recommendedStocks?.map((stock) => ({
      id: stock.stockName,
      value: stock.allocationPct,
      reason: stock.reason,
    })) || [];

  const handlePieClick = (node) => {
    const clicked = pieChartData.find((item) => item.id === node.id);
    if (clicked) setSelectedReason(clicked.reason);
  };

  // ✅ 최고가 / 최저가 값 포맷
  const highestValue = portfolioData.highestValue?.toLocaleString() ?? null;
  const lowestValue = portfolioData.lowestValue?.toLocaleString() ?? null;

  // ✅ LLM 분석 결과 + 예측 데이터 문장 생성
  const renderLLMOutput = () => {
    if (!selectedReason) return '종목을 클릭하면 AI 분석 결과가 표시됩니다.';
    let analysisText = selectedReason;
    if (highestValue && lowestValue) {
      analysisText += `\n\n 또한, 최근 13주간 1,000만 원을 해당 포트폴리오에 투자했을 경우,\n예상 최고 가치는 약 ${highestValue}원, 최저 가치는 약 ${lowestValue}원으로 분석됩니다.`;
    }
    return analysisText;
  };

  return (
    <div className="portfolio-page-layout">
      <Header />
      <main className="portfolio-content">
        <div className="main-title-section">
          <h2>포트폴리오</h2>
        </div>

        <div className="portfolio-columns">
          {/* ✅ 왼쪽 (종합 추천) */}
          <div className="portfolio-left">
            <div className="title-section">
              <h3>종합 추천</h3>
            </div>
            <div className="donut-chart-container">
              <ResponsivePie
                data={donutChartData}
                innerRadius={0.65}
                padAngle={1.5}
                cornerRadius={5}
                margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
                colors={{ datum: 'data.color' }}
                enableArcLabels={false}
                enableArcLinkLabels={true}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#555"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLinkLabelsDiagonalLength={16}
                arcLinkLabelsStraightLength={24}
                arcLinkLabelsTextOffset={6}
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

                  {card.id === '예적금' ? (
                    <div className="product-split-container">
                      {card.products.map((product, index) => (
                        <div className="product-split-item" key={index}>
                          <h5>{product.type}</h5>
                          <div className="product-item">
                            <div className="product-logo">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="bank-logo"
                                />
                              ) : (
                                product.icon
                              )}
                            </div>
                            <div className="product-details">
                              <span>{product.name}</span>
                              <strong>{product.detail}</strong>
                            </div>
                          </div>
                          {product.rates && (
                            <div className="product-rates">
                              <span>
                                최고 <strong>{product.rates.max}</strong>
                              </span>
                              <span>기본 {product.rates.base}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="stock-scroll-container">
                      <div className="stock-scroll-list">
                        {card.products.map((stock, index) => (
                          <div className="product-item" key={index}>
                            <div className="product-logo">
                              <FaMicrochip />
                            </div>
                            <div className="product-details">
                              <span>{stock.stockName}</span>
                              <strong>{stock.allocationPct}%</strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {card.id === '주식' ? (
                    <Link to="/all-stocks" className="more-link">
                      {card.linkText}
                    </Link>
                  ) : (
                    <Link to="/savings" className="more-link">
                      {card.linkText}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ✅ 오른쪽 (추천 종목 + 예측 수익 정보 포함) */}
          <div className="portfolio-right">
            <div className="title-section">
              <h3>추천 종목</h3>
            </div>
            <div className="pie-chart-container">
              <ResponsivePie
                data={pieChartData}
                margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
                innerRadius={0.65}
                padAngle={1.5}
                cornerRadius={5}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                colors={{ scheme: 'set2' }}
                enableArcLabels={false}
                enableArcLinkLabels={true}
                arcLinkLabelsSkipAngle={15}
                arcLinkLabelsTextColor="#555"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLinkLabelsDiagonalLength={16}
                arcLinkLabelsStraightLength={24}
                arcLinkLabelsTextOffset={6}
                arcLinkLabelsComponent={CustomArcLinkLabel}
                onClick={handlePieClick}
              />
            </div>

            <div className="llm-placeholder">
              <p className="reason-text" style={{ whiteSpace: 'pre-line' }}>
                {renderLLMOutput()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortfolioPage;
