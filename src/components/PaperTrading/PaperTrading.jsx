import React, { useState } from "react";
import "./PaperTrading.css";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import Modal from "../../components/common/Modal";

// --- Mock Data ---

const marketData = {
  KOSPI: {
    name: "KOSPI",
    data: [{ "id": "KOSPI", "data": [ { "x": "09:00", "y": 11690 }, { "x": "10:30", "y": 11715 }, { "x": "12:00", "y": 11650 }, { "x": "13:30", "y": 11580 }, { "x": "15:00", "y": 11550 }, { "x": "15:30", "y": 11512 } ] }],
    summary: { high: "11,721.89", close: "11,512.41", low: "11,540.47", start: "11,690.11" }
  },
  KOSDAQ: {
    name: "KOSDAQ",
    data: [{ "id": "KOSDAQ", "data": [ { "x": "09:00", "y": 850 }, { "x": "10:30", "y": 865 }, { "x": "12:00", "y": 855 }, { "x": "13:30", "y": 870 }, { "x": "15:00", "y": 860 }, { "x": "15:30", "y": 862 } ] }],
    summary: { high: "871.20", close: "862.50", low: "848.10", start: "850.30" }
  },
};

const pieChartData = [
  { "id": "삼성전자", "value": 35, "color": "#81C784" }, { "id": "SK하이닉스", "value": 25, "color": "#64B5F6" },
  { "id": "현대차", "value": 15, "color": "#FFB74D" }, { "id": "LG", "value": 15, "color": "#E57373" },
  { "id": "코오롱인더", "value": 10, "color": "#FFF176" }
];

const watchlistData = [
    { logo: "AMZN", name: "Amazon.com, Inc", ticker: "AMZN", price: "$102.24", changePercent: "+1.56%", changeValue: 1.56 },
    { logo: "KO", name: "Coca-Cola Co", ticker: "KO", price: "$60.49", changePercent: "-0.53%", changeValue: -0.53 },
    { logo: "BMW", name: "Bayerische Motoren Werke AG", ticker: "BMW", price: "$92.94", changePercent: "0.00%", changeValue: 0 },
    { logo: "MSFT", name: "Microsoft Corp", ticker: "MSFT", price: "$248.16", changePercent: "+0.06%", changeValue: 0.06 },
];

const fullWatchlistData = [ ...watchlistData, { logo: "TSLA", name: "Tesla, Inc.", ticker: "TSLA", price: "$180.01", changePercent: "-2.52%", changeValue: -2.52 }, { logo: "AAPL", name: "Apple Inc.", ticker: "AAPL", price: "$172.28", changePercent: "+1.48%", changeValue: 1.48 } ];

const transactionsData = [
    { date: "8.20", name: "SK하이닉스 2주", type: "구매", amount: "+140,000원", price: "283,610원" },
    { date: "8.19", name: "삼성전자 1주", type: "판매", amount: "-63,000원", price: "40,610원" },
    { date: "8.16", name: "삼성전자 1주", type: "구매", amount: "+3,610원", price: "103,610원" },
];

const fullTransactionsData = [ ...transactionsData, { date: "8.15", name: "코카콜라 5주", type: "구매", amount: "+450,000원", price: "450,000원" }, { date: "8.14", name: "아마존 1주", type: "판매", amount: "-130,000원", price: "130,000원" } ];

const holdingsData = {
  total: { value: 162856, changeValue: 3631, changePercent: 2.2 },
  domestic: [
    { name: "LG디스플레이", value: 149300, changePercent: "+2.6%", isUp: true },
    { name: "삼성전자", value: 85300, changePercent: "+1.2%", isUp: true },
  ],
  overseas: [
    { name: "애플", value: 13874, changePercent: "+0.3%", isUp: true },
  ]
};

// 커스텀 툴팁 컴포넌트 정의
const CustomTooltip = ({ point }) => {
  const formatTime = (timeStr) => {
    const hour = parseInt(timeStr.split(':')[0], 10);
    if (hour < 12) return `오전 ${timeStr}`;
    if (hour === 12) return `오후 ${timeStr}`;
    const pmHour = hour - 12;
    return `오후 ${pmHour}:${timeStr.split(':')[1]}`;
  };

  return (
    <div className="custom-tooltip">
      <strong>{point.data.y.toLocaleString()}</strong> {formatTime(point.data.xFormatted)}
    </div>
  );
};

