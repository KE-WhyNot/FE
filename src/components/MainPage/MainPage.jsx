import React from "react";
import "./MainPage.css";
import Header from "../common/Header";
import { ResponsivePie } from "@nivo/pie";
import {
  FaBriefcase,
  FaHome,
  FaGraduationCap,
  FaHeartbeat,
  FaUsers,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import policyAxios from "../../api/policyAxiosInstance";
import financeAxios from "../../api/financeAxiosInstance";
import useAuthStore from "../../store/useAuthStore"; // ✅ 로그인 유저 불러오기

const MainPage = () => {
  const { user } = useAuthStore();
  const userId = user?.id;

  // ✅ 최신 정책 3개 불러오기
  const {
    data: policies,
    isLoading: isPoliciesLoading,
    isError: isPoliciesError,
  } = useQuery({
    queryKey: ["latestPolicies"],
    queryFn: async () => {
      const res = await policyAxios.get("/api/policy/list", {
        params: { page_num: 1, page_size: 3 },
      });
      return res.data?.result?.youthPolicyList || [];
    },
  });

  // ✅ 예적금 3개 불러오기
  const {
    data: finProducts,
    isLoading: isFinLoading,
    isError: isFinError,
  } = useQuery({
    queryKey: ["finProducts"],
    queryFn: async () => {
      const res = await policyAxios.get("/api/finproduct/list", {
        params: {
          page_num: 1,
          page_size: 3,
          banks: [92, 94],
          interest_rate_sort: "include_bonus",
        },
        paramsSerializer: (params) => {
          return Object.keys(params)
            .map((key) => {
              const value = params[key];
              if (Array.isArray(value)) {
                return value
                  .map((v) => `${key}=${encodeURIComponent(v)}`)
                  .join("&");
              }
              return `${key}=${encodeURIComponent(value)}`;
            })
            .join("&");
        },
      });
      return res.data?.result?.finProductList || [];
    },
  });

  // ✅ 투자 포트폴리오 추천 데이터 불러오기
  const {
    data: portfolio,
    isLoading: isPortfolioLoading,
    isError: isPortfolioError,
  } = useQuery({
    queryKey: ["portfolioRecommendation", userId],
    queryFn: async () => {
      const res = await financeAxios.get(
        "/api/user/portfolio-recommendation/my",
        {
          headers: { "X-User-Id": userId },
        }
      );
      return res.data?.result;
    },
  });

  // ✅ 카테고리별 아이콘 매핑
  const categoryIcons = {
    일자리: <FaBriefcase />,
    주거: <FaHome />,
    교육: <FaGraduationCap />,
    복지문화: <FaHeartbeat />,
    참여권리: <FaUsers />,
  };

  // ✅ 포트폴리오 데이터 가공 (예적금 vs 주식 비율)
  const allocationSavings = portfolio?.allocationSavings ?? 0;
  const allocationStocks = 100 - allocationSavings;
  const totalAmount = portfolio?.highestValue ?? 0;

  const donutChartData = [
    { id: "예적금", value: allocationSavings, color: "#66DA26" },
    { id: "주식", value: allocationStocks, color: "#FF6B6B" },
  ];

  const formattedTotal = `${totalAmount.toLocaleString()}원`;

  // ✅ 중앙 텍스트 (총 금액)
  const CenteredMetric = ({ centerX, centerY }) => (
    <text
      x={centerX}
      y={centerY}
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fontSize: "16px",
        fontWeight: 700,
        fill: "#333",
      }}
    >
      {formattedTotal}
    </text>
  );

  return (
    <div className="main-page-container">
      <Header />
      <main className="main-content">
        {/* --- 상단 배너 --- */}
        <section className="main-banner">
          <div className="banner-text">
            <h2>투자의 첫걸음, YOUTHFI 모의투자와 함께!</h2>
            <p>
              실제 같은 투자 환경에서 위험 부담 없이 안전하게 배우고 경험하세요.
              <br />
              이곳에서의 연습이 당신을 자신감 있는 투자자로 만들어줍니다.
            </p>
            <button>지금 바로 시작하세요!</button>
          </div>
        </section>

        {/* --- 카드 섹션 --- */}
        <section className="card-section">
          {/* ✅ 청년정책 카드 */}
          <div className="info-card">
            <div className="card-header">
              <h3>청년정책</h3>
              <Link to="/policy">자세히보기 &gt;</Link>
            </div>
            <div className="card-content">
              {isPoliciesLoading ? (
                <p style={{ textAlign: "center" }}>불러오는 중...</p>
              ) : isPoliciesError ? (
                <p style={{ textAlign: "center", color: "red" }}>
                  데이터를 불러오지 못했습니다.
                </p>
              ) : (
                <ul className="policy-list">
                  {policies.map((policy) => {
                    const icon = categoryIcons[policy.category_large] || (
                      <FaUsers />
                    );
                    const isUrgent =
                      policy.period_apply?.includes("~") &&
                      (() => {
                        const end = policy.period_apply.split("~")[1]?.trim();
                        if (!end || end === "마감") return false;
                        const diff =
                          (new Date(end) - new Date()) / (1000 * 60 * 60 * 24);
                        return diff <= 14;
                      })();

                    return (
                      <li key={policy.policy_id}>
                        <div className="item-icon">{icon}</div>
                        <div className="item-details">
                          <span className="item-title">{policy.title}</span>
                        </div>
                        <span
                          className={`item-dday ${isUrgent ? "highlight" : ""}`}
                        >
                          {policy.period_apply === "마감"
                            ? "마감"
                            : policy.period_apply.includes("~")
                            ? `D-${Math.max(
                                0,
                                Math.floor(
                                  (new Date(
                                    policy.period_apply.split("~")[1].trim()
                                  ) -
                                    new Date()) /
                                    (1000 * 60 * 60 * 24)
                                )
                              )}`
                            : "상시"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* ✅ 예적금 카드 */}
          <div className="info-card">
            <div className="card-header">
              <h3>예·적금</h3>
              <Link to="/savings">자세히보기 &gt;</Link>
            </div>
            <div className="card-content">
              {isFinLoading ? (
                <p style={{ textAlign: "center" }}>불러오는 중...</p>
              ) : isFinError ? (
                <p style={{ textAlign: "center", color: "red" }}>
                  데이터를 불러오지 못했습니다.
                </p>
              ) : finProducts.length === 0 ? (
                <p style={{ textAlign: "center" }}>예적금 상품이 없습니다.</p>
              ) : (
                <ul className="savings-list">
                  {finProducts.map((product) => (
                    <li key={product.finproduct_id}>
                      <div className="item-icon bank-icon">
                        <img
                          src={product.image_url}
                          alt={product.bank_name}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                      <div className="item-details">
                        <span className="item-title">
                          {product.product_name}
                        </span>
                        <span className="item-source">{product.bank_name}</span>
                      </div>
                      <div className="item-interest">
                        <span className="rate-label">최고</span>
                        <span className="rate-value">
                          {product.max_interest_rate.toFixed(2)}%
                        </span>
                        <span className="rate-base">
                          기본 {product.min_interest_rate.toFixed(2)}%
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ✅ 포트폴리오 카드 */}
          <div className="info-card">
            <div className="card-header">
              <h3>포트폴리오</h3>
              <Link to="/portfolio">자세히보기 &gt;</Link>
            </div>
            <div className="card-content chart-container">
              {isPortfolioLoading ? (
                <p style={{ textAlign: "center" }}>불러오는 중...</p>
              ) : isPortfolioError || !portfolio ? (
                <p style={{ textAlign: "center", color: "red" }}>
                  투자 데이터가 없습니다.
                </p>
              ) : (
                <ResponsivePie
                  data={donutChartData}
                  margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
                  innerRadius={0.6}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={{ datum: "data.color" }}
                  borderWidth={1}
                  borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                  enableArcLabels={false}
                  enableArcLinkLabels={true}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#555"
                  arcLinkLabelsColor={{ from: "color" }}
                  layers={["arcs", "arcLinkLabels", CenteredMetric]}
                />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MainPage;
