import React, { useEffect, useState, useRef } from 'react';
import './Tutorial.css';

const Tutorial = ({ steps, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [styles, setStyles] = useState({
    highlight: {},
    tooltip: { opacity: 0 } // 처음에는 투명하게 시작
  });
  const tooltipRef = useRef(null);

  useEffect(() => {
    const targetElement = document.querySelector(steps[currentStep].target);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      
      const timer = setTimeout(() => {
        const rect = targetElement.getBoundingClientRect();
        const tooltipEl = tooltipRef.current;
        if (!tooltipEl) return;

        const newHighlightStyle = {
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          top: `${rect.top}px`,
          left: `${rect.left}px`,
        };

        const tooltipWidth = tooltipEl.offsetWidth;
        const tooltipHeight = tooltipEl.offsetHeight;
        const newTooltipStyle = { opacity: 1 }; // 새로운 위치에서 다시 보이도록 설정

        // 세로 위치 결정
        if (rect.bottom + tooltipHeight > window.innerHeight - 20) {
          newTooltipStyle.bottom = `${window.innerHeight - rect.top + 10}px`;
          newTooltipStyle.top = 'auto';
        } else {
          newTooltipStyle.top = `${rect.bottom + 10}px`;
          newTooltipStyle.bottom = 'auto';
        }

        // 가로 위치 결정
        if (rect.left + tooltipWidth > window.innerWidth - 20) {
          newTooltipStyle.right = `${window.innerWidth - rect.right}px`;
          newTooltipStyle.left = 'auto';
        } else {
          newTooltipStyle.left = `${rect.left}px`;
          newTooltipStyle.right = 'auto';
        }

        setStyles({
          highlight: newHighlightStyle,
          tooltip: newTooltipStyle
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [currentStep, steps]);

  // ✨ 여기가 핵심 수정 부분입니다.
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      // 1. 현재 말풍선을 투명하게 만들어 먼저 사라지는 효과를 줍니다.
      setStyles(prev => ({
        ...prev,
        tooltip: { ...prev.tooltip, opacity: 0 }
      }));

      // 2. 사라지는 애니메이션 시간(300ms)만큼 기다린 후, 다음 스텝으로 넘어갑니다.
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300); // CSS transition 시간과 일치시키는 것이 좋습니다.
      
    } else {
      onFinish();
    }
  };

  return (
    <div className="tutorial-overlay" onClick={handleNext}>
      <div className="highlight-box" style={styles.highlight}></div>
      <div className="tooltip" ref={tooltipRef} style={styles.tooltip}>
        <p>{steps[currentStep].content}</p>
        <div className="tooltip-footer">
          <span>{currentStep + 1} / {steps.length}</span>
          <button onClick={handleNext}>
            {currentStep === steps.length - 1 ? '완료' : '다음'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;