const PaperTrading = () => {
  const [activeMarket, setActiveMarket] = useState("KOSPI");
  const currentMarket = marketData[activeMarket];
  const navigate = useNavigate();

  const [isWatchlistModalOpen, setWatchlistModalOpen] = useState(false);
  const [isTransactionsModalOpen, setTransactionsModalOpen] = useState(false);
  const [isHoldingsModalOpen, setHoldingsModalOpen] = useState(false);

  const getChangeColorClass = (value) => {
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';
    return 'neutral';
  };

  return (
    <div className="paper-trading-container">
      <div className="dashboard-header">
        <h2>내 주식</h2>
        <div className="header-actions">
          <input type="text" placeholder="주식 검색" className="stock-search" />
        </div>
      </div>
      <div className="dashboard-grid">
        <div className="widget chart-widget">
          <div className="widget-header market-selector">
            <div className="market-buttons">
              <button onClick={() => setActiveMarket("KOSPI")} className={activeMarket === "KOSPI" ? "active" : ""}>KOSPI</button>
              <button onClick={() => setActiveMarket("KOSDAQ")} className={activeMarket === "KOSDAQ" ? "active" : ""}>KOSDAQ</button>
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
              tooltip={CustomTooltip}
              enableCrosshair={true}
              crosshairType="x"
            />
          </div>
          <div className="chart-summary">
            <div><span>최고가</span> {currentMarket.summary.high}</div>
            <div><span>장마감</span> {currentMarket.summary.close}</div>
            <div><span>최저가</span> {currentMarket.summary.low}</div>
            <div><span>시작가</span> {currentMarket.summary.start}</div>
          </div>
        </div>
        <div className="widget watchlist-widget">
          <div className="widget-header">
            <h3>관심 종목</h3>
            <button className="add-button" onClick={() => setWatchlistModalOpen(true)}>+</button>
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
                  <span className={getChangeColorClass(stock.changeValue)}>{stock.price}</span>
                  <small className={getChangeColorClass(stock.changeValue)}>{stock.changePercent}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="widget holdings-widget">
          <div className="widget-header clickable" onClick={() => setHoldingsModalOpen(true)}>
            <h3>내 종목 보기 <IoIosArrowForward /></h3>
          </div>
          <div className="total-assets">
            <h2>{holdingsData.total.value.toLocaleString()}원</h2>
            <span className={getChangeColorClass(holdingsData.total.changeValue)}>
              +{holdingsData.total.changeValue.toLocaleString()}원 ({holdingsData.total.changePercent}%)
            </span>
          </div>
          <div className="holdings-section">
            <h4>국내주식</h4>
            {holdingsData.domestic.slice(0, 1).map(stock => (
              <div className="stock-holding-item" key={stock.name}>
                <span>{stock.name}</span>
                <div className="holding-price">
                  <span>{stock.value.toLocaleString()}원</span>
                  <small className={stock.isUp ? 'positive' : 'negative'}>{stock.changePercent}</small>
                </div>
              </div>
            ))}
          </div>
          <div className="holdings-section">
            <h4>해외주식</h4>
            {holdingsData.overseas.slice(0, 1).map(stock => (
               <div className="stock-holding-item" key={stock.name}>
                <span>{stock.name}</span>
                <div className="holding-price">
                  <span>{stock.value.toLocaleString()}원</span>
                  <small className={stock.isUp ? 'positive' : 'negative'}>{stock.changePercent}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="widget-group">
          <div className="widget transaction-widget">
            <div className="widget-header">
              <h3>거래 내역</h3>
              <button className="add-button" onClick={() => setTransactionsModalOpen(true)}>+</button>
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
            <div className="widget-header">
              <h3>투자 현황</h3>
              <button className="add-button" onClick={() => navigate('/portfolio')}>+</button>
            </div>
            <div className="pie-chart-container">
              <ResponsivePie data={pieChartData} margin={{ top: -150, right: 10, bottom: 10, left: 10 }} innerRadius={0.6} padAngle={2} cornerRadius={3} activeOuterRadiusOffset={8} borderWidth={1} borderColor={{ from: "color", modifiers: [["darker", 0.2]] }} enableArcLinkLabels={false} enableArcLabels={false} colors={{ datum: "data.color" }} legends={[]}/>
            </div>
            <div className="flex-spacer"></div>
          </div>
        </div>
      </div>

      <Modal isOpen={isWatchlistModalOpen} onClose={() => setWatchlistModalOpen(false)} title="전체 관심 종목">
        <div className="watchlist-list">
            {fullWatchlistData.map((stock) => (
              <div className="stock-item" key={stock.ticker}>
                <div className="stock-logo">{stock.logo}</div>
                <div className="stock-info">
                  <span>{stock.name}</span>
                  <small>{stock.ticker}</small>
                </div>
                <div className="stock-price">
                  <span className={getChangeColorClass(stock.changeValue)}>{stock.price}</span>
                  <small className={getChangeColorClass(stock.changeValue)}>{stock.changePercent}</small>
                </div>
              </div>
            ))}
        </div>
      </Modal>

      <Modal isOpen={isTransactionsModalOpen} onClose={() => setTransactionsModalOpen(false)} title="전체 거래 내역">
        <div className="transaction-list">
            {fullTransactionsData.map((t, i) => (
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
      </Modal>

      <Modal 
        isOpen={isHoldingsModalOpen} 
        onClose={() => setHoldingsModalOpen(false)}
        title="전체 보유 종목"
      >
        <div className="holdings-list-modal">
          <div className="holdings-section">
              <h4>국내주식</h4>
              {holdingsData.domestic.map(stock => (
                <div className="stock-holding-item" key={stock.name}>
                  <span>{stock.name}</span>
                  <div className="holding-price">
                    <span>{stock.value.toLocaleString()}원</span>
                    <small className={stock.isUp ? 'positive' : 'negative'}>{stock.changePercent}</small>
                  </div>
                </div>
              ))}
          </div>
          <div className="holdings-section">
              <h4>해외주식</h4>
              {holdingsData.overseas.map(stock => (
                 <div className="stock-holding-item" key={stock.name}>
                  <span>{stock.name}</span>
                  <div className="holding-price">
                    <span>{stock.value.toLocaleString()}원</span>
                    <small className={stock.isUp ? 'positive' : 'negative'}>{stock.changePercent}</small>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaperTrading;