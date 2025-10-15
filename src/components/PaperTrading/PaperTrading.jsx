import React, { useState, useEffect } from "react";
import "./PaperTrading.css";
import { ResponsiveLine } from "@nivo/line";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import Modal from "../../components/common/Modal";
import financeAxios from "../../api/financeAxiosInstance";
import useAuthStore from "../../store/useAuthStore";

// ✅ 날짜 포맷 함수 (ISO → yyyy-MM-dd HH:mm)
const formatDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${hh}:${mm}`;
};

// ✅ 커스텀 툴팁
const CustomTooltip = ({ info, position }) => {
  if (!info) return null;

  const tooltipWidth = 180;
  const tooltipHeight = 110;
  let left = position.x + 40;
  let top = position.y - tooltipHeight - 10;

  if (left + tooltipWidth > window.innerWidth) left -= tooltipWidth + 40;
  if (top < 0) top = position.y + 20;

  return (
    <div
      style={{
        position: "fixed",
        top,
        left,
        background: "rgba(0,0,0,0.85)",
        color: "#fff",
        padding: "10px 14px",
        borderRadius: "8px",
        fontSize: "13px",
        lineHeight: "1.6",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div>📅 <strong>날짜:</strong> {info.date}</div>
      <div>💰 <strong>현재가:</strong> {parseFloat(info.currentPrice).toLocaleString()}</div>
      <div>📈 <strong>최고가:</strong> {parseFloat(info.highPrice).toLocaleString()}</div>
      <div>📉 <strong>최저가:</strong> {parseFloat(info.lowPrice).toLocaleString()}</div>
      <div>📊 <strong>거래량:</strong> {parseInt(info.volume).toLocaleString()}</div>
    </div>
  );
};

const PaperTrading = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // ✅ 상태 정의
  const [activeMarket, setActiveMarket] = useState("KOSPI");
  const [activePeriod, setActivePeriod] = useState("daily");
  const [chartData, setChartData] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [ranking, setRanking] = useState([]);
  const [tooltipInfo, setTooltipInfo] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [isWatchlistModalOpen, setWatchlistModalOpen] = useState(false);
  const [isTransactionsModalOpen, setTransactionsModalOpen] = useState(false);
  const [isHoldingsModalOpen, setHoldingsModalOpen] = useState(false);
  const [isRankingModalOpen, setRankingModalOpen] = useState(false);

  // ✅ 관심 종목
  const [watchlist, setWatchlist] = useState([]);
  const [watchlistPage, setWatchlistPage] = useState(1);
  const [watchlistHasNext, setWatchlistHasNext] = useState(false);

  // ✅ 거래 내역
  const [transactions, setTransactions] = useState([]);

  // ✅ 금융 데이터 불러오기
  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      try {
        const indexCode = activeMarket === "KOSPI" ? "0001" : "1001";
        const url = `/api/stock/chart/index/${indexCode}/${activePeriod}`;
        const res = await financeAxios.get(url);
        const candles = res.data?.result?.candles || [];

        const formattedData = [
          {
            id: activeMarket,
            data: candles
              .map((item) => ({
                x: item.date,
                y: parseFloat(item.currentPrice),
                original: item,
              }))
              .reverse(),
          },
        ];

        const prices = candles.map((c) => parseFloat(c.currentPrice));
        const summaryData = {
          high: Math.max(...candles.map((c) => parseFloat(c.highPrice))).toLocaleString(),
          low: Math.min(...candles.map((c) => parseFloat(c.lowPrice))).toLocaleString(),
          close: prices[0]?.toLocaleString(),
          start: prices[prices.length - 1]?.toLocaleString(),
        };

        setChartData(formattedData);
        setSummary(summaryData);
      } catch (e) {
        console.error("❌ 차트 데이터 로드 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketData();
  }, [activeMarket, activePeriod]);

// ✅ 관심 종목 불러오기
const fetchWatchlist = async () => {
  try {
    const userId = user?.id ?? user?.userId ?? "guest";

    // 1️⃣ 기본 관심 종목 리스트 가져오기
    const res = await financeAxios.get("/api/user/interest-stocks", {
      headers: { "X-User-Id": userId },
    });

    const baseList = res.data?.result || [];

    // 2️⃣ 각 종목의 이미지 정보 요청
    const enrichedList = await Promise.all(
      baseList.map(async (item) => {
        try {
          const detailRes = await financeAxios.get(
            `/api/stock/list/${item.stockId}`,
            { headers: { "X-User-Id": userId } }
          );
          const detail = detailRes.data?.result;
          return {
            ...item,
            stockImage: detail?.stockImage || null,
          };
        } catch (err) {
          console.warn(`⚠️ 종목 ${item.stockId} 이미지 로드 실패`, err);
          return { ...item, stockImage: null };
        }
      })
    );

    // 3️⃣ 최신순 정렬
    const sorted = enrichedList.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setWatchlist(sorted);
    setWatchlistHasNext(sorted.length >= 10);
  } catch (e) {
    console.error("❌ 관심 종목 불러오기 실패:", e);
  }
};



  useEffect(() => {
    fetchWatchlist();
  }, []);

  // ✅ 수익률 랭킹 불러오기
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await financeAxios.get("/api/user/profit-ranking");
        const ranks = res.data?.result || [];
        setRanking(ranks);
      } catch (e) {
        console.error("❌ 수익률 랭킹 로드 실패:", e);
      }
    };
    fetchRanking();
  }, []);

  // ✅ 거래 내역 불러오기
  const fetchTransactions = async () => {
    try {
      const res = await financeAxios.get("/api/user/trading/history");
      let list = res.data?.result || [];
      list = list.sort((a, b) => new Date(b.executedAt) - new Date(a.executedAt));
      setTransactions(list);
    } catch (e) {
      console.error("❌ 거래 내역 불러오기 실패:", e);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ✅ X축 포맷
  const formatXAxisDate = (dateStr) => {
    if (!dateStr) return "";
    return `${dateStr.slice(4, 6)}/${dateStr.slice(6, 8)}`;
  };

  const getTickValues = (data) => {
    if (!data || data.length === 0) return [];
    const step = Math.ceil(data.length / 6);
    return data.filter((_, i) => i % step === 0).map((d) => d.x);
  };

  return (
    <div className="paper-trading-container">
      {/* 헤더 */}
      <div className="dashboard-header">
        <h2>내 주식</h2>
        <div className="header-actions">
          <input type="text" placeholder="주식 검색" className="stock-search" />
        </div>
      </div>

      {/* ✅ 3열 2행 그리드 */}
      <div className="dashboard-grid-three">
        {/* --- 첫 번째 줄 --- */}
        <div className="row-grid">
          {/* --- 차트 --- */}
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
              </div>
              <div className="chart-tabs">
                <button
                  className={activePeriod === "daily" ? "active" : ""}
                  onClick={() => setActivePeriod("daily")}
                >
                  일
                </button>
                <button
                  className={activePeriod === "weekly" ? "active" : ""}
                  onClick={() => setActivePeriod("weekly")}
                >
                  주
                </button>
                <button
                  className={activePeriod === "monthly" ? "active" : ""}
                  onClick={() => setActivePeriod("monthly")}
                >
                  월
                </button>
              </div>
            </div>

            <div
              className="line-chart-container"
              onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setTooltipInfo(null)}
            >
              {loading ? (
                <p className="loading-text">데이터 불러오는 중...</p>
              ) : chartData.length > 0 ? (
                <ResponsiveLine
                  data={chartData}
                  margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                  xScale={{ type: "point" }}
                  yScale={{ type: "linear", min: "auto", max: "auto" }}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    tickValues: getTickValues(chartData[0].data),
                    format: (v) => formatXAxisDate(v),
                  }}
                  axisLeft={{ tickSize: 5, tickPadding: 5 }}
                  enableGridX={false}
                  colors={["#6e55ff"]}
                  lineWidth={3}
                  curve="monotoneX"
                  pointSize={0}
                  useMesh={true}
                  enableCrosshair={true}
                  crosshairType="x"
                  tooltip={() => null}
                  onMouseMove={(point) => setTooltipInfo(point.data.original)}
                  onMouseLeave={() => setTooltipInfo(null)}
                />
              ) : (
                <p className="loading-text">데이터가 없습니다.</p>
              )}
              <CustomTooltip info={tooltipInfo} position={mousePos} />
            </div>

            <div className="chart-summary">
              <div><span>최고가</span>{summary.high || "-"}</div>
              <div><span>최저가</span>{summary.low || "-"}</div>
              <div><span>장마감</span>{summary.close || "-"}</div>
              <div><span>시작가</span>{summary.start || "-"}</div>
            </div>
          </div>

          {/* --- 관심 종목 --- */}
<div className="widget watchlist-widget">
  <div className="widget-header">
    <h3>관심 종목</h3>
    <button className="add-button" onClick={() => setWatchlistModalOpen(true)}>+</button>
  </div>

  <div className="watchlist-list">
    {watchlist.length > 0 ? (
      watchlist.slice(0, 5).map((stock) => (
        <div key={stock.interestStockId} className="stock-item">
          {stock.stockImage ? (
            <img src={stock.stockImage} alt={stock.stockName} className="stock-logo-img" />
          ) : (
            <div className="stock-logo-fallback">{stock.stockName[0]}</div>
          )}
          <div className="stock-info">
            <span className="stock-name">{stock.stockName}</span>
            <small className="sector-name">{stock.sectorName}</small>
          </div>
        </div>
      ))
    ) : (
      <p className="loading-text">관심 종목이 없습니다.</p>
    )}
  </div>
</div>



          {/* --- 수익률 랭킹 --- */}
          <div className="widget ranking-widget">
            <div className="widget-header">
              <h3>수익률 랭킹</h3>
              <button className="add-button" onClick={() => setRankingModalOpen(true)}>+</button>
            </div>
            <div className="ranking-list">
              {ranking.length > 0 ? (
                ranking.slice(0, 5).map((r, idx) => (
                  <div
                    key={r.userId}
                    className={`ranking-item ${user?.id === r.userId ? "highlight" : ""}`}
                  >
                    <span>{idx + 1}</span>
                    <span>{r.userId}</span>
                    <span className={r.profitRate >= 0 ? "positive" : "negative"}>
                      {r.profitRate.toFixed(2)}%
                    </span>
                  </div>
                ))
              ) : (
                <p className="loading-text">랭킹 데이터 없음</p>
              )}
            </div>
          </div>
        </div>

        {/* --- 두 번째 줄 --- */}
        <div className="row-grid">
          {/* 내 종목 보기 */}
          <div className="widget holdings-widget">
            <div className="widget-header clickable" onClick={() => setHoldingsModalOpen(true)}>
              <h3>내 종목 보기 <IoIosArrowForward /></h3>
            </div>
            <div className="total-assets">
              <h2>0원</h2>
              <span className="neutral">+0원 (0%)</span>
            </div>
          </div>

          {/* 거래 내역 */}
<div className="widget transaction-widget">
  <div className="widget-header">
    <h3>거래 내역</h3>
    <button className="add-button" onClick={() => setTransactionsModalOpen(true)}>+</button>
  </div>

  {transactions.length > 0 ? (
    <div className="transaction-list">
      {transactions.slice(0, 5).map((tx) => {
        const date = new Date(tx.executedAt);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = String(date.getHours()).padStart(2, "0");
        const minute = String(date.getMinutes()).padStart(2, "0");

        const isBuy = tx.executionType === "BUY";
        const sign = isBuy ? "-" : "+";
        const profitClass = isBuy ? "buy" : "sell";

        return (
          <div key={tx.executionId} className={`transaction-item ${profitClass}`}>
            <div className="tx-left">
              <div className="tx-date">{`${month}.${day}`}</div>
              <div className="tx-name">{tx.stockName} {tx.quantity}주</div>
              <div className="tx-subinfo">
                {hour}:{minute} | {isBuy ? "구매" : "판매"}
              </div>
            </div>

            <div className="tx-right">
              <div className={`tx-amount ${profitClass}`}>
                {sign}{tx.totalAmount.toLocaleString()}원
              </div>
              <div className="tx-price">{tx.price.toLocaleString()}원</div>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <p className="loading-text">거래 내역이 없습니다.</p>
  )}
</div>


          {/* 투자 현황 */}
          <div className="widget portfolio-widget">
            <div className="widget-header">
              <h3>투자 현황</h3>
            </div>
            <div className="pie-chart-container">
              <p className="loading-text">포트폴리오 기능 준비 중...</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- 관심종목 모달 --- */}
<Modal
  isOpen={isWatchlistModalOpen}
  onClose={() => setWatchlistModalOpen(false)}
  title="전체 관심 종목"
>
  <div className="watchlist-modal-list">
    {watchlist.length > 0 ? (
      watchlist.slice(0, watchlistPage * 10).map((stock) => (
        <div key={stock.interestStockId} className="stock-item">
          {stock.stockImage ? (
            <img src={stock.stockImage} alt={stock.stockName} className="stock-logo-img" />
          ) : (
            <div className="stock-logo-fallback">{stock.stockName[0]}</div>
          )}
          <div className="stock-info">
            <span className="stock-name">{stock.stockName}</span>
            <small className="sector-name">{stock.sectorName}</small>
          </div>
          <span className="created-date">
            {new Date(stock.createdAt).toLocaleDateString("ko-KR")}
          </span>
        </div>
      ))
    ) : (
      <p className="loading-text">관심 종목이 없습니다.</p>
    )}
    {watchlistHasNext && watchlist.length > watchlistPage * 10 && (
      <button
        className="next-page-button"
        onClick={() => setWatchlistPage((prev) => prev + 1)}
      >
        다음 페이지
      </button>
    )}
  </div>
</Modal>



      {/* --- 거래 내역 모달 --- */}
      <Modal
        isOpen={isTransactionsModalOpen}
        onClose={() => setTransactionsModalOpen(false)}
        title="전체 거래 내역"
      >
        {transactions.length > 0 ? (
          <div className="transaction-modal-list">
            {transactions.map((tx) => (
              <div key={tx.executionId} className="transaction-item">
                <span>{formatDate(tx.executedAt)}</span>
                <span>{tx.stockName}</span>
                <span className={tx.executionType === "BUY" ? "buy" : "sell"}>
                  {tx.executionType === "BUY" ? "매수" : "매도"}
                </span>
                <span>{tx.quantity}주</span>
                <span>{tx.price.toLocaleString()}원</span>
                <span className="total-amount">
                  ({tx.totalAmount.toLocaleString()}원)
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="loading-text">거래 내역이 없습니다.</p>
        )}
      </Modal>

      {/* --- 나머지 모달 --- */}
      <Modal
        isOpen={isHoldingsModalOpen}
        onClose={() => setHoldingsModalOpen(false)}
        title="전체 보유 종목"
      >
        <p>추후 기능 예정</p>
      </Modal>

      <Modal
        isOpen={isRankingModalOpen}
        onClose={() => setRankingModalOpen(false)}
        title="전체 수익률 랭킹"
      >
        <div className="ranking-modal-list">
          {ranking.map((r, idx) => (
            <div
              key={r.userId}
              className={`ranking-item ${user?.id === r.userId ? "highlight" : ""}`}
            >
              <span>{idx + 1}</span>
              <span>{r.userId}</span>
              <span className={r.profitRate >= 0 ? "positive" : "negative"}>
                {r.profitRate.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default PaperTrading;
