import React, { useState } from "react";
import "./AllStocks.css";

// --- react-financial-charts 관련 import ---
import { ChartCanvas, Chart } from "react-financial-charts";
import { XAxis, YAxis } from "react-financial-charts";
import { discontinuousTimeScaleProvider } from "react-financial-charts";
import { HoverTooltip } from "react-financial-charts";
import { BarSeries, CandlestickSeries, LineSeries } from "react-financial-charts";
import { sma } from "@react-financial-charts/indicators";
import { last } from "react-financial-charts";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

// --- Mock Data 생성 및 가공 ---
const generateMockData = (count) => {
  const data = [];
  let date = new Date(2025, 7, 1);
  let close = 80000;
  for (let i = 0; i < count; i++) {
    date.setDate(date.getDate() + 1);
    const open = close + (Math.random() - 0.5) * 2000;
    const high = Math.max(open, close) + Math.random() * 1000;
    const low = Math.min(open, close) - Math.random() * 1000;
    close = low + Math.random() * (high - low);
    const volume = 1000000 + Math.random() * 2000000;
    data.push({ date: new Date(date), open, high, low, close, volume });
  }
  return data;
};

const initialData = generateMockData(120);

// 이동평균선(SMA) 계산
const sma5 = sma().options({ windowSize: 5, stroke: "#6BA583" }).merge((d, c) => { d.sma5 = c; }).accessor(d => d.sma5);
const sma20 = sma().options({ windowSize: 20, stroke: "#FFC658" }).merge((d, c) => { d.sma20 = c; }).accessor(d => d.sma20);
const sma60 = sma().options({ windowSize: 60, stroke: "#E4B3B3" }).merge((d, c) => { d.sma60 = c; }).accessor(d => d.sma60);
const calculatedData = sma60(sma20(sma5(initialData)));

const orderBookData = {
  sell: [ { price: 89900, volume: 162526 }, { price: 89800, volume: 91322 }, { price: 89700, volume: 72141 }, ],
  buy: [ { price: 89500, volume: 81236 }, { price: 89400, volume: 274223 }, { price: 89300, volume: 265939 }, ],
};

// 커스텀 툴팁 컴포넌트
const StockTooltip = ({ currentItem }) => {
  if (!currentItem) return null;
  
  const ohlcFormat = format(",.0f");
  const percentFormat = format("+.2%");
  const volumeFormat = format(".4s");
  const dateFormat = timeFormat("%Y.%m.%d(%a)");

  const getChangeInfo = (current, previous) => {
    if (!previous) return { percent: 0, colorClass: 'neutral' };
    const change = current - previous;
    const percent = change / previous;
    const colorClass = change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
    return { percent, colorClass };
  };

  const openChange = getChangeInfo(currentItem.open, currentItem.close);
  const highChange = getChangeInfo(currentItem.high, currentItem.close);
  const lowChange = getChangeInfo(currentItem.low, currentItem.close);
  const closeChange = getChangeInfo(currentItem.close, currentItem.open);
  
  return (
    <div className="stock-tooltip">
      <div className="tooltip-row"><strong>{dateFormat(currentItem.date)}</strong></div>
      <div className="tooltip-row"><span className="label">시가</span><span className={openChange.colorClass}>{ohlcFormat(currentItem.open)} ({percentFormat(openChange.percent)})</span></div>
      <div className="tooltip-row"><span className="label">고가</span><span className={highChange.colorClass}>{ohlcFormat(currentItem.high)} ({percentFormat(highChange.percent)})</span></div>
      <div className="tooltip-row"><span className="label">저가</span><span className={lowChange.colorClass}>{ohlcFormat(currentItem.low)} ({percentFormat(lowChange.percent)})</span></div>
      <div className="tooltip-row"><span className="label">종가</span><span className={closeChange.colorClass}>{ohlcFormat(currentItem.close)} ({percentFormat(closeChange.percent)})</span></div>
      <div className="tooltip-row"><span className="label">거래량</span><span>{volumeFormat(currentItem.volume).replace("G", "B")}</span></div>
    </div>
  );
};

const AllStocks = () => {
  const [orderType, setOrderType] = useState("buy");
  const [price, setPrice] = useState(89500);
  const [quantity, setQuantity] = useState(0);

  const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => d.date);
  const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(calculatedData);
  const [xExtents, setXExtents] = useState([xAccessor(last(data)), xAccessor(data[data.length - 80])]);

  const latestData = data[data.length - 1];
  const prevData = data[data.length - 2];
  const getChangeInfo = (current, previous) => {
    const change = current - previous;
    const percent = (change / previous) * 100;
    const colorClass = change > 0 ? 'positive' : (change < 0 ? 'negative' : 'neutral');
    return { value: ohlcFormat(current), percent: `(${percent.toFixed(2)}%)`, colorClass };
  };
  const ohlcFormat = format(",.0f");
  const o = getChangeInfo(latestData.open, prevData.close);
  const h = getChangeInfo(latestData.high, prevData.close);
  const l = getChangeInfo(latestData.low, prevData.close);
  const c = getChangeInfo(latestData.close, prevData.close);
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][latestData.date.getDay()];

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
          <div className="chart-info-header detailed">
            <span>{timeFormat("%Y.%m.%d")(latestData.date)}({dayOfWeek})</span>
            <span className={o.colorClass}>시 {o.value} {o.percent}</span>
            <span className={h.colorClass}>고 {h.value} {h.percent}</span>
            <span className={l.colorClass}>저 {l.value} {l.percent}</span>
            <span className={c.colorClass}>종 {c.value} {c.percent}</span>
          </div>
          <ChartCanvas
            height={450}
            ratio={window.devicePixelRatio}
            width={700}
            margin={{ left: 10, right: 70, top: 10, bottom: 30 }}
            data={data}
            seriesName="Stock"
            xScale={xScale}
            xAccessor={xAccessor}
            displayXAccessor={displayXAccessor}
            xExtents={xExtents}
            panEvent={true}
            clamp={true}
            zoomEvent={false}
          >
            <Chart id={1} height={300} yExtents={d => [d.high, d.low]}>
              <YAxis axisAt="right" orient="right" ticks={5} tickFormat={format(",d")} tickStroke="#E0E0E0" stroke="#E0E0E0" />
              <XAxis axisAt="bottom" orient="bottom" ticks={6} tickFormat={timeFormat("%m-%d")} tickStroke="#E0E0E0" stroke="#E0E0E0" />
              <CandlestickSeries wickStroke={d => (d.close > d.open ? "#d32f2f" : "#1976d2")} fill={d => (d.close > d.open ? "#d32f2f" : "#1976d2")} />
              <LineSeries yAccessor={sma5.accessor()} stroke={sma5.stroke()} />
              <LineSeries yAccessor={sma20.accessor()} stroke={sma20.stroke()} />
              <LineSeries yAccessor={sma60.accessor()} stroke={sma60.stroke()} />
              <HoverTooltip yAccessor={d => d.close} tooltipContent={StockTooltip} fontSize={15} />
            </Chart>
            <Chart id={2} height={100} yExtents={d => d.volume} origin={(w, h) => [0, h - 100]}>
              <BarSeries yAccessor={d => d.volume} fill={d => (d.close > d.open ? "rgba(211, 47, 47, 0.4)" : "rgba(25, 118, 210, 0.4)")} />
            </Chart>
          </ChartCanvas>
        </div>
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
              <div className="form-group"><label>가격</label><input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))}/></div>
              <div className="form-group"><label>수량</label><input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}/></div>
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
