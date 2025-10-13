import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./PolicyDetailPage.css";
import Header from "../common/Header";
import { FaShareAlt, FaPrint, FaBookmark, FaArrowLeft } from "react-icons/fa"; // ✨ FaArrowLeft 추가

// ... (policyData는 이전과 동일)
const policyData = [
  {
    id: 1,
    status: "상시",
    tags: ["주거", "대구"],
    title: "대구형 청년희망주택(공공임대주택) 임대보증금 이자 지원 사업",
    description:
      "대구형 청년희망주택 입주자에게 임대보증금 이자를 지원하여 주거부담 경감 및 청년 주거안정을 도모하고자 함.",
    lastUpdated: "2025년 2월 19일",
    scraps: 29,
    views: 2280,
    summary: {
      policyNumber: "20250219005400210458",
      field: "주거",
      supportContent: "표준임대보증금 범위내에서 대출이자 50% 지원",
      period: "2025년 1월 31일 ~ 2025년 1월 31일",
      applicationPeriod: "상시",
      scale: "제한없음",
    },
    eligibility: {
      age: "만 19세~만 39세",
      residence:
        "대구광역시 중구, 동구, 서구, 남구, 북구, 수성구, 달서구, 달성군, 군위군",
      income: "무관",
      education: "제한없음",
      major: "제한없음",
      employmentStatus: "제한없음",
      specializedFields: "제한없음",
      additionalRequirements:
        "대구형 청년희망주택의 대학생·청년·신혼부부 등 청년계층 입주자 중 전세자금 대출자",
      participationRestrictions:
        "주거급여수급자 또는 전세금 대출이자·월세 등 정부 및 우리 시 주거지원 받고 있는 대상자",
    },
    application: {
      procedure:
        "대구형 청년희망주택 입주자가 대구안방 플랫폼을 통해 지원 신청",
      evaluation: "분기별 신청 및 3, 6, 9, 12월 20일 지출",
      site: "https://anbang.daegu.go.kr/hopeHousing/businessOverView.do",
      documents: "주민등록등본, 금융거래확인서, 대출이자납입증명서 등",
    },
    otherInfo: {
      managingOrg: "주택과",
      operatingOrg: "",
      refSite1: "",
      refSite2: "",
      changeHistory: [
        { date: "2025.02.19", content: "최종 수정일" },
        { date: "2025.02.19", content: "최초 등록일" },
      ],
    },
  },
  // ... 다른 정책 데이터도 상세 필드 추가
];

const PolicyDetailPage = () => {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const policy = policyData.find((item) => item.id === parseInt(policyId));

  if (!policy) {
    return <div>정책 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="policy-detail-layout">
      <Header />
      <main className="policy-detail-content">
        {/* ✨ '목록으로' 버튼 추가 */}
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft /> 목록으로
        </button>

        <div className="policy-header">
          <div className="policy-tags">
            {policy.tags.map((tag, i) => (
              <span key={i}>{tag}</span>
            ))}
          </div>
        </div>

        <h2 className="policy-title-main">{policy.title}</h2>

        <div className="hashtag-container">
          <span>#공공임대주택</span>
        </div>

        <div className="policy-summary-box">
          <p>{policy.description}</p>
        </div>

        {/* --- 섹션 렌더링 --- */}
        <Section title="한 눈에 보는 정책 요약" data={policy.summary} />
        <Section title="신청자격" data={policy.eligibility} />
        <Section title="신청방법" data={policy.application} />
        <Section title="기타" data={policy.otherInfo} isOtherSection={true} />
      </main>
    </div>
  );
};

// ... (Section 컴포넌트는 이전과 동일)
const Section = ({ title, data, isOtherSection = false }) => {
  const keyMap = {
    policyNumber: "정책번호",
    field: "정책분야",
    supportContent: "지원내용",
    period: "사업 운영 기간",
    applicationPeriod: "사업 신청기간",
    scale: "지원 규모(명)",
    age: "연령",
    residence: "거주지역",
    income: "소득",
    education: "학력",
    major: "전공",
    employmentStatus: "취업상태",
    specializedFields: "특화분야",
    additionalRequirements: "추가사항",
    participationRestrictions: "참여제한 대상",
    procedure: "신청절차",
    evaluation: "심사 및 발표",
    site: "신청 사이트",
    documents: "제출 서류",
    managingOrg: "주관 기관",
    operatingOrg: "운영 기관",
    refSite1: "참고사이트 1",
    refSite2: "참고사이트 2",
  };

  return (
    <div className="policy-section">
      <h3>{title}</h3>
      <div className="info-grid">
        {Object.entries(data).map(([key, value]) => {
          if (key === "changeHistory") return null; // 변경 내역은 따로 처리
          if (!value) return null; // 값이 없는 항목은 렌더링하지 않음

          const label = keyMap[key];
          if (!label) return null;

          return (
            <div className="info-row-detail" key={key}>
              <div className="info-label-detail">{label}</div>
              <div className="info-value-detail">
                {key === "site" ? (
                  <a href={value} target="_blank" rel="noopener noreferrer">
                    {value}
                  </a>
                ) : (
                  value
                )}
              </div>
            </div>
          );
        })}
      </div>
      {isOtherSection && data.changeHistory && (
        <div className="change-history">
          <h4>정보 변경 내역</h4>
          <table>
            <thead>
              <tr>
                <th>변경일자</th>
                <th>변경 내용</th>
              </tr>
            </thead>
            <tbody>
              {data.changeHistory.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PolicyDetailPage;
