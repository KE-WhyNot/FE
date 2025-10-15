import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './InvestmentPropensityPage.css';
import './LoadingSpinner.css'; // 로딩 스피너 CSS 파일 import
import Header from '../common/Header';

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
  const [isNavigating, setIsNavigating] = useState(false); // 페이지 이동 로딩 상태 추가
  const navigate = useNavigate();
  const location = useLocation();
  const showHeader = !location.pathname.startsWith('/setting');

  const questions = [
    {
      id: 'budget',
      question: '1. 투자 예산',
      options: ['50만원 이하', '100만원 이하', '200만원 아하', '500만원 이하', '1000만원 이하'],
      type: 'radio',
    },
    {
      id: 'sectors',
      question: '2. 관심 종목 (최소 3개 선택)',
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
    const newSectors = answers.sectors.includes(option)
      ? answers.sectors.filter((s) => s !== option)
      : [...answers.sectors, option];
    setAnswers({ ...answers, sectors: newSectors });
  };

  const handleSubmit = (e) => {
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

    // 점수 계산 및 결과 설정 (로딩 없이 즉시)
    let score = 0;
    score += ['50만원 이하', '100만원 이하', '200만원 아하', '500만원 이하', '1000만원 이하'].indexOf(answers.budget);
    score += ['매우 낮음', '낮음', '보통', '높음', '매우 높음'].indexOf(answers.knowledge);
    score += ['원금 손실 없음', '원금의 10%', '원금의 30%', '원금의 50%', '원금의 70%', '원금 전액'].indexOf(answers.loss);
    score += ['150%', '200%', '250%', '300% 이상'].indexOf(answers.profit);

    if (score <= 4) setResult('안정형');
    else if (score <= 8) setResult('안정추구형');
    else if (score <= 12) setResult('위험중립형');
    else if (score <= 16) setResult('적극투자형');
    else setResult('공격투자형');
  };

  // 포트폴리오 페이지로 이동하는 함수
  const handleNavigateToPortfolio = () => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate('/portfolio-main');
    }, 1500); // 1.5초 후 페이지 이동
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

export default InvestmentPropensityPage;