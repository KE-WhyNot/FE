// src/pages/AllStocks/AllStocksList.jsx
import React, { useState, useEffect } from "react";
import "./AllStocks.css";
import { useNavigate } from "react-router-dom";
import financeAxios from "../../api/financeAxiosInstance";

const AllStocksList = () => {
  const [stockList, setStockList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStockList = async () => {
      try {
        setLoading(true);
        const res = await financeAxios.get("/api/stock/list", {
          headers: { "X-User-Id": "testuser124" },
        });
        setStockList(res.data?.result || []);
      } catch (error) {
        console.error("❌ 종목 리스트 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStockList();
  }, []);

  const filteredStocks = stockList.filter(
    (stock) =>
      stock.stockName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.stockId.includes(searchTerm)
  );

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
            <div
              key={stock.stockId}
              className="stock-card"
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
          ))
        )}
      </div>
    </div>
  );
};

export default AllStocksList;
