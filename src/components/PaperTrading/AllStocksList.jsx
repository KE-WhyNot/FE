// src/pages/AllStocks/AllStocksList.jsx
import React, { useState, useEffect } from "react";
import "./AllStocks.css";
import { useNavigate } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import financeAxios from "../../api/financeAxiosInstance";
import useAuthStore from "../../store/useAuthStore"; 

const AllStocksList = () => {
  const [stockList, setStockList] = useState([]);
  const [interestList, setInterestList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

const { user } = useAuthStore(); 
const userId = user?.id ?? user?.userId ?? "guest"; // ✅ 혹시 몰라 fallback 추가

useEffect(() => {
  // ✅ userId가 없으면 요청 안 보냄
  if (!userId) return;

  const fetchData = async () => {
    try {
      setLoading(true);

      // ✅ 한 번에 재사용 가능한 headers 변수 선언
      const headers = { "X-User-Id": userId };

      // 1️⃣ 전체 종목 목록 불러오기
      const [stockRes, interestRes] = await Promise.all([
        financeAxios.get("/api/stock/list", { headers }),
        financeAxios.get("/api/user/interest-stocks", { headers }),
      ]);

      const allStocks = stockRes.data?.result || [];
      const interests = interestRes.data?.result || [];

      // 2️⃣ 관심 종목 ID만 추출
      const interestIds = interests.map((i) => i.stockId);

      // 3️⃣ 전체 종목에 “isFavorite” 속성 추가
      const combined = allStocks.map((stock) => ({
        ...stock,
        isFavorite: interestIds.includes(stock.stockId),
      }));

      // 4️⃣ 관심 종목 우선 정렬
      const sorted = combined.sort((a, b) => {
        if (a.isFavorite === b.isFavorite) return 0;
        return a.isFavorite ? -1 : 1; // true인 항목(관심)은 앞으로
      });

      setStockList(sorted);
      setInterestList(interests);
    } catch (error) {
      console.error("❌ 종목 데이터 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [userId]); // ✅ userId가 바뀔 때만 재요청


  // 🔍 검색 필터
  const filteredStocks = stockList.filter(
    (stock) =>
      stock.stockName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.stockId.includes(searchTerm)
  );

  // ❤️ 관심 토글 (서버 연동 버전으로 확장 가능)
  const toggleFavorite = (stockId) => {
    setStockList((prev) =>
      prev.map((s) =>
        s.stockId === stockId ? { ...s, isFavorite: !s.isFavorite } : s
      )
    );
  };

  return (
    <div className="all-stocks-container">
      <div className="stock-page-header">
        <input
          type="text"
          placeholder="종목명 또는 코드를 검색하세요."
          className="global-stock-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="stock-list-grid">
        {loading ? (
          <p className="loading-text">데이터 불러오는 중...</p>
        ) : (
          filteredStocks.map((stock) => (
            <div key={stock.stockId} className="stock-card">
              <div className="favorite-icon">
                {stock.isFavorite ? (
                  <AiFillHeart className="heart filled" />
                ) : (
                  <AiOutlineHeart className="heart outline" />
                )}
              </div>

              <div
                className="stock-clickable"
                onClick={() => navigate(`/all-stocks/${stock.stockId}`)}
              >
                <img
                  src={stock.stockImage}
                  alt={stock.stockName}
                  className="stock-logo"
                />
                <div className="stock-info">
                  <h4>{stock.stockName}</h4>
                  <p>{stock.sectorName}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllStocksList;
