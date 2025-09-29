import React, { useState } from "react";
import "./Quiz.css";

// --- 퀴즈 데이터 (해설 추가) ---
const quizData = [
  {
    question: "뉴스에서 \"A기업이 '어닝 서프라이즈(Earning Surprise)'를 기록했다\"는 말을 들었습니다. 이것은 무엇을 의미할까요?",
    options: ["기업의 영업 실적이 조만간 발표될 것이라는 예고의 의미", "기업의 실제 영업 실적이 시장의 예상보다 훨씬 나빴다는 의미", "기업의 실제 영업 실적이 시장의 예상보다 훨씬 좋았다는 의미"],
    answer: "기업의 실제 영업 실적이 시장의 예상보다 훨씬 좋았다는 의미",
    explanation: "'어닝 서프라이즈'는 기업이 시장의 예상치를 훨씬 뛰어넘는 좋은 실적을 발표했을 때 사용하는 용어입니다. 반대로 예상보다 실적이 나쁘면 '어닝 쇼크'라고 합니다."
  },
  {
    question: "주식 시장에서 '매수'와 '매도'는 무슨 뜻일까요?",
    options: ["매수는 주식을 사는 것, 매도는 주식을 파는 것", "매수는 주식을 파는 것, 매도는 주식을 사는 것", "둘 다 주식을 보유하는 것을 의미"],
    answer: "매수는 주식을 사는 것, 매도는 주식을 파는 것",
    explanation: "주식을 사는 행위를 '매수', 파는 행위를 '매도'라고 합니다. 가장 기본적인 용어이므로 꼭 기억해두는 것이 좋습니다."
  },
  {
    question: "삼성전자, 애플처럼 규모가 크고 안정적인 회사의 주식을 무엇이라고 부를까요?",
    options: ["테마주", "성장주", "우량주(블루칩)"],
    answer: "우량주(블루칩)",
    explanation: "우량주 또는 블루칩은 재무 구조가 안정적이고 오랜 기간 꾸준한 성과를 보여온 대형 기업의 주식을 의미합니다."
  },
  {
    question: "주식을 샀을 때, 회사가 벌어들인 이익의 일부를 주주들에게 나눠주는 것을 무엇이라고 할까요?",
    options: ["시세차익", "배당금", "증자"],
    answer: "배당금",
    explanation: "배당금은 기업이 이익을 주주들과 공유하는 것입니다. 모든 회사가 배당금을 지급하는 것은 아니며, 이는 회사의 정책에 따라 다릅니다."
  },
  {
    question: "주식 시장이 열리는 정규 시간은 보통 언제일까요?",
    options: ["24시간 언제나", "오전 9시부터 오후 3시 30분까지", "오후 6시부터 다음 날 아침 6시까지"],
    answer: "오전 9시부터 오후 3시 30분까지",
    explanation: "한국 주식 시장의 정규 거래 시간은 평일 오전 9시부터 오후 3시 30분까지입니다. (공휴일 제외)"
  },
];

const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  // ✨ '답변 확인 전', '정답', '오답' 상태를 관리하는 state
  const [answerStatus, setAnswerStatus] = useState(null); 

  const currentQuestion = quizData[currentQuestionIndex];

  const handleOptionSelect = (option) => {
    // 이미 답을 확인한 후에는 선택을 변경할 수 없도록 함
    if (answerStatus) return; 
    setSelectedOption(option);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;

    if (selectedOption === currentQuestion.answer) {
      setScore(score + 1);
      setAnswerStatus('correct');
    } else {
      setAnswerStatus('incorrect');
    }
  };

  const handleNextQuestion = () => {
    setAnswerStatus(null);
    setSelectedOption(null);

    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };
  
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setAnswerStatus(null);
  }

  return (
    <div className="quiz-page-container">
      {showResult ? (
        <div className="quiz-result">
          <h2>퀴즈 결과</h2>
          <p>총 {quizData.length}문제 중 <strong>{score}</strong>문제를 맞히셨습니다!</p>
          <button onClick={restartQuiz}>다시 풀기</button>
        </div>
      ) : (
        <div className="quiz-card">
          <div className="quiz-header"><h1>유스파이 퀴즈 #{currentQuestionIndex + 1}</h1></div>
          <div className="quiz-question"><p>{currentQuestion.question}</p></div>
          <div className="quiz-options">
            {currentQuestion.options.map((option, index) => {
              // ✨ 정답 확인 후, 각 옵션에 'correct', 'incorrect' 클래스를 부여
              let btnClass = "option-btn";
              if (answerStatus) {
                if (option === currentQuestion.answer) {
                  btnClass += " correct";
                } else if (option === selectedOption) {
                  btnClass += " incorrect";
                }
              } else if (selectedOption === option) {
                btnClass += " selected";
              }

              return (
                <button
                  key={index}
                  className={btnClass}
                  onClick={() => handleOptionSelect(option)}
                  disabled={answerStatus !== null} // 답 확인 후 비활성화
                >
                  <span className="option-label">{String.fromCharCode(65 + index)}</span>
                  {option}
                </button>
              );
            })}
          </div>

          {/* ✨ 정답/오답 피드백 및 해설 표시 */}
          {answerStatus && (
            <div className={`answer-feedback ${answerStatus}`}>
              <h3>{answerStatus === 'correct' ? '정답입니다!' : '오답입니다.'}</h3>
              <p>{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="quiz-footer">
            <div className="progress-bar">
              <div className="progress" style={{ width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%` }}></div>
              <span>{currentQuestionIndex + 1}/{quizData.length}</span>
            </div>

            {/* ✨ 상태에 따라 다른 버튼 표시 */}
            {!answerStatus ? (
              <button className="next-btn" onClick={handleCheckAnswer} disabled={!selectedOption}>
                채점하기
              </button>
            ) : (
              <button className="next-btn" onClick={handleNextQuestion}>
                {currentQuestionIndex < quizData.length - 1 ? '다음 문제' : '결과 보기'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;