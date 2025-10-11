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
  FaLandmark,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import policyAxios from "../../api/policyAxiosInstance";

const MainPage = () => {
  // ✅ 최신 정책 3개 불러오기
  const {
    data: policies,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["latestPolicies"],
    queryFn: async () => {
      const res = await policyAxios.get("/api/policy/list", {
        params: { page_num: 1, page_size: 3 },
      });
      return res.data?.result?.youthPolicyList || [];
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

  // ✅ 포트폴리오 예시 데이터
  const portfolioDetails = [
    { id: "예금", value: 16805120, color: "#66DA26" },
    { id: "적금", value: 19205850, color: "#826AF9" },
    { id: "주식", value: 18005430, color: "#FF6B6B" },
  ];

  const donutChartData = portfolioDetails.map((item) => ({
    id: item.id,
    label: item.id,
    value: item.value,
    color: item.color,
  }));

  const totalAmount = portfolioDetails.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const formattedTotal = `${totalAmount.toLocaleString()}원`;

  const CenteredMetric = ({ centerX, centerY }) => (
    <text
      x={centerX}
      y={centerY}
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: "16px", fontWeight: 700, fill: "#555" }}
    >
      {formattedTotal}
    </text>
  );

  const CustomArcLinkLabel = ({ datum, style }) => (
    <g transform={style.transform} style={{ pointerEvents: "none" }}>
      <text
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fill: "#555", fontSize: 12, fontWeight: 600 }}
      >
        {datum.id}
      </text>
    </g>
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
              {isLoading ? (
                <p style={{ textAlign: "center" }}>불러오는 중...</p>
              ) : isError ? (
                <p style={{ textAlign: "center", color: "red" }}>
                  데이터를 불러오지 못했습니다.
                </p>
              ) : (
                <ul className="policy-list">
                  {policies.map((policy) => {
                    const icon = categoryIcons[policy.category_large] || (
                      <FaUsers />
                    ); // ✅ 기본값 설정
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

          {/* --- 예적금 카드 --- */}
          <div className="info-card">
            <div className="card-header">
              <h3>예·적금</h3>
              <Link to="/savings">자세히보기 &gt;</Link>
            </div>
            <div className="card-content">
              <ul className="savings-list">
                <li>
                  <div className="item-icon bank-icon">
                    <FaLandmark />
                  </div>
                  <div className="item-details">
                    <span className="item-title">Sh첫만남우대예금</span>
                    <span className="item-source">SH수협은행</span>
                  </div>
                  <div className="item-interest">
                    <span className="rate-label">최고</span>
                    <span className="rate-value">2.90%</span>
                    <span className="rate-base">기본 1.85%</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* --- 포트폴리오 카드 --- */}
          <div className="info-card">
            <div className="card-header">
              <h3>포트폴리오</h3>
              <Link to="/portfolio">자세히보기 &gt;</Link>
            </div>
            <div className="card-content chart-container">
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
                arcLinkLabelsComponent={CustomArcLinkLabel}
                layers={["arcs", "arcLinkLabels", CenteredMetric]}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MainPage;
