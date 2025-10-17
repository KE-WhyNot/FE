// src/pages/PaperTrading/PaperTrading.jsx
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import financeAxios from "../../api/financeAxiosInstance";
import Modal from "../../components/common/Modal";
import useAuthStore from "../../store/useAuthStore";
import "./PaperTrading.css";

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

// ✅ 라인 차트용 커스텀 툴팁
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

// ✅ 파이 차트용 커스텀 툴팁
const PieCustomTooltip = ({ datum }) => {
  const { id, value, data } = datum;

  return (
    <div
      style={{
        background: "rgba(0, 0, 0, 0.85)",
        color: "#fff",
        padding: "10px 14px",
        borderRadius: "8px",
        fontSize: "14px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        minWidth: "160px",
        lineHeight: "1.5",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "6px" }}>{id}</div>
      <div>
        <span style={{ color: "#aaa", marginRight: "6px" }}>●</span>
        총 금액: {value.toLocaleString()}원
      </div>
      <div>
        <span style={{ color: "#aaa", marginRight: "6px" }}>●</span>
        투자 비율: {data.percent}%
      </div>
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
  const [myRank, setMyRank] = useState({});
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

  // ✅ 보유 종목
  const [holdings, setHoldings] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalRate, setTotalRate] = useState(0);

  const [pieData, setPieData] = useState([]);


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

  // ✅ 사용자 초기화 및 모든 데이터 로딩 (핵심 수정 부분)
  useEffect(() => {
    const initializeUserAndData = async () => {
      if (!user || !user.id) {
        console.log("사용자 정보가 없어 초기화를 중단합니다.");
        return;
      }
      const userId = user.id;

      try {
        console.log(`[1] 사용자 존재 여부 확인: ${userId}`);
        const existsRes = await financeAxios.get('/api/user/exists', {
          headers: { 'X-User-Id': userId },
        });

        if (existsRes.data?.result === false) {
          console.log(`[2] 사용자가 존재하지 않아 생성을 요청합니다.`);
          await financeAxios.post('/api/user', null, {
            headers: { 'X-User-Id': userId },
          });
          console.log(`[3] 사용자 생성이 완료되었습니다.`);
        } else {
          console.log(`[2-3] 사용자가 이미 존재합니다.`);
        }

        // 이제 사용자가 존재하므로 모든 데이터를 병렬로 가져옵니다.
        console.log(`[4] 모든 사용자 데이터를 병렬로 불러옵니다.`);
        await Promise.all([
          fetchWatchlist(userId),
          fetchTop10Ranking(userId),
          fetchTransactions(userId),
          fetchHoldings(userId)
        ]);
        console.log(`[5] 모든 데이터 로딩이 완료되었습니다.`);

      } catch (error) {
        console.error("❌ 사용자 초기화 및 데이터 로딩 실패:", error);
      }
    };

    initializeUserAndData();
  }, [user]);

  // --- 각 데이터 Fetch 함수 (userId를 인자로 받도록 수정) ---

  const fetchWatchlist = async (userId) => {
    try {
      const res = await financeAxios.get("/api/user/interest-stocks", {
        headers: { "X-User-Id": userId },
      });

      const baseList = res.data?.result || [];
      const enrichedList = await Promise.all(
        baseList.map(async (item) => {
          try {
            const detailRes = await financeAxios.get(
              `/api/stock/list/${item.stockId}`,
              { headers: { "X-User-Id": userId } }
            );
            return { ...item, stockImage: detailRes.data?.result?.stockImage || null };
          } catch (err) {
            console.warn(`⚠️ 종목 ${item.stockId} 이미지 로드 실패`, err);
            return { ...item, stockImage: null };
          }
        })
      );

      const sorted = enrichedList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setWatchlist(sorted);
      setWatchlistHasNext(sorted.length >= 10);
    } catch (e) {
      console.error("❌ 관심 종목 불러오기 실패:", e);
    }
  };

  const fetchTop10Ranking = async (userId) => {
    try {
      const [topRes, myRes] = await Promise.all([
        financeAxios.get("https://notify.youth-fi.com/api/ranking/top10", {
          headers: { "X-User-Id": userId },
        }),
        financeAxios.get("https://notify.youth-fi.com/api/ranking/myrank", {
          headers: { "X-User-Id": userId },
        }),
      ]);
      setRanking(topRes.data || []);
      setMyRank(myRes.data || {});
    } catch (e) {
      console.error("❌ 랭킹 불러오기 실패:", e);
    }
  };

  const fetchTransactions = async (userId) => {
    try {
      const res = await financeAxios.get("/api/user/trading/history", {
        headers: { "X-User-Id": userId },
      });
      let list = res.data?.result || [];
      list.sort((a, b) => new Date(b.executedAt) - new Date(a.executedAt));
      setTransactions(list);
    } catch (e) {
      console.error("❌ 거래 내역 불러오기 실패:", e);
    }
  };

  const fetchHoldings = async (userId) => {
    try {
      const res = await financeAxios.get("/api/user/holdings", {
        headers: { "X-User-Id": userId },
      });
      const list = res.data?.result || [];

      const enriched = await Promise.all(
        list.map(async (h) => {
          try {
            const priceRes = await financeAxios.post("/api/stock/current-price", {
              marketCode: "J", stockCode: h.stockId,
            });
            const current = Number(priceRes.data?.result?.stckPrpr || 0);
            const change = current - h.avgPrice;
            const rate = h.avgPrice ? (change / h.avgPrice) * 100 : 0;

            const infoRes = await financeAxios.get(`/api/stock/list/${h.stockId}`, {
              headers: { "X-User-Id": userId },
            });
            const info = infoRes.data?.result;

            return {
              ...h,
              currentPrice: current,
              change,
              rate,
              stockImage: info?.stockImage || null,
              sectorName: info?.sectorName || "",
            };
          } catch (err) {
            console.warn(`⚠️ ${h.stockName} 데이터 불러오기 실패:`, err);
            return { ...h, currentPrice: 0, change: 0, rate: 0, stockImage: null };
          }
        })
      );

      const value = enriched.reduce((sum, h) => sum + h.currentPrice * h.holdingQuantity, 0);
      const cost = enriched.reduce((sum, h) => sum + h.avgPrice * h.holdingQuantity, 0);
      const profit = value - cost;
      const rate = cost ? (profit / cost) * 100 : 0;

      setHoldings(enriched);
      setTotalValue(value);
      setTotalProfit(profit);
      setTotalRate(rate);

      if (value > 0) {
        const sorted = [...enriched].sort((a, b) => b.currentPrice * b.holdingQuantity - a.currentPrice * a.holdingQuantity);
        const top5 = sorted.slice(0, 5);
        const others = sorted.slice(5);
        const othersValue = others.reduce((sum, h) => sum + h.currentPrice * h.holdingQuantity, 0);

        const newPieData = top5.map((h) => {
          const val = h.currentPrice * h.holdingQuantity;
          const percent = ((val / value) * 100).toFixed(1);
          return { id: h.stockName, label: `${h.stockName} (${percent}%)`, value: val, percent };
        });

        if (others.length > 0) {
          const othersPercent = ((othersValue / value) * 100).toFixed(1);
          newPieData.push({ id: "기타", label: `기타 (${othersPercent}%)`, value: othersValue, percent: othersPercent });
        }
        setPieData(newPieData);
      } else {
        setPieData([]); // 보유 종목이 없으면 파이 데이터 초기화
      }
    } catch (e) {
      console.error("❌ 보유 종목 불러오기 실패:", e);
    }
  };

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
              ) : chartData.length > 0 && chartData[0].data.length > 0 ? (
                <ResponsiveLine
                  data={chartData}
                  margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                  xScale={{ type: "point" }}
                  yScale={{ type: "linear", min: "auto", max: "auto" }}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    tickValues: getTickValues(chartData[0]?.data || []),
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

            <div className="ranking-list scrollable">
              {ranking.length > 0 ? (
                ranking.slice(0, 10).map((r) => (
                  <div
                    key={r.userId}
                    className={`ranking-item ${r.rankNo <= 3 ? `top${r.rankNo}` : ""}`}
                  >
                    <span>{r.rankNo}</span>
                    <span>{r.userId || "익명"}</span>
                    <span className={r.profitRate >= 0 ? "positive" : "negative"}>
                      {r.profitRate.toFixed(2)}%
                    </span>
                  </div>
                ))
              ) : (
                <p className="loading-text">랭킹 데이터 없음</p>
              )}
            </div>

            <div className="my-rank">
              {myRank?.rankNo ? (
                <>
                  <span>내 순위: <strong>{myRank.rankNo}위</strong></span>{" "}
                  <span className={myRank.profitRate >= 0 ? "positive" : "negative"}>
                    {myRank.profitRate.toFixed(2)}%
                  </span>
                </>
              ) : (
                <span>랭킹 정보 없음</span>
              )}
            </div>
          </div>
        </div>

        {/* --- 두 번째 줄 --- */}
        <div className="row-grid">
          {/* ✅ 내 종목 보기 (사진처럼) */}
          <div className="widget holdings-widget">
            <div className="widget-header clickable" onClick={() => setHoldingsModalOpen(true)}>
              <h3>내 종목보기 &gt;</h3>
            </div>

            <div className="holdings-summary">
              <h2>{totalValue.toLocaleString()}원</h2>
              <p className={totalProfit >= 0 ? "positive" : "negative"}>
                {totalProfit >= 0 ? "+" : ""}
                {totalProfit.toLocaleString()}원 ({totalRate.toFixed(1)}%)
              </p>
            </div>

            <div className="holdings-list">
              {holdings.length > 0 ? (
                holdings.slice(0, 4).map((h) => (
                  <div key={h.userStockId} className="holding-row">
                    <div className="holding-left">
                      {h.stockImage ? (
                        <img
                          src={h.stockImage}
                          alt={h.stockName}
                          className="holding-logo"
                        />
                      ) : (
                        <div className="holding-logo-fallback">
                          {h.stockName[0]}
                        </div>
                      )}
                      <div className="holding-info">
                        <span className="name">{h.stockName}</span>
                        <span className="quantity">{h.holdingQuantity}주</span>
                      </div>
                    </div>
                    <div className="holding-right">
                      <span className="price">
                        {h.currentPrice.toLocaleString()}원
                      </span>
                      <span className={h.change >= 0 ? "positive" : "negative"}>
                        {h.change >= 0 ? "+" : ""}
                        {h.change.toLocaleString()}원 ({h.rate.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="loading-text">보유 종목이 없습니다.</p>
              )}
            </div>
          </div>

          {/* 거래 내역 */}
          <div className="widget transaction-widget">
            <div className="widget-header">
              <h3>거래 내역</h3>
              <button
                className="add-button"
                onClick={() => setTransactionsModalOpen(true)}
              >
                +
              </button>
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
                    <div
                      key={tx.executionId}
                      className={`transaction-item ${profitClass}`}
                    >
                      <div className="tx-left">
                        <div className="tx-date">{`${month}.${day}`}</div>
                        <div className="tx-name">
                          {tx.stockName} {tx.quantity}주
                        </div>
                        <div className="tx-subinfo">
                          {hour}:{minute} | {isBuy ? "구매" : "판매"}
                        </div>
                      </div>

                      <div className="tx-right">
                        <div className={`tx-amount ${profitClass}`}>
                          {sign}
                          {tx.totalAmount.toLocaleString()}원
                        </div>
                        <div className="tx-price">
                          {tx.price.toLocaleString()}원
                        </div>
                        {tx.userBalance !== undefined && (
                          <div className="tx-balance">
                            {tx.userBalance.toLocaleString()}원
                          </div>
                        )}
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
              {pieData.length > 0 ? (
                <ResponsivePie
                  data={pieData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  innerRadius={0.7}
                  padAngle={1.2}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={{ scheme: "paired" }}
                  borderWidth={1}
                  borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                  enableArcLabels={false}
                  enableArcLinkLabels={false}
                  tooltip={({ datum }) => <PieCustomTooltip datum={datum} />}
                />
              ) : (
                <p className="loading-text">투자 데이터 없음</p>
              )}
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
                  <img
                    src={stock.stockImage}
                    alt={stock.stockName}
                    className="stock-logo-img"
                  />
                ) : (
                  <div className="stock-logo-fallback">
                    {stock.stockName[0]}
                  </div>
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
                <span
                  className={
                    tx.executionType === "BUY" ? "buy" : "sell"
                  }
                >
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

      {/* --- 전체 보유 종목 모달 --- */}
      <Modal
        isOpen={isHoldingsModalOpen}
        onClose={() => setHoldingsModalOpen(false)}
        title="전체 보유 종목"
      >
        <div className="holdings-modal-list">
          {holdings.length > 0 ? (
            holdings.map((h) => {
              const profit = (h.currentPrice - h.avgPrice) * h.holdingQuantity;
              const profitRate = h.avgPrice ? (profit / (h.avgPrice * h.holdingQuantity)) * 100 : 0;
              const profitClass = profit >= 0 ? "positive" : "negative";

              return (
                <div key={h.userStockId} className="holding-item">
                  <span className="stock-name">{h.stockName}</span>
                  <span className="quantity">{h.holdingQuantity}주</span>
                  <span className="avg-price">{h.avgPrice.toLocaleString()}원</span>
                  <span className="current-price">{h.currentPrice.toLocaleString()}원</span>

                  <span className={`profit ${profitClass}`}>
                    <div className="profit-amount">
                      {profit >= 0 ? "+" : ""}
                      {profit.toLocaleString()}원
                    </div>
                    <div className="profit-rate">
                      ({profitRate.toFixed(1)}%)
                    </div>
                  </span>
                </div>
              );
            })
          ) : (
            <p className="loading-text">보유 종목이 없습니다.</p>
          )}
        </div>
      </Modal>


      {/* --- 전체 수익률 랭킹 모달 --- */}
      <Modal
        isOpen={isRankingModalOpen}
        onClose={() => setRankingModalOpen(false)}
        title="전체 수익률 랭킹"
      >
        <div className="ranking-modal-list">
          {ranking.map((r, idx) => (
            <div
              key={r.userId}
              className={`ranking-item ${user?.id === r.userId ? "highlight" : ""
                }`}
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
