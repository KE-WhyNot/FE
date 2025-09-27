import React, { useState } from "react";
import "./AllStocks.css"; // AllStocks 페이지 전용 CSS
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";

// --- Mock Data ---
const stockPriceData = [
  {
    id: "price",
    data: Array.from({ length: 50 }, (_, i) => ({
      x: `오후 ${Math.floor(i / 6)}:${(i % 6) * 10}`,
      y: 75000 + Math.sin(i / 4) * 5000 + Math.random() * 1000,
    })),
  },
];
const stockVolumeData = Array.from({ length: 20 }, (_, i) => ({
  time: `${i + 1}h`,
  volume: 100000 + Math.random() * 150000,
}));
const orderBookData = {
  sell: [
    { price: 68900, volume: 162526 },
    { price: 68800, volume: 91322 },
    { price: 68700, volume: 72141 },
    { price: 68600, volume: 4213 },
  ],
  buy: [
    { price: 68500, volume: 81236 },
    { price: 68400, volume: 274223 },
    { price: 68300, volume: 265939 },
    { price: 68200, volume: 153627 },
  ],
};

const AllStocks = () => {
  const [orderType, setOrderType] = useState("buy"); // 'buy' or 'sell'
  const [price, setPrice] = useState(68500);
  const [quantity, setQuantity] = useState(0);

  return (
    <div className="all-stocks-container">
      <div className="stock-page-header">
        <input
          type="text"
          placeholder="종목명 또는 코드를 검색하세요."
          className="global-stock-search"
        />
      </div>

      <div className="stock-detail-grid">
        {/* --- 왼쪽 차트 섹션 --- */}
        <div className="chart-section">
          <div className="widget main-chart-widget">
            <div className="widget-header">
              <h3>삼성전자</h3>
              <div className="chart-tabs">
                <button className="active">1일</button>
                <button>1주</button>
                <button>1달</button>
                <button>3달</button>
                <button>1년</button>
                <button>5년</button>
              </div>
            </div>
            <div className="line-chart-container">
              <ResponsiveLine data={stockPriceData} /* ... nivo props ... */ />
            </div>
          </div>
          <div className="widget volume-chart-widget">
            <div className="bar-chart-container">
              <ResponsiveBar
                data={stockVolumeData}
                keys={["volume"]}
                indexBy="time"
                colors={["#d3d3d3"]}
                enableLabel={false}
              />
            </div>
          </div>
        </div>

        {/* --- 오른쪽 주문 패널 --- */}
        <aside className="order-panel">
          <div className="widget">
            <h3 className="order-title">주식 주문</h3>
            <div className="stock-id">
              <div className="stock-logo-small"></div>
              <span>삼성전자</span>
            </div>
            <div className="order-tabs">
              <button
                onClick={() => setOrderType("buy")}
                className={orderType === "buy" ? "active" : ""}
              >
                매수
              </button>
              <button
                onClick={() => setOrderType("sell")}
                className={orderType === "sell" ? "active" : ""}
              >
                매도
              </button>
            </div>

            <div className="order-book">
              {orderBookData.sell
                .slice(0)
                .reverse()
                .map((o) => (
                  <div key={o.price} className="order-row sell">
                    <span>{o.price.toLocaleString()}</span>{" "}
                    <span>{o.volume.toLocaleString()}</span>
                  </div>
                ))}
              <div className="divider"></div>
              {orderBookData.buy.map((o) => (
                <div key={o.price} className="order-row buy">
                  <span>{o.price.toLocaleString()}</span>{" "}
                  <span>{o.volume.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="order-form">
              <div className="form-group">
                <label>가격</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>수량</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>

            <div className="order-summary">
              <div>
                <span>총액</span>{" "}
                <span className="total-amount">
                  {(price * quantity).toLocaleString()} 원
                </span>
              </div>
            </div>
            <button className={`order-button ${orderType}`}>
              {orderType === "buy" ? "매수" : "매도"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AllStocks;
