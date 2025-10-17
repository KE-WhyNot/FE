// src/pages/InvestmentPropensityPage/InvestmentPropensityPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./InvestmentPropensityPage.css";
import "./LoadingSpinner.css";
import Header from "../common/Header";
import useAuthStore from "../../store/useAuthStore";
import financeAxiosInstance from "../../api/financeAxiosInstance";

// --- 서버 명세에 맞게 매핑 ---
const profileMap = {
  안정형: "CONSERVATIVE",
  안정추구형: "CONSERVATIVE_SEEKING",
  위험중립형: "RISK_NEUTRAL",
  적극투자형: "AGGRESSIVE",
  공격투자형: "VERY_AGGRESSIVE",
};

// ✅ 금액 매핑 유지
const budgetMap = {
  "50만원 이하": 500000,
  "100만원 이하": 1000000,
  "200만원 이하": 2000000,
  "500만원 이하": 5000000,
  "1000만원 이하": 10000000,
};

const goalMap = {
  학비: "EDUCATION",
  생활비: "LIVING_EXPENSES",
  주택마련: "HOUSE_PURCHASE",
  자산증식: "ASSET_GROWTH",
  채무상환: "DEBT_REPAYMENT",
};

const lossMap = {
  "원금 손실 없음": "NO_LOSS",
  "원금의 10%": "TEN_PERCENT",
  "원금의 30%": "THIRTY_PERCENT",
  "원금의 50%": "FIFTY_PERCENT",
  "원금의 70%": "SEVENTY_PERCENT",
  "원금 전액": "FULL_AMOUNT",
};

const knowledgeMap = {
  "매우 낮음": "VERY_LOW",
  낮음: "LOW",
  보통: "MEDIUM",
  높음: "HIGH",
  "매우 높음": "VERY_HIGH",
};

const profitMap = {
  "150%": "ONE_FIFTY_PERCENT",
  "200%": "TWO_HUNDRED_PERCENT",
  "250%": "TWO_FIFTY_PERCENT",
  "300% 이상": "THREE_HUNDRED_PERCENT_PLUS",
};

const availableSectors = [
  "화학",
  "제약",
  "전기·전자",
  "운송장비·부품",
  "기타금융",
  "기계·장비",
  "금속",
  "건설",
  "IT 서비스",
];

