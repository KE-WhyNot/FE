import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Investment.css';
import '../InvestmentPropensityPage/LoadingSpinner.css';
import Header from '../common/Header';
import useAuthStore from '../../store/useAuthStore';
import financeAxiosInstance from '../../api/financeAxiosInstance';

// --- 서버 명세에 맞게 매핑 ---
const profileMap = {
  안정형: 'CONSERVATIVE',
  안정추구형: 'CONSERVATIVE_SEEKING',
  위험중립형: 'RISK_NEUTRAL',
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
  주택마련: 'HOUSE_PURCHASE',
  자산증식: 'ASSET_GROWTH',
  채무상환: 'DEBT_REPAYMENT',
};

const lossMap = {
  '원금 손실 없음': 'NO_LOSS',
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
  '150%': 'ONE_FIFTY_PERCENT',
  '200%': 'TWO_HUNDRED_PERCENT',
  '250%': 'TWO_FIFTY_PERCENT',
  '300% 이상': 'THREE_HUNDRED_PERCENT_PLUS',
};

const availableSectors = [
  '화학', '제약', '전기·전자', '운송장비·부품',
  '기타금융', '기계·장비', '금속', '건설', 'IT 서비스'
];

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const showHeader = !location.pathname.startsWith('/setting');
  const { user } = useAuthStore();

  // ✅ 기존 투자 성향이 없으면 신규 등록 페이지로 이동
  useEffect(() => {
    const checkProfileExists = async () => {
      try {
        const response = await financeAxiosInstance.get(
          '/api/user/investment-profile/my',
          { headers: { 'X-User-Id': user?.userId } }
        );
        if (!response.data?.result) {
          console.log('❌ 기존 성향 없음 → 신규 등록 페이지로 이동');
          navigate('/investment-propensity');
        }
      } catch (error) {
        console.error('❌ 투자 성향 확인 실패:', error);
      }
    };
    checkProfileExists();
  }, [navigate, user?.userId]);

  // ✅ 라디오 선택
  const handleRadioChange = (id, option) =>
    setAnswers({ ...answers, [id]: option });

  // ✅ 체크박스 선택
  const handleCheckboxChange = (option) => {
    const isSelected = answers.sectors.includes(option);
    const newSectors = isSelected
      ? answers.sectors.filter((s) => s !== option)
      : [...answers.sectors, option];
    setAnswers({ ...answers, sectors: newSectors });
  };

  // ✅ 설문 제출 (POST + LLM 자동 호출)
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

    setIsSubmitting(true);

    // ✅ 점수 기반 투자 성향 계산
    let score = 0;
    score += [
      '50만원 이하',
      '100만원 이하',
      '200만원 이하',
      '500만원 이하',
      '1000만원 이하',
    ].indexOf(answers.budget);
    score += ['매우 낮음', '낮음', '보통', '높음', '매우 높음'].indexOf(
      answers.knowledge
    );
    score += [
      '원금 손실 없음',
      '원금의 10%',
      '원금의 30%',
      '원금의 50%',
      '원금의 70%',
      '원금 전액',
    ].indexOf(answers.loss);
    score += ['150%', '200%', '250%', '300% 이상'].indexOf(answers.profit);

    let resultType = '';
    if (score <= 4) resultType = '안정형';
    else if (score <= 8) resultType = '안정추구형';
    else if (score <= 12) resultType = '위험중립형';
    else if (score <= 16) resultType = '적극투자형';
    else resultType = '공격투자형';

    // ✅ 서버 요청용 payload
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
      console.log('📤 투자 성향 등록 요청 중...');
      const res = await financeAxiosInstance.post(
        'https://finance.youth-fi.com/api/user/investment-profile/complete',
        payload,
        { headers: { 'X-User-Id': user?.userId } }
      );
      console.log('✅ 투자 성향 등록 성공:', res.data);

      // ✅ 등록 성공 시 LLM 자동 요청
      try {
        console.log('📤 LLM 요청 시작...');
        const llmRes = await financeAxiosInstance.post(
          'https://finance.youth-fi.com/api/user/investment-profile/send-to-llm',
          {},
          { headers: { 'X-User-Id': user?.userId } }
        );
        console.log('✅ LLM 요청 완료:', llmRes.data);
      } catch (llmErr) {
        console.error('⚠️ LLM 요청 실패:', llmErr);
      }

      // ✅ 결과 표시 및 이동
      setResult(resultType);
    } catch (error) {
      console.error('❌ 투자 성향 등록 실패:', error);
      alert('투자 성향 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ 결과 화면
  if (result) {
    return (
      <div className="propensity-page-layout">
        {showHeader && <Header />}
        <main className="propensity-content">
          <div className="result-container">
            <h1>등록 결과</h1>
            <p>
              당신의 새로운 투자 성향은 <strong>{result}</strong>입니다.
            </p>
            <button
              className="submit-button"
              onClick={() => navigate('/portfolio-main')}
            >
              포트폴리오 분석 페이지로 이동하기
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ✅ 기본 폼 UI
  return (
    <div className="propensity-page-layout">
      {isSubmitting && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      {showHeader && <Header />}
      <main className="propensity-content">
        <h1>투자 성향 수정</h1>
        <p className="description">
          투자 성향을 다시 분석하고 내 포트폴리오를 재구성해보세요.
        </p>
        <form onSubmit={handleSubmit}>
          {[
            {
              id: 'budget',
              question: '1. 투자 예산',
              options: [
                '50만원 이하',
                '100만원 이하',
                '200만원 이하',
                '500만원 이하',
                '1000만원 이하',
              ],
              type: 'radio',
            },
            {
              id: 'sectors',
              question: '2. 관심 종목 (3개 이상 선택)',
              options: availableSectors,
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
              options: [
                '원금 손실 없음',
                '원금의 10%',
                '원금의 30%',
                '원금의 50%',
                '원금의 70%',
                '원금 전액',
              ],
              type: 'radio',
            },
            {
              id: 'profit',
              question: '6. 기대하는 투자 수익률',
              options: ['150%', '200%', '250%', '300% 이상'],
              type: 'radio',
            },
          ].map(({ id, question, options, type }) => (
            <div key={id} className="question-container">
              <h3>{question}</h3>
              <div
                className={
                  type === 'checkbox' ? 'checkbox-group' : 'radio-group'
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
                        type === 'checkbox'
                          ? answers.sectors.includes(option)
                          : answers[id] === option
                      }
                      onChange={() =>
                        type === 'checkbox'
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
            {isSubmitting ? '등록 중...' : '결과 보기'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Investment;
