import React, { useState } from "react";
import "./AllStocks.css";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";

// --- Mock Data 수정 ---
const stockPriceData = [
  {
    id: "price",
    // ✨ 완만한 곡선을 위해 sin 함수를 사용하고 데이터 포인트를 늘립니다.
    data: Array.from({ length: 25 }, (_, i) => ({
      x: i,
      y: 55000 + Math.sin(i / 3) * 2000 + Math.random() * 1500,
    })),
  },
];
const stockVolumeData = Array.from({ length: 25 }, (_, i) => ({
  time: i,
  volume: 100000 + Math.random() * 150000,
}));
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
  const [orderType, setOrderType] = useState("buy");
  const [price, setPrice] = useState(68500);
  const [quantity, setQuantity] = useState(0);

  return (
    <div className="all-stocks-container">
      <div className="stock-page-header">
        <input type="text" placeholder="종목명 또는 코드를 검색하세요." className="global-stock-search"/>
      </div>
      <div className="stock-detail-grid">
        <div className="chart-section">
          <div className="widget main-chart-widget">
            <div className="widget-header">
              <h3>삼성전자</h3>
              <div className="chart-tabs">
                <button className="active">1일</button><button>1주</button><button>1달</button>
                <button>3달</button><button>1년</button><button>5년</button>
              </div>
            </div>
            <div className="line-chart-container">
              {/* ✨ 라인 차트 속성 대폭 수정 */}
              <ResponsiveLine
                data={stockPriceData}
                margin={{ top: 20, right: 20, bottom: 20, left: 30 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                curve="monotoneX" // ✨ 곡선을 부드럽게
                axisTop={null}
                axisRight={null}
                axisBottom={null} // ✨ x축 숨김
                axisLeft={null} // ✨ y축 숨김
                enableGridX={false} // ✨ 세로 그리드 숨김
                enableGridY={true} // 가로 그리드 표시
                gridYValues={5} // 그리드 라인 갯수
                colors={['#E57373']} // ✨ 라인 색상 변경
                lineWidth={2}
                enablePoints={false} // ✨ 데이터 포인트 숨김
                enableArea={true} // ✨ 라인 아래 영역 채우기
                areaOpacity={0.1} // 영역 투명도
                useMesh={true}
                enableCrosshair={false} // ✨ 십자선 숨김
                legends={[]}
              />
            </div>
          </div>
          <div className="widget volume-chart-widget">
            <div className="bar-chart-container">
              <ResponsiveBar
                data={stockVolumeData}
                keys={["volume"]}
                indexBy="time"
                margin={{ top: 10, right: 0, bottom: 20, left: 0 }}
                padding={0.4}
                colors={["#E0E0E0"]} // ✨ 바 색상 변경
                enableLabel={false}
                axisTop={null}
                axisRight={null}
                axisBottom={null}
                axisLeft={null}
                enableGridY={false}
              />
            </div>
          </div>
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