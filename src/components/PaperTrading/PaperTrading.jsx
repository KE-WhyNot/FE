import React, { useState } from "react";
import "./PaperTrading.css";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";

// --- Mock Data (시장별 차트 데이터) ---
const marketData = {
  KOSPI: {
    name: "KOSPI",
    data: [
      {
        id: "KOSPI",
        data: [
          { x: "09:00", y: 11690 },
          { x: "10:30", y: 11715 },
          { x: "12:00", y: 11650 },
          { x: "13:30", y: 11580 },
          { x: "15:00", y: 11550 },
          { x: "15:30", y: 11512 },
        ],
      },
    ],
    summary: {
      high: "11,721.89",
      close: "11,512.41",
      low: "11,540.47",
      start: "11,690.11",
    },
  },
  KOSDAQ: {
    name: "KOSDAQ",
    data: [
      {
        id: "KOSDAQ",
        data: [
          { x: "09:00", y: 850 },
          { x: "10:30", y: 865 },
          { x: "12:00", y: 855 },
          { x: "13:30", y: 870 },
          { x: "15:00", y: 860 },
          { x: "15:30", y: 862 },
        ],
      },
    ],
    summary: {
      high: "871.20",
      close: "862.50",
      low: "848.10",
      start: "850.30",
    },
  },
};

// 포트폴리오 파이 차트 데이터
const pieChartData = [
  { id: "삼성전자", value: 35, color: "#81C784" },
  { id: "SK하이닉스", value: 25, color: "#64B5F6" },
  { id: "현대차", value: 15, color: "#FFB74D" },
  { id: "LG", value: 15, color: "#E57373" },
  { id: "코오롱인더", value: 10, color: "#FFF176" },
];

// 관심 종목 데이터
const watchlistData = [
  {
    logo: "AMZN",
    name: "Amazon.com, Inc",
    ticker: "AMZN",
    price: "$102.24",
    change: "+3.02",
    isUp: true,
  },
  {
    logo: "KO",
    name: "Coca-Cola Co",
    ticker: "KO",
    price: "$60.49",
    change: "-0.32",
    isUp: false,
  },
  {
    logo: "BMW",
    name: "Bayerische Motoren Werke AG",
    ticker: "BMW",
    price: "$92.94",
    change: "+0.59",
    isUp: true,
  },
  {
    logo: "MSFT",
    name: "Microsoft Corp",
    ticker: "MSFT",
    price: "$248.16",
    change: "+0.16",
    isUp: true,
  },
];

// 거래 내역 데이터
const transactionsData = [
  {
    date: "8.20",
    name: "SK하이닉스 2주",
    type: "구매",
    amount: "+140,000원",
    price: "283,610원",
  },
  {
    date: "8.19",
    name: "삼성전자 1주",
    type: "판매",
    amount: "-63,000원",
    price: "40,610원",
  },
  {
    date: "8.16",
    name: "삼성전자 1주",
    type: "구매",
    amount: "+3,610원",
    price: "103,610원",
  },
];

const PaperTrading = () => {
  const [activeMarket, setActiveMarket] = useState("KOSPI");
  const currentMarket = marketData[activeMarket];

  return (
    <div className="paper-trading-container">
      <div className="dashboard-header">
        <h2>내 주식</h2>
        <div className="header-actions">
          <input type="text" placeholder="주식 검색" className="stock-search" />
        </div>
      </div>

      <div className="dashboard-grid">
        {/* 1. 시장 현황 차트 */}
        <div className="widget chart-widget">
          <div className="widget-header market-selector">
            <div className="market-buttons">
              <button
                onClick={() => setActiveMarket("KOSPI")}
                className={activeMarket === "KOSPI" ? "active" : ""}
              >
                KOSPI
              </button>
              <button
                onClick={() => setActiveMarket("KOSDAQ")}
                className={activeMarket === "KOSDAQ" ? "active" : ""}
              >
                KOSDAQ
              </button>
              <button>NASDAQ</button>
              <button>S&P500</button>
            </div>
            <div className="chart-tabs">
              <button className="active">1D</button>
              <button>5D</button>
              <button>1M</button>
            </div>
          </div>
          <div className="line-chart-container">
            <ResponsiveLine
              data={currentMarket.data}
              margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
              xScale={{ type: "point" }}
              yScale={{ type: "linear", min: "auto", max: "auto" }}
              axisBottom={{ tickSize: 5, tickPadding: 5 }}
              axisLeft={{ tickSize: 5, tickPadding: 5 }}
              enableGridX={false}
              colors={["#6e55ff"]}
              lineWidth={3}
              pointSize={8}
              pointColor="white"
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              useMesh={true}
              legends={[]}
            />
          </div>
          <div className="chart-summary">
            <div>
              <span>최고가</span> {currentMarket.summary.high}
            </div>
            <div>
              <span>장마감</span> {currentMarket.summary.close}
            </div>
            <div>
              <span>최저가</span> {currentMarket.summary.low}
            </div>
            <div>
              <span>시작가</span> {currentMarket.summary.start}
            </div>
          </div>
        </div>

        {/* 2. 관심 종목 */}
        <div className="widget watchlist-widget">
          <div className="widget-header">
            <h3>관심 종목</h3>
            <button className="add-button">+</button>
          </div>
          <div className="watchlist-list">
            {watchlistData.map((stock) => (
              <div className="stock-item" key={stock.ticker}>
                <div className="stock-logo">{stock.logo}</div>
                <div className="stock-info">
                  <span>{stock.name}</span>
                  <small>{stock.ticker}</small>
                </div>
                <div className="stock-price">
                  <span>{stock.price}</span>
                  <small className={stock.isUp ? "positive" : "negative"}>
                    {stock.change}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 내 종목 보기 */}
        <div className="widget holdings-widget">
          <div className="widget-header">
            <h3>내 종목 보기 </h3>
          </div>
          <div className="total-assets">
            <h2>162,856원</h2>
            <span className="positive">+3,631원(2.2%)</span>
          </div>
          <div className="holdings-section">
            <h4>국내주식</h4>
            <div className="stock-holding-item">
              <span>LG디스플레이</span>
              <span>149,300원</span>
            </div>
          </div>
          <div className="holdings-section">
            <h4>해외주식</h4>
            <div className="stock-holding-item">
              <span>애플</span>
              <span>13,874원</span>
            </div>
          </div>
        </div>

        {/* 4. 거래 내역 & 포트폴리오 */}
        <div className="widget-group">
          <div className="widget transaction-widget">
            <div className="widget-header">
              <h3>거래 내역</h3>
              <button className="add-button">+</button>
            </div>
            <div className="transaction-list">
              {transactionsData.map((t, i) => (
                <div className="transaction-item" key={i}>
                  <span className="date">{t.date}</span>
                  <div className="info">
                    <span>{t.name}</span>
                    <small>{t.type}</small>
                  </div>
                  <div className="amount">
                    <span>{t.amount}</span>
                    <small>{t.price}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="widget portfolio-widget">
            <h3>포트폴리오</h3>
            <div className="pie-chart-container">
              <ResponsivePie
                data={pieChartData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                innerRadius={0.6}
                padAngle={2}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                enableArcLinkLabels={false}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor="#333333"
                colors={{ datum: "data.color" }}
                legends={[]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperTrading;