const InvestmentPropensityPage = () => {
  const [answers, setAnswers] = useState({
    budget: "",
    sectors: [],
    goal: "",
    knowledge: "",
    loss: "",
    profit: "",
  });
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const showHeader = !location.pathname.startsWith("/setting");
  const { user } = useAuthStore();

  // ✅ 1️⃣ 투자 성향 존재 여부 확인
  useEffect(() => {
    const checkProfileExists = async () => {
      try {
        const response = await financeAxiosInstance.get(
          "/api/user/investment-profile/exists",
          { headers: { "X-User-Id": user?.userId } }
        );
        if (response.data?.result) {
          console.log("✅ 이미 설문 완료 → 포트폴리오 페이지로 이동");
          navigate("/portfolio-main");
        }
      } catch (error) {
        console.error("❌ 투자 성향 존재 여부 확인 실패:", error);
      } finally {
        setCheckingProfile(false);
      }
    };
    checkProfileExists();
  }, [navigate, user?.userId]);

  const questions = [
    {
      id: "budget",
      question: "1. 투자 예산",
      options: [
        "50만원 이하",
        "100만원 이하",
        "200만원 이하",
        "500만원 이하",
        "1000만원 이하",
      ],
      type: "radio",
    },
    {
      id: "sectors",
      question: "2. 관심 종목 (3개 이상 선택)",
      options: availableSectors,
      type: "checkbox",
    },
    {
      id: "goal",
      question: "3. 투자 목표",
      options: ["학비", "생활비", "주택마련", "자산증식", "채무상환"],
      type: "radio",
    },
    {
      id: "knowledge",
      question: "4. 금융지식 이해도 수준",
      options: ["매우 낮음", "낮음", "보통", "높음", "매우 높음"],
      type: "radio",
    },
    {
      id: "loss",
      question: "5. 감당 가능한 손실 수준",
      options: [
        "원금 손실 없음",
        "원금의 10%",
        "원금의 30%",
        "원금의 50%",
        "원금의 70%",
        "원금 전액",
      ],
      type: "radio",
    },
    {
      id: "profit",
      question: "6. 기대하는 투자 수익률",
      options: ["150%", "200%", "250%", "300% 이상"],
      type: "radio",
    },
  ];

  const handleRadioChange = (id, option) =>
    setAnswers({ ...answers, [id]: option });

  const handleCheckboxChange = (option) => {
    const isSelected = answers.sectors.includes(option);
    const newSectors = isSelected
      ? answers.sectors.filter((s) => s !== option)
      : [...answers.sectors, option];
    setAnswers({ ...answers, sectors: newSectors });
  };

  // ✅ 설문 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (answers.sectors.length < 3) {
      alert("관심 종목은 3개 이상를 선택해야 합니다.");
      return;
    }
    const isFormValid =
      answers.budget &&
      answers.goal &&
      answers.knowledge &&
      answers.loss &&
      answers.profit;
    if (!isFormValid) {
      alert("모든 질문에 답변해주세요.");
      return;
    }

    setIsSubmitting(true);

    // ✅ 점수 기반 투자 성향 도출
    let score = 0;
    score += [
      "50만원 이하",
      "100만원 이하",
      "200만원 이하",
      "500만원 이하",
      "1000만원 이하",
    ].indexOf(answers.budget);
    score += ["매우 낮음", "낮음", "보통", "높음", "매우 높음"].indexOf(
      answers.knowledge
    );
    score += [
      "원금 손실 없음",
      "원금의 10%",
      "원금의 30%",
      "원금의 50%",
      "원금의 70%",
      "원금 전액",
    ].indexOf(answers.loss);
    score += ["150%", "200%", "250%", "300% 이상"].indexOf(answers.profit);

    let resultType = "";
    if (score <= 4) resultType = "안정형";
    else if (score <= 8) resultType = "안정추구형";
    else if (score <= 12) resultType = "위험중립형";
    else if (score <= 16) resultType = "적극투자형";
    else resultType = "공격투자형";

    // ✅ 서버에 보낼 JSON
    const payload = {
      investmentProfile: profileMap[resultType],
      availableAssets: budgetMap[answers.budget],
      investmentGoal: goalMap[answers.goal],
      lossTolerance: lossMap[answers.loss],
      financialKnowledge: knowledgeMap[answers.knowledge],
      expectedProfit: profitMap[answers.profit],
      interestedSectorNames: answers.sectors,
    };

    try {
      await financeAxiosInstance.post(
        "/api/user/investment-profile/complete",
        payload,
        {
          headers: { "X-User-Id": user?.userId },
        }
      );
      console.log("✅ 투자 성향 등록 성공:", payload);
      setResult(resultType);
    } catch (error) {
      console.error("❌ 투자 성향 등록 실패:", error);
      alert("투자 성향 정보를 등록하는 데 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ “AI에게 내 포트폴리오 분석 요청하기” 클릭 시
  const handleNavigateToPortfolio = async () => {
    try {
      // 요청을 기다리지 않고 비동기로 실행
      financeAxiosInstance
        .post(
          "/api/user/investment-profile/send-to-llm",
          {},
          { headers: { "X-User-Id": user?.userId } }
        )
        .then(() => {
          console.log("✅ send-to-llm 요청 완료");
        })
        .catch((error) => {
          console.error("⚠️ send-to-llm 요청 실패:", error);
        });

      // ✅ 요청 대기 없이 즉시 페이지 이동
      navigate("/portfolio-main");
    } catch (error) {
      console.error("⚠️ send-to-llm 요청 중 예외 발생 (무시 후 이동):", error);
      navigate("/portfolio-main");
    }
  };

  // ✅ 로딩 상태
  if (checkingProfile) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="propensity-page-layout">
        {showHeader && <Header />}
        <main className="propensity-content">
          <div className="result-container">
            <h1>분석 결과</h1>
            <p>
              당신의 투자 성향은 <strong>{result}</strong>입니다.
            </p>
            <button
              className="submit-button"
              onClick={handleNavigateToPortfolio}
            >
              AI에게 내 포트폴리오 분석 요청하기
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="propensity-page-layout">
      {isSubmitting && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      {showHeader && <Header />}
      <main className="propensity-content">
        <h1>투자 성향 분석</h1>
        <p className="description">
          나의 투자 성향을 알아보고 맞춤형 포트폴리오를 추천 받아보세요.
        </p>
        <form onSubmit={handleSubmit}>
          {questions.map(({ id, question, options, type }) => (
            <div key={id} className="question-container">
              <h3>{question}</h3>
              <div
                className={
                  type === "checkbox" ? "checkbox-group" : "radio-group"
                }
              >
                {options.map((option) => (
                  <div key={option} className="option">
                    <input
                      type={type}
                      id={option}
                      name={id}
                      value={option}
                      checked={
                        type === "checkbox"
                          ? answers.sectors.includes(option)
                          : answers[id] === option
                      }
                      onChange={() =>
                        type === "checkbox"
                          ? handleCheckboxChange(option)
                          : handleRadioChange(id, option)
                      }
                      disabled={isSubmitting}
                    />
                    <label htmlFor={option}>{option}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "등록 중..." : "결과 보기"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default InvestmentPropensityPage;
