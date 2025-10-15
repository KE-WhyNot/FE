import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import * as echarts from "echarts";
import "./AllStocks.css";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import financeAxios from "../../api/financeAxiosInstance";

// --- 단순 이동평균선 계산 ---
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
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [livePrice, setLivePrice] = useState(0);
  const [liveChange, setLiveChange] = useState(0);
  const [period, setPeriod] = useState("minute"); // ✅ 분 / 일 / 월 / 년
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const stockId = "005930"; // 삼성전자

  /** ✅ API 호출 */
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        const res = await financeAxios.get(`/api/stock/chart/${stockId}/${period}`);
        const candles = res.data?.result?.candles || [];

        const parsed = candles.map((c) => ({
          date: c.date,
          time: c.time || "",
          open: Number(c.open),
          close: Number(c.close),
          low: Number(c.low),
          high: Number(c.high),
          volume: Number(c.volume),
        }));

        const sorted = [...parsed].sort((a, b) => new Date(a.date) - new Date(b.date));
        setData(sorted);
        setPrice(sorted[sorted.length - 1]?.close || 0);
        setLivePrice(sorted[sorted.length - 1]?.close || 0);
      } catch (error) {
        console.error("❌ 주식 데이터 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStockData();
  }, [stockId, period]);

  /** SMA 계산 */
  const sma5 = useMemo(() => calculateSMA(data, 5), [data]);
  const sma20 = useMemo(() => calculateSMA(data, 20), [data]);
  const sma60 = useMemo(() => calculateSMA(data, 60), [data]);

  const dates = data.map((d) => (period === "minute" ? `${d.date} ${d.time}` : d.date));
  const values = data.map((d) => [d.open, d.close, d.low, d.high]);
  const volumes = data.map((d) => d.volume);

  const latestData = data[data.length - 1];
  const prevData = data[data.length - 2] || latestData;
  const change = latestData ? latestData.close - prevData.close : 0;
  const changePct = prevData?.close ? ((change / prevData.close) * 100).toFixed(2) : "0.00";
  const colorClass = change > 0 ? "positive" : change < 0 ? "negative" : "neutral";
  const dayOfWeek = latestData
    ? ["일", "월", "화", "수", "목", "금", "토"][
        new Date(latestData.date).getDay()
      ]
    : "";

  /** ✅ 차트 렌더링 */
  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    if (chartInstance.current) chartInstance.current.dispose();
    chartInstance.current = echarts.init(chartRef.current);

    const option = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
        backgroundColor: "#fff",
        borderColor: "#ddd",
        borderWidth: 1,
        textStyle: { color: "#333", fontSize: 12 },
        formatter: function (params) {
          // params에서 '캔들차트'를 우선 찾습니다.
          const candle = params.find((p) => p.seriesName === "캔들차트");
          const sma5P = params.find((p) => p.seriesName === "SMA5");
          const sma20P = params.find((p) => p.seriesName === "SMA20");

          if (!candle || !Array.isArray(candle.value)) return "";

          const index = candle.dataIndex; 
          const volumeValue = volumes[index];
          
          const [, open, close, low, high] = candle.value.map(Number);
          const date = candle.axisValue;

          const fmt = (n) =>
            (typeof n === "number" ? n : Number(n)).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            });

          return `
            <div style="padding:8px 10px;">
              <div style="font-weight:600; margin-bottom:6px;">${date}</div>
              <div>📈 시가: ${fmt(open)}</div>
              <div>📉 종가: ${fmt(close)}</div>
              <div>🔺 고가: ${fmt(high)}</div>
              <div>🔻 저가: ${fmt(low)}</div>
              ${volumeValue !== undefined ? `<div>📊 거래량: ${fmt(volumeValue)}</div>` : ""}

              ${sma5P?.data && sma5P.data !== "-" ? `<div style="color:#6BA583; margin-top:6px;">SMA5: ${fmt(sma5P.data)}</div>` : ""}
              ${sma20P?.data && sma20P.data !== "-" ? `<div style="color:#FFC658;">SMA20: ${fmt(sma20P.data)}</div>` : ""}
            </div>
          `;
        },
      },
      grid: [
        { left: 40, right: 60, top: 20, height: 250 },
        { left: 40, right: 60, top: 290, height: 60 },
      ],
      xAxis: [
        {
          type: "category",
          data: dates,
          boundaryGap: false,
          axisLine: { lineStyle: { color: "#ccc" } },
          axisLabel: {
            formatter: function (val) {
              return period === "minute" ? val.slice(5) : val;
            },
          },
        },
        { type: "category", gridIndex: 1, data: dates, show: false },
      ],
      yAxis: [
        { scale: true, splitLine: { lineStyle: { color: "#eee" } } },
        { gridIndex: 1, show: false },
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
          name: "거래량",
          type: "bar",
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: volumes,
          itemStyle: {
            color: (params) => {
              const close = values[params.dataIndex][1];
              const open = values[params.dataIndex][0];
              return close > open
                ? "rgba(211,47,47,0.4)"
                : "rgba(25,118,210,0.4)";
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
      chartInstance.current?.dispose();
    };
  }, [data, sma5, sma20, period]);

  /** 관심 토글 */
  const handleToggleFavorite = useCallback(() => {
    setIsFavorite((prev) => !prev);
    alert(isFavorite ? "관심 종목에서 해제되었습니다." : "관심 종목으로 추가되었습니다!");
  }, [isFavorite]);

  const sellOrders = [92700, 92600, 92500, 92400, 92300];
  const buyOrders = [92200, 92100, 92000, 91900, 91800];

  return (
    <div className="all-stocks-container">
      <div className="stock-page-header">
        <input
          type="text"
          placeholder="종목명 또는 코드를 검색하세요."
          className="global-stock-search"
        />
      </div>

      {loading ? (
        <p className="loading-text">데이터 불러오는 중...</p>
      ) : (
        <div className="stock-detail-grid">
          <div className="chart-section widget">
            <div className="widget-header">
              <div className="stock-title-container">
                <h3>삼성전자 (005930)</h3>
                <button onClick={handleToggleFavorite} className="favorite-toggle-btn">
                  {isFavorite ? <AiFillHeart className="is-favorite" /> : <AiOutlineHeart />}
                </button>
              </div>
              <div className="chart-tabs">
                {["minute", "daily", "monthly", "yearly"].map((p) => (
                  <button
                    key={p}
                    className={period === p ? "active" : ""}
                    onClick={() => setPeriod(p)}
                  >
                    {p === "minute"
                      ? "분"
                      : p === "daily"
                      ? "일"
                      : p === "monthly"
                      ? "월"
                      : "년"}
                  </button>
                ))}
              </div>
            </div>

            <div className="chart-info-header detailed">
              <span>
                {latestData?.date}({dayOfWeek})
              </span>
              <span className={colorClass}>
                종가 {latestData?.close?.toLocaleString()} ({changePct}%)
              </span>
              <span className={liveChange >= 0 ? "positive" : "negative"}>
                현재가 {livePrice.toLocaleString()}원 ({liveChange.toFixed(2)}%)
              </span>
            </div>

            <div ref={chartRef} style={{ width: "100%", height: 450 }}></div>
          </div>

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
                {sellOrders.map((p, i) => (
                  <div key={i} className="order-row sell">
                    <span>매도 {5 - i}</span>
                    <span>{p.toLocaleString()}원</span>
                  </div>
                ))}
                <div className="divider"></div>
                {buyOrders.map((p, i) => (
                  <div key={i} className="order-row buy">
                    <span>매수 {i + 1}</span>
                    <span>{p.toLocaleString()}원</span>
                  </div>
                ))}
              </div>

              <div className="order-form">
                <div className="form-group">
                  <label>가격</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>수량</label>
                  <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(0, Number(e.target.value)))
                    }
                  />
                </div>
              </div>

              <div className="order-summary">
                <div>
                  <span>총액</span>
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
      )}
    </div>
  );
};

export default AllStocks;
