import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ✨ Link, useNavigate 추가
import './InvestmentPropensityPage.css';
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
  const navigate = useNavigate(); // ✨ navigate 함수 사용

  const questions = [
    {
      id: 'budget',
      question: '1. 투자 예산',
      options: ['천원', '만원', '십만원', '백만원', '천만원'],
      type: 'radio',
    },
    {
      id: 'sectors',
      question: '2. 관심 섹터 (최소 3개 선택)',
      options: [
        '전기전자', '자동차', '철강금속', '화학', '서비스업', '통신업', 
        '금융업', '증권', '보험', '건설업', '기계', '전기가스업', 
        '의약품', '섬유의복', '음식료품', '유통업', '운수창고', 
        '운수장비(조선)', '종이목재', '비금속광물', '은행', '기타제조'
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
      alert('관심 섹터는 최소 3개 이상 선택해야 합니다.');
      return;
    }

    let score = 0;
    score += ['천원', '만원', '십만원', '백만원', '천만원'].indexOf(answers.budget);
    score += ['매우 낮음', '낮음', '보통', '높음', '매우 높음'].indexOf(answers.knowledge);
    score += ['원금 손실 없음', '원금의 10%', '원금의 30%', '원금의 50%', '원금의 70%', '원금 전액'].indexOf(answers.loss);
    score += ['150%', '200%', '250%', '300% 이상'].indexOf(answers.profit);

    if (score <= 4) setResult('안정형');
    else if (score <= 8) setResult('안정추구형');
    else if (score <= 12) setResult('위험중립형');
    else if (score <= 16) setResult('적극투자형');
    else setResult('공격투자형');
  };

  // ✨ 3. 결과 화면 렌더링 로직
  if (result) {
    return (
      <div className="propensity-page-layout">
        <Header />
        <main className="propensity-content">
          <div className="result-container">
            <h1>분석 결과</h1>
            <p>당신의 투자 성향은 <strong>{result}</strong>입니다.</p>
            <button 
              className="submit-button" 
              onClick={() => navigate('/portfolio-main')}
            >
              내 포트폴리오 확인하기
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ✨ 4. 설문지 화면 렌더링 로직
  return (
    <div className="propensity-page-layout">
      <Header />
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
          <button type="submit" className="submit-button">결과 보기</button>
        </form>
      </main>
    </div>
  );
};

export default InvestmentPropensityPage;