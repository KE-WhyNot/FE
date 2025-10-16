// src/pages/AllStocks/AllStocksDetail.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import * as echarts from "echarts";
import "./AllStocks.css";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import financeAxios from "../../api/financeAxiosInstance";
import useAuthStore from "../../store/useAuthStore"; // ✅ 로그인 유저 불러오기

// ✅ 단순 이동평균선 계산 함수
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

const AllStocksDetail = () => {
  const { stockId } = useParams();
  const { user } = useAuthStore(); // ✅ 로그인 유저
  const userId = user?.id ?? user?.userId ?? "guest"; // ✅ fallback 추가
  const headers = useMemo(() => ({ "X-User-Id": userId }), [userId]); // ✅ 모든 요청에서 재사용

  const [data, setData] = useState([]);
  const [stockInfo, setStockInfo] = useState(null);
  const [period, setPeriod] = useState("minute");
  const [orderType, setOrderType] = useState("buy");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [livePrice, setLivePrice] = useState(0);
  const [liveChange, setLiveChange] = useState(0);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [openingPrice, setOpeningPrice] = useState(0);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  /** ✅ 종목 정보 불러오기 */
  useEffect(() => {
    const fetchStockInfo = async () => {
      try {
        const res = await financeAxios.get(`/api/stock/list/${stockId}`, { headers });
        setStockInfo(res.data?.result);
      } catch (error) {
        console.error("❌ 종목 정보 불러오기 실패:", error);
      }
    };
    if (userId) fetchStockInfo();
  }, [stockId, headers, userId]);

  /** ✅ 현재가 및 시가 불러오기 */
  useEffect(() => {
    const fetchCurrentPrice = async () => {
      try {
        const res = await financeAxios.post(
          `/api/stock/current-price`,
          { marketCode: "J", stockCode: stockId },
          { headers }
        );
        const result = res.data?.result;
        const current = result?.stckPrpr || 0;
        const open = result?.stckOprc || 0;
        setPrice(current);
        setLivePrice(current);
        setOpeningPrice(Number(open));
      } catch (error) {
        console.error("❌ 현재가/시가 불러오기 실패:", error);
      }
    };
    if (userId) fetchCurrentPrice();
  }, [stockId, headers, userId]);

  /** ✅ 실시간 등락률 계산 */
  useEffect(() => {
    if (livePrice > 0 && openingPrice > 0) {
      const changePercentage = ((livePrice - openingPrice) / openingPrice) * 100;
      setLiveChange(changePercentage);
    }
  }, [livePrice, openingPrice]);

  /** ✅ 차트 데이터 불러오기 */
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        const res = await financeAxios.get(`/api/stock/chart/${stockId}/${period}`, { headers });
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
      } catch (error) {
        console.error("❌ 차트 데이터 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchStockData();
  }, [stockId, period, headers, userId]);

  /** ✅ 관심 종목 여부 확인 */
  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const res = await financeAxios.get(
          `/api/user/interest-stocks/check?stockId=${stockId}`,
          { headers }
        );
        setIsFavorite(res.data?.result === true);
      } catch (error) {
        console.error("❌ 관심 종목 확인 실패:", error);
      }
    };
    if (userId) checkFavorite();
  }, [stockId, headers, userId]);

  /** ✅ 잔고 불러오기 */
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await financeAxios.get(`/api/user/balance`, { headers });
        setBalance(res.data?.result?.balance || 0);
      } catch (error) {
        console.error("❌ 잔고 불러오기 실패:", error);
      }
    };
    if (userId) fetchBalance();
  }, [headers, userId]);

  /** ✅ 관심 토글 */
  const handleToggleFavorite = useCallback(async () => {
    try {
      if (isFavorite) {
        await financeAxios.delete("/api/user/interest-stocks", {
          data: { stockId },
          headers,
        });
        setIsFavorite(false);
        alert("관심 종목에서 해제되었습니다.");
      } else {
        await financeAxios.post("/api/user/interest-stocks", { stockId }, { headers });
        setIsFavorite(true);
        alert("관심 종목에 추가되었습니다!");
      }
    } catch (error) {
      console.error("❌ 관심 종목 변경 실패:", error);
      alert("관심 종목 처리 중 오류가 발생했습니다.");
    }
  }, [isFavorite, stockId, headers]);

  /** ✅ SMA 계산 */
  const sma5 = useMemo(() => calculateSMA(data, 5), [data]);
  const sma20 = useMemo(() => calculateSMA(data, 20), [data]);
  const dates = data.map((d) => (period === "minute" ? `${d.date} ${d.time}` : d.date));
  const values = data.map((d) => [d.open, d.close, d.low, d.high]);
  const volumes = data.map((d) => d.volume);

  const latestData = data[data.length - 1];
  const prevData = data[data.length - 2] || latestData;
  const change = latestData ? latestData.close - prevData.close : 0;
  const changePct = prevData?.close ? ((change / prevData.close) * 100).toFixed(2) : "0.00";
  const colorClass = change > 0 ? "positive" : change < 0 ? "negative" : "neutral";
  const dayOfWeek = latestData
    ? ["일", "월", "화", "수", "목", "금", "토"][new Date(latestData.date).getDay()]
    : "";

  /** ✅ 차트 렌더링 */
  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;
    if (chartInstance.current) chartInstance.current.dispose();
    chartInstance.current = echarts.init(chartRef.current);

    const option = {
      backgroundColor: "transparent",
      tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
      grid: [
        { left: 40, right: 60, top: 20, height: 250 },
        { left: 40, right: 60, top: 290, height: 60 },
      ],
      xAxis: [
        { type: "category", data: dates, boundaryGap: false, axisLine: { lineStyle: { color: "#ccc" } } },
        { type: "category", gridIndex: 1, data: dates, show: false },
      ],
      yAxis: [
        { scale: true, splitLine: { lineStyle: { color: "#eee" } } },
        { gridIndex: 1, show: false },
      ],
      dataZoom: [
        { type: "inside", xAxisIndex: [0, 1], start: 80, end: 100, filterMode: "weakFilter" },
        { type: "slider", xAxisIndex: [0, 1], start: 80, end: 100, height: 20, bottom: 10, showDetail: false },
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

  /** ✅ 매수 / 매도 요청 */
  const handleOrder = async () => {
    if (!quantity || quantity <= 0) return alert("수량을 입력하세요.");
    const endpoint =
      orderType === "buy"
        ? "/api/user/trading/buy"
        : "/api/user/trading/sell";

    try {
      const res = await financeAxios.post(
        endpoint,
        { stockId, marketCode: "J", quantity },
        { headers }
      );

      if (res.data?.code === "COMMON200") {
        alert(`${orderType === "buy" ? "매수" : "매도"} 주문이 완료되었습니다.`);
      } else {
        alert("요청은 완료되었지만 응답 코드가 예상과 다릅니다.");
      }
    } catch (error) {
      console.error("❌ 주문 실패:", error);
      alert("주문 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="all-stocks-container">
      {loading || !stockInfo ? (
        <p className="loading-text">데이터 불러오는 중...</p>
      ) : (
        <div className="stock-detail-grid">
          <div className="chart-section widget">
            <div className="widget-header">
              <div className="stock-title-container">
                {stockInfo.stockImage && (
                  <img
                    src={stockInfo.stockImage}
                    alt={`${stockInfo.stockName} 로고`}
                    className="stock-logo-icon"
                  />
                )}
                <h3>
                  {stockInfo.stockName} ({stockInfo.stockId})
                </h3>
                <button
                  onClick={handleToggleFavorite}
                  className="favorite-toggle-btn"
                >
                  {isFavorite ? (
                    <AiFillHeart className="is-favorite" />
                  ) : (
                    <AiOutlineHeart />
                  )}
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

              <div className="balance-display">
                내 잔고: <strong>{balance.toLocaleString()} 원</strong>
              </div>

              <div className="order-form">
                <div className="form-group">
                  <label>가격</label>
                  <input type="number" value={price} readOnly />
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

              <button
                className={`order-button ${orderType}`}
                onClick={handleOrder}
              >
                {orderType === "buy" ? "매수" : "매도"}
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default AllStocksDetail;
