import React, { useState } from "react";
import "./AllStocks.css";
import { ChartCanvas, Chart } from "react-financial-charts";
import { XAxis, YAxis } from "react-financial-charts";
import { discontinuousTimeScaleProvider } from "react-financial-charts";
import { OHLCTooltip } from "react-financial-charts";
import { BarSeries, CandlestickSeries } from "react-financial-charts";
import { last } from "react-financial-charts";

// --- Mock Data 생성 ---
const generateMockData = (count) => {
  const data = [];
  let date = new Date(2025, 8, 1);
  let close = 55000;
  for (let i = 0; i < count; i++) {
    date.setDate(date.getDate() + 1);
    const open = close + (Math.random() - 0.5) * 1000;
    const high = Math.max(open, close) + Math.random() * 500;
    const low = Math.min(open, close) - Math.random() * 500;
    close = low + Math.random() * (high - low);
    const volume = 100000 + Math.random() * 200000;
    data.push({ date: new Date(date), open, high, low, close, volume });
  }
  return data;
};

const initialData = generateMockData(50);

const orderBookData = {
  sell: [
    { price: 68900, volume: 162526 }, { price: 68800, volume: 91322 },
    { price: 68700, volume: 72141 }, { price: 68600, volume: 4213 },
  ],
  buy: [
    { price: 68500, volume: 81236 }, { price: 68400, volume: 274223 },
    { price: 68300, volume: 265939 }, { price: 68200, volume: 153627 },
  ],
};

const AllStocks = () => {
  // ✨ 1. 주문 패널을 위한 state들을 다시 추가합니다.
  const [orderType, setOrderType] = useState("buy");
  const [price, setPrice] = useState(68500);
  const [quantity, setQuantity] = useState(0);

  // --- react-financial-charts를 위한 데이터 설정 ---
  const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => d.date);
  const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(initialData);
  const xExtents = [xAccessor(last(data)), xAccessor(data[data.length - 25])];

  return (
    <div className="all-stocks-container">
      <div className="stock-page-header">
        <input type="text" placeholder="종목명 또는 코드를 검색하세요." className="global-stock-search"/>
      </div>
      <div className="stock-detail-grid">
        <div className="chart-section widget">
          <div className="widget-header">
            <h3>삼성전자</h3>
            <div className="chart-tabs">
              <button className="active">1일</button><button>1주</button><button>1달</button>
            </div>
          </div>
          <ChartCanvas
            height={400}
            ratio={window.devicePixelRatio}
            width={700}
            margin={{ left: 10, right: 50, top: 10, bottom: 30 }}
            data={data}
            seriesName="MSFT"
            xScale={xScale}
            xAccessor={xAccessor}
            displayXAccessor={displayXAccessor}
            xExtents={xExtents}
          >
            <Chart id={1} yExtents={d => [d.high, d.low]}>
              <YAxis axisAt="right" orient="right" ticks={5} tickStroke="#E0E0E0" stroke="#E0E0E0" />
              <XAxis axisAt="bottom" orient="bottom" ticks={6} tickStroke="#E0E0E0" stroke="#E0E0E0" />
              <CandlestickSeries />
              <OHLCTooltip origin={[0, 0]} />
            </Chart>
            <Chart id={2} height={100} yExtents={d => d.volume} origin={(w, h) => [0, h - 100]}>
              <BarSeries yAccessor={d => d.volume} fill={d => (d.close > d.open ? "#d32f2f" : "#1976d2")} />
            </Chart>
          </ChartCanvas>
        </div>
        
        {/* ✨ 2. 누락되었던 오른쪽 주문 패널 코드를 다시 추가합니다. */}
        <aside className="order-panel">
          <div className="widget">
            <h3 className="order-title">주식 주문</h3>
            <div className="stock-id">
              <div className="stock-logo-small"></div>
              <span>삼성전자</span>
            </div>
            <div className="order-tabs">
              <button onClick={() => setOrderType("buy")} className={orderType === "buy" ? "active" : ""}>매수</button>
              <button onClick={() => setOrderType("sell")} className={orderType === "sell" ? "active" : ""}>매도</button>
            </div>
            <div className="order-book">
              {orderBookData.sell.slice(0).reverse().map((o) => (
                <div key={o.price} className="order-row sell"><span>{o.price.toLocaleString()}</span> <span>{o.volume.toLocaleString()}</span></div>
              ))}
              <div className="divider"></div>
              {orderBookData.buy.map((o) => (
                <div key={o.price} className="order-row buy"><span>{o.price.toLocaleString()}</span> <span>{o.volume.toLocaleString()}</span></div>
              ))}
            </div>
            <div className="order-form">
              <div className="form-group"><label>가격</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)}/></div>
              <div className="form-group"><label>수량</label><input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}/></div>
            </div>
            <div className="order-summary">
              <div><span>총액</span> <span className="total-amount">{(price * quantity).toLocaleString()} 원</span></div>
            </div>
            <button className={`order-button ${orderType}`}>{orderType === "buy" ? "매수" : "매도"}</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AllStocks;