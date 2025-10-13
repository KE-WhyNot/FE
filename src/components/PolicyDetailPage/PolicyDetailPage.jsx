import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PolicyDetailPage.css";
import Header from "../common/Header";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const PolicyDetailPage = () => {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ 상세 API 호출
  useEffect(() => {
    const fetchPolicyDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `https://policy.youth-fi.com/api/policy/${policyId}`,
          {
            headers: { accept: "application/json" },
          }
        );
        setPolicy(res.data);
      } catch (err) {
        console.error("정책 상세 불러오기 실패:", err);
        setError("정책 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyDetail();
  }, [policyId]);

  if (loading)
    return (
      <div className="policy-detail-layout">
        <Header />
        <main className="policy-detail-content">
          <p>정책 정보를 불러오는 중입니다...</p>
        </main>
      </div>
    );

  if (error || !policy)
    return (
      <div className="policy-detail-layout">
        <Header />
        <main className="policy-detail-content">
          <p style={{ color: "red" }}>{error || "정책 정보를 찾을 수 없습니다."}</p>
        </main>
      </div>
    );

  // ✅ 구조 분해로 각 섹션 분리
  const { top, summary, eligibility, application, etc, meta } = policy;

  return (
    <div className="policy-detail-layout">
      <Header />
      <main className="policy-detail-content">
        {/* 뒤로가기 버튼 */}
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft /> 목록으로
        </button>

        {/* 헤더 */}
        <div className="policy-header">
          <div className="policy-tags">
            {top?.keyword?.map((tag, i) => (
              <span key={i}>{tag}</span>
            ))}
          </div>
        </div>

        <h2 className="policy-title-main">{top?.title || "정책명 없음"}</h2>

        <div className="hashtag-container">
          <span>#{top?.category_large || "기타"}</span>
        </div>

        <div className="policy-summary-box">
          <p>{summary?.summary_raw || "설명이 없습니다."}</p>
        </div>

        {/* --- 세부 섹션 --- */}
        <Section
          title="정책 요약"
          data={{
            "정책분야": summary?.category_full,
            "사업운영기간": summary?.period_biz,
            "신청기간": summary?.period_apply,
            "정책설명": summary?.description_raw,
          }}
        />

        <Section
          title="신청자격"
          data={{
            "연령": eligibility?.age,
            "거주지역": eligibility?.regions,
            "소득": eligibility?.income,
            "학력": eligibility?.education,
            "전공": eligibility?.major,
            "취업상태": eligibility?.job_status,
            "특화분야": eligibility?.specialization,
            "추가조건": eligibility?.eligibility_additional,
            "참여제한": eligibility?.eligibility_restrictive,
          }}
        />

        <Section
          title="신청방법"
          data={{
            "신청절차": application?.application_process,
            "신청사이트": application?.apply_url,
            "제출서류": application?.required_documents,
          }}
        />

        <Section
          title="기타 정보"
          data={{
            "주관기관": etc?.supervising_org,
            "운영기관": etc?.operating_org,
            "참고사이트1": etc?.ref_url_1,
            "참고사이트2": etc?.ref_url_2,
          }}
        />

        <Section
          title="메타정보"
          data={{
            "출처": meta?.ext_source,
            "조회수": meta?.views,
            "등록일": meta?.created_at,
            "수정일": meta?.updated_at,
          }}
        />
      </main>
    </div>
  );
};

// ✅ Section 컴포넌트
const Section = ({ title, data }) => {
  const entries = Object.entries(data || {}).filter(([_, v]) => v && v !== "null");

  if (entries.length === 0) return null;

  return (
    <div className="policy-section">
      <h3>{title}</h3>
      <div className="info-grid">
        {entries.map(([label, value]) => (
          <div className="info-row-detail" key={label}>
            <div className="info-label-detail">{label}</div>
            <div className="info-value-detail">
              {String(value).startsWith("http") ? (
                <a href={value} target="_blank" rel="noopener noreferrer">
                  {value}
                </a>
              ) : (
                value
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PolicyDetailPage;
