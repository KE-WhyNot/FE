import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './InvestmentPropensityPage.css';
import './LoadingSpinner.css';
import Header from '../common/Header';
import axiosInstance from '../../api/authAxiosInstance';
import useAuthStore from '../../store/useAuthStore'; // ✅ zustand 스토어 import

// --- API 요청을 위한 데이터 매핑 객체들 ---

const profileMap = {
  안정형: 'CONSERVATIVE',
  안정추구형: 'MODERATE_CONSERVATIVE',
  위험중립형: 'NEUTRAL',
  적극투자형: 'AGGRESSIVE',
  공격투자형: 'VERY_AGGRESSIVE',
};

const budgetMap = {
  '50만원 이하': 500000,
  '100만원 이하': 1000000,
  '200만원 이하': 2000000,
  '500만원 이하': 5000000,
  '1000만원 이하': 10000000,
};

const goalMap = {
  학비: 'EDUCATION',
  생활비: 'LIVING_EXPENSES',
  주택마련: 'HOUSING',
  자산증식: 'ASSET_GROWTH',
  채무상환: 'DEBT_REPAYMENT',
};

const lossMap = {
  '원금 손실 없음': 'ZERO_PERCENT',
  '원금의 10%': 'TEN_PERCENT',
  '원금의 30%': 'THIRTY_PERCENT',
  '원금의 50%': 'FIFTY_PERCENT',
  '원금의 70%': 'SEVENTY_PERCENT',
  '원금 전액': 'FULL_AMOUNT',
};

const knowledgeMap = {
  '매우 낮음': 'VERY_LOW',
  낮음: 'LOW',
  보통: 'MEDIUM',
  높음: 'HIGH',
  '매우 높음': 'VERY_HIGH',
};

const profitMap = {
  '150%': 'ONE_HUNDRED_FIFTY_PERCENT',
  '200%': 'TWO_HUNDRED_PERCENT',
  '250%': 'TWO_HUNDRED_FIFTY_PERCENT',
  '300% 이상': 'OVER_THREE_HUNDRED_PERCENT',
};


const InvestmentPropensityPage = () => {
  const [answers, setAnswers] = useState({
    budget: '',
    sectors: [],
    goal: '',
    knowledge: '',
    loss: '',
    profit: '',
  });
  const [result, setResult] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const showHeader = !location.pathname.startsWith('/setting');
  const { user } = useAuthStore(); // ✅ 전역 스토어에서 사용자 정보 가져오기

  const questions = [
    {
      id: 'budget',
      question: '1. 투자 예산',
      options: ['50만원 이하', '100만원 이하', '200만원 아하', '500만원 이하', '1000만원 이하'],
      type: 'radio',
    },
    {
      id: 'sectors',
      question: '2. 관심 종목 (3개 선택)',
      options: [
        '전기·전자', '제약', 'IT 서비스', '화학', '금속', '기타금융', '건설', '기계·장비', '운송장비·부품'
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
      question: '5. 투자원금에 손실이 발생한 경우 감당 할 수 있는 손실 수준',
      options: ['원금 손실 없음', '원금의 10%', '원금의 30%', '원금의 50%', '원금의 70%', '원금 전액'],
      type: 'radio',
    },
    {
      id: 'profit',
      question: '6. 생각하시는 투자원금에 대한 기대이익 수준',
      options: ['150%', '200%', '250%', '300% 이상'],
      type: 'radio',
    },
  ];

  const handleRadioChange = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleCheckboxChange = (option) => {
    const isSelected = answers.sectors.includes(option);
    
    if (!isSelected && answers.sectors.length >= 3) {
      return;
    }

    const newSectors = isSelected
      ? answers.sectors.filter((s) => s !== option)
      : [...answers.sectors, option];
      
    setAnswers({ ...answers, sectors: newSectors });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (answers.sectors.length !== 3) {
      alert('관심 종목은 3개를 선택해야 합니다.');
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

    setIsSubmitting(true);

    // 점수 계산 및 결과 유형 결정
    let score = 0;
    score += ['50만원 이하', '100만원 이하', '200만원 아하', '500만원 이하', '1000만원 이하'].indexOf(answers.budget);
    score += ['매우 낮음', '낮음', '보통', '높음', '매우 높음'].indexOf(answers.knowledge);
    score += ['원금 손실 없음', '원금의 10%', '원금의 30%', '원금의 50%', '원금의 70%', '원금 전액'].indexOf(answers.loss);
    score += ['150%', '200%', '250%', '300% 이상'].indexOf(answers.profit);

    let resultType = '';
    if (score <= 4) resultType = '안정형';
    else if (score <= 8) resultType = '안정추구형';
    else if (score <= 12) resultType = '위험중립형';
    else if (score <= 16) resultType = '적극투자형';
    else resultType = '공격투자형';

    const payload = {
        investmentProfile: profileMap[resultType],
        availableAssets: budgetMap[answers.budget],
        investmentGoal: goalMap[answers.goal],
        lossTolerance: lossMap[answers.loss],
        financialKnowledge: knowledgeMap[answers.knowledge],
        expectedProfit: profitMap[answers.profit],
        interestedSectorNames: answers.sectors.map(sector => sector.replace('·', '/')),
    };

    try {
        // ✅ API POST 요청 시 헤더에 X-User-Id 추가
        await axiosInstance.post('/api/user/investment-profile/complete', payload, {
          headers: {
            'X-User-Id': user?.userId
          }
        });
        
        setResult(resultType);
    } catch (error) {
        console.error("투자 성향 제출 실패:", error);
        alert('투자 성향 정보를 제출하는 데 실패했습니다. 다시 시도해주세요.');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleNavigateToPortfolio = () => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate('/portfolio-main');
    }, 1500);
  };

  if (result) {
    return (
      <div className="propensity-page-layout">
        {isNavigating && (
            <div className="loading-overlay">
                <div className="loading-spinner"></div>
            </div>
        )}
        {showHeader && <Header />}
        <main className="propensity-content">
          <div className="result-container">
            <h1>분석 결과</h1>
            <p>당신의 투자 성향은 <strong>{result}</strong>입니다.</p>
            <button
              className="submit-button"
              onClick={handleNavigateToPortfolio}
              disabled={isNavigating}
            >
              {isNavigating ? '분석 중...' : 'AI에게 내 포트폴리오 분석 요청하기'}
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
              <div className={type === 'checkbox' ? 'checkbox-group' : 'radio-group'}>
                {options.map((option) => (
                  <div key={option} className="option">
                    <input
                      type={type}
                      id={option}
                      name={id}
                      value={option}
                      checked={type === 'checkbox' ? answers.sectors.includes(option) : answers[id] === option}
                      onChange={() => type === 'checkbox' ? handleCheckboxChange(option) : handleRadioChange(id, option)}
                      disabled={isSubmitting}
                    />
                    <label htmlFor={option}>{option}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? '분석 중...' : '결과 보기'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default InvestmentPropensityPage;