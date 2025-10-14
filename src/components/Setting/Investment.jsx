// src/components/Investment/InvestmentPropensityPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Investment.css';
import Header from '../common/Header';
import financeAxios from '../../api/financeAxiosInstance'; // ✅ 추가

const Investment = () => {
  const [answers, setAnswers] = useState({
    budget: '',
    sectors: [],
    goal: '',
    knowledge: '',
    loss: '',
    profit: '',
  });
  const [result, setResult] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const showHeader = !location.pathname.startsWith('/setting');

  const questions = [
    {
      id: 'budget',
      question: '1. 투자 예산',
      options: ['50만원 이하', '100만원 이하', '200만원 이하', '500만원 이하', '1000만원 이하'],
      type: 'radio',
    },
    {
      id: 'sectors',
      question: '2. 관심 종목 (최소 3개 선택)',
      options: [
        '전기전자', '자동차', '철강금속', '화학', '서비스업', '통신',
        '금융업', '증권', '보험', '건설업', '기계', '전기가스업',
        '의약품', '섬유의복', '음식료품', '유통업', '운수창고',
        '운수장비(조선)', '종이목재', '비금속광물', '은행', '기타제조',
      ],
      type: 'checkbox',
    },
    {
      id: 'goal',
      question: '3. 투자 목표',
      options: ['학비', '생활비', '주택마련', '자산증식', '채무상환'],
      type: 'radio',
    },
    {
      id: 'knowledge',
      question: '4. 금융지식 이해도 수준',
      options: ['매우 낮음', '낮음', '보통', '높음', '매우 높음'],
      type: 'radio',
    },
    {
      id: 'loss',
      question: '5. 감당 가능한 손실 수준',
      options: ['원금 손실 없음', '원금의 10%', '원금의 30%', '원금의 50%', '원금의 70%', '원금 전액'],
      type: 'radio',
    },
    {
      id: 'profit',
      question: '6. 기대 이익 수준',
      options: ['150%', '200%', '250%', '300% 이상'],
      type: 'radio',
    },
  ];

  const handleRadioChange = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleCheckboxChange = (option) => {
    const newSectors = answers.sectors.includes(option)
      ? answers.sectors.filter((s) => s !== option)
      : [...answers.sectors, option];
    setAnswers({ ...answers, sectors: newSectors });
  };

  // ✅ 서버에 매핑될 ENUM 값 변환 로직
  const mapToServerEnum = {
    investmentProfile: {
      안정형: 'CONSERVATIVE',
      안정추구형: 'CAUTIOUS',
      위험중립형: 'NEUTRAL',
      적극투자형: 'AGGRESSIVE',
      공격투자형: 'VERY_AGGRESSIVE',
    },
    investmentGoal: {
      학비: 'TUITION',
      생활비: 'LIVING',
      주택마련: 'HOUSE_PURCHASE',
      자산증식: 'ASSET_GROWTH',
      채무상환: 'DEBT_REPAYMENT',
    },
    lossTolerance: {
      '원금 손실 없음': 'NO_LOSS',
      '원금의 10%': 'TEN_PERCENT',
      '원금의 30%': 'THIRTY_PERCENT',
      '원금의 50%': 'FIFTY_PERCENT',
      '원금의 70%': 'SEVENTY_PERCENT',
      '원금 전액': 'FULL_LOSS',
    },
    financialKnowledge: {
      '매우 낮음': 'VERY_LOW',
      낮음: 'LOW',
      보통: 'MEDIUM',
      높음: 'HIGH',
      '매우 높음': 'VERY_HIGH',
    },
    expectedProfit: {
      '150%': 'ONE_FIFTY_PERCENT',
      '200%': 'TWO_HUNDRED_PERCENT',
      '250%': 'TWO_FIFTY_PERCENT',
      '300% 이상': 'THREE_HUNDRED_PERCENT',
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (answers.sectors.length < 3) {
      alert('관심 종목은 최소 3개 이상 선택해야 합니다.');
      return;
    }

    const isFormValid =
      answers.budget &&
      answers.goal &&
      answers.knowledge &&
      answers.loss &&
      answers.profit;

    if (!isFormValid) {
      alert('모든 질문에 답변해주세요.');
      return;
    }

    // 투자 성향 계산 (기존 로직 그대로)
    let score = 0;
    score += ['50만원 이하', '100만원 이하', '200만원 이하', '500만원 이하', '1000만원 이하'].indexOf(answers.budget);
    score += ['매우 낮음', '낮음', '보통', '높음', '매우 높음'].indexOf(answers.knowledge);
    score += ['원금 손실 없음', '원금의 10%', '원금의 30%', '원금의 50%', '원금의 70%', '원금 전액'].indexOf(answers.loss);
    score += ['150%', '200%', '250%', '300% 이상'].indexOf(answers.profit);

    let profile = '';
    if (score <= 4) profile = '안정형';
    else if (score <= 8) profile = '안정추구형';
    else if (score <= 12) profile = '위험중립형';
    else if (score <= 16) profile = '적극투자형';
    else profile = '공격투자형';

    setResult(profile);

    // ✅ PATCH 요청 전송
    try {
      const payload = {
        investmentProfile: mapToServerEnum.investmentProfile[profile],
        availableAssets: 15000000, // ⚙️ 예시값 (필요시 예산에 따라 계산 가능)
        investmentGoal: mapToServerEnum.investmentGoal[answers.goal],
        lossTolerance: mapToServerEnum.lossTolerance[answers.loss],
        financialKnowledge: mapToServerEnum.financialKnowledge[answers.knowledge],
        expectedProfit: mapToServerEnum.expectedProfit[answers.profit],
        interestedSectorNames: answers.sectors, // ✅ 사용자가 선택한 종목명 배열
      };

      console.log("📤 투자 성향 전송 데이터:", payload);

      await financeAxios.patch("/api/user/investment-profile/my", payload);

      console.log("✅ 투자 성향 프로필 업데이트 완료");
    } catch (err) {
      console.error("❌ 투자 성향 저장 실패:", err);
      alert("투자 성향 정보를 저장하지 못했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  // ✅ 결과 출력
  if (result) {
    return (
      <div className="propensity-page-layout">
        {showHeader && <Header />}
        <main className="propensity-content">
          <div className="result-container">
            <h1>분석 결과</h1>
            <p>당신의 투자 성향은 <strong>{result}</strong>입니다.</p>
            <button 
              className="submit-button" 
              onClick={() => navigate('/portfolio-main')}
            >
              수정된 내 포트폴리오 확인하기
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ✅ 기본 폼 UI
  return (
    <div className="propensity-page-layout">
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
              <div className={type === 'checkbox' ? 'checkbox-group' : 'radio-group'}>
                {options.map((option) => (
                  <div key={option} className="option">
                    <input
                      type={type}
                      id={option}
                      name={id}
                      value={option}
                      checked={type === 'checkbox' ? answers.sectors.includes(option) : answers[id] === option}
                      onChange={() =>
                        type === 'checkbox'
                          ? handleCheckboxChange(option)
                          : handleRadioChange(id, option)
                      }
                    />
                    <label htmlFor={option}>{option}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button type="submit" className="submit-button">
            결과 보기
          </button>
        </form>
      </main>
    </div>
  );
};

export default Investment;
