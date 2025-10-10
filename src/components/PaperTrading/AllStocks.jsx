import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import * as echarts from "echarts";
import "./AllStocks.css";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

// --- Mock Data 생성 ---
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

// 단순 이동평균선 계산
const calculateSMA = (data, windowSize) => {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < windowSize) {
      result.push("-");
      continue;
    }
    const sum = data
      .slice(i - windowSize, i)
      .reduce((acc, cur) => acc + cur.close, 0);
    result.push((sum / windowSize).toFixed(2));
  }
  return result;
};

const AllStocks = () => {
  const [orderType, setOrderType] = useState("buy");
  const [price, setPrice] = useState(89500);
  const [quantity, setQuantity] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // ✅ 데이터 생성 및 가공
  const data = useMemo(() => generateMockData(150), []);
  const dates = data.map((d) => d.date.toISOString().slice(0, 10));
  const values = data.map((d) => [d.open, d.close, d.low, d.high]);
  const volumes = data.map((d) => d.volume);

  const sma5 = useMemo(() => calculateSMA(data, 5), [data]);
  const sma20 = useMemo(() => calculateSMA(data, 20), [data]);
  const sma60 = useMemo(() => calculateSMA(data, 60), [data]);

  const latestData = data[data.length - 1];
  const prevData = data[data.length - 2];
  const change = latestData.close - prevData.close;
  const changePct = ((change / prevData.close) * 100).toFixed(2);
  const colorClass = change > 0 ? "positive" : change < 0 ? "negative" : "neutral";

  const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][latestData.date.getDay()];

  /** ✅ 차트 초기화 및 업데이트 */
  useEffect(() => {
    if (!chartRef.current) return;

    // 차트 초기화 (기존 인스턴스 파괴 후 새로 생성)
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }
    chartInstance.current = echarts.init(chartRef.current);

    const option = {
      backgroundColor: "transparent",
      animation: true,
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
        backgroundColor: "rgba(0,0,0,0.6)",
        borderWidth: 0,
        textStyle: { color: "#fff" },
      },
      grid: [
        { left: 40, right: 60, top: 20, height: 250 },
        { left: 40, right: 60, top: 290, height: 60 },
      ],
      xAxis: [
        {
          type: "category",
          data: dates,
          scale: true,
          boundaryGap: false,
          axisLine: { lineStyle: { color: "#ccc" } },
          splitLine: { show: false },
          min: "dataMin",
          max: "dataMax",
        },
        {
          type: "category",
          gridIndex: 1,
          data: dates,
          axisLine: { lineStyle: { color: "#ccc" } },
          axisTick: { show: false },
          axisLabel: { show: false },
          splitLine: { show: false },
        },
      ],
      yAxis: [
        {
          scale: true,
          axisLine: { lineStyle: { color: "#ccc" } },
          splitLine: { show: true, lineStyle: { color: "#eee" } },
        },
        {
          gridIndex: 1,
          splitNumber: 3,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          splitLine: { show: false },
        },
      ],
      dataZoom: [
        { type: "inside", xAxisIndex: [0, 1], start: 50, end: 100 },
        { show: false, type: "slider", xAxisIndex: [0, 1], top: "95%", start: 50, end: 100 },
      ],
      series: [
        {
          name: "캔들차트",
          type: "candlestick",
          data: values,
          itemStyle: {
            color: "#d32f2f",
            color0: "#1976d2",
            borderColor: "#d32f2f",
            borderColor0: "#1976d2",
          },
        },
        {
          name: "SMA5",
          type: "line",
          data: sma5,
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 1.5, color: "#6BA583" },
        },
        {
          name: "SMA20",
          type: "line",
          data: sma20,
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 1, color: "#FFC658" },
        },
        {
          name: "SMA60",
          type: "line",
          data: sma60,
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 1, color: "#E4B3B3" },
        },
        {
          name: "거래량",
          type: "bar",
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: volumes,
          itemStyle: {
            color: (params) => {
              const [open, close] = values[params.dataIndex];
              return close > open ? "rgba(211,47,47,0.4)" : "rgba(25,118,210,0.4)";
            },
          },
        },
      ],
    };

    chartInstance.current.setOption(option);

    const handleResize = () => chartInstance.current.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current.dispose();
    };
  }, [data, sma5, sma20, sma60, dates, values, volumes]);

  /** 관심 토글 */
  const handleToggleFavorite = useCallback(() => {
    setIsFavorite((prev) => !prev);
    alert(isFavorite ? "관심 종목에서 해제되었습니다." : "관심 종목으로 추가되었습니다!");
  }, [isFavorite]);

  return (
    <div className="all-stocks-container">
      <div className="stock-page-header">
        <input type="text" placeholder="종목명 또는 코드를 검색하세요." className="global-stock-search" />
      </div>

      <div className="stock-detail-grid">
        <div className="chart-section widget">
          <div className="widget-header">
            <div className="stock-title-container">
              <h3>삼성전자</h3>
              <button onClick={handleToggleFavorite} className="favorite-toggle-btn">
                {isFavorite ? <AiFillHeart className="is-favorite" /> : <AiOutlineHeart />}
              </button>
            </div>
            <div className="chart-tabs">
              <button className="active">1일</button><button>1주</button><button>1달</button>
            </div>
          </div>

          <div className="chart-info-header detailed">
            <span>{latestData.date.toISOString().slice(0, 10)}({dayOfWeek})</span>
            <span className={colorClass}>
              종가 {latestData.close.toLocaleString()} ({changePct}%)
            </span>
          </div>

          {/* ✅ Apache ECharts 차트 */}
          <div ref={chartRef} style={{ width: "100%", height: 450 }}></div>
        </div>

        {/* ✅ 주문창은 그대로 유지 */}
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
            <div className="order-form">
              <div className="form-group">
                <label>가격</label>
                <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
              </div>
              <div className="form-group">
                <label>수량</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
              </div>
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
