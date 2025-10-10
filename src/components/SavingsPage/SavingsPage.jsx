import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // ✨ 1. Link 컴포넌트 import
import './SavingsPage.css';
import Header from '../common/Header';
import { FaSearch, FaPlus, FaChevronDown, FaLandmark, FaMinus, FaSyncAlt } from 'react-icons/fa';

// 예시 데이터에 id 추가
const savingsData = [
    { id: 'ad8c6895fdfa41f3b7a384f9abc78ab8', bank: 'SH수협은행', product: 'Sh첫만남우대예금', tags: ['방문없이 가입', '누구나가입'], maxRate: '2.90%', baseRate: '1.85%', period: 12, benefits: ['첫거래', '비대면가입'] },
    { id: 'e-greencsaveyegum', bank: 'SC제일은행', product: 'e-그린세이브예금', tags: ['방문없이 가입', '누구나가입'], maxRate: '2.85%', baseRate: '2.55%', period: 6, benefits: ['비대면가입'] },
    { id: 'woori-first-deal', bank: '우리은행', product: '우리 첫거래 우대 정기예금', tags: ['특판', '방문없이 가입', '누구나가입'], maxRate: '2.80%', baseRate: '1.80%', period: 12, benefits: ['첫거래', '은행앱사용'] },
    { id: 'jeju-j-deposit', bank: '제주은행', product: 'J정기예금', tags: ['특판', '방문없이 가입', '누구나가입'], maxRate: '2.75%', baseRate: '2.00%', period: 24, benefits: ['비대면가입'] },
    { id: 'sh-plastic-zero', bank: 'SH수협은행', product: 'Sh해양플라스틱Zero!예금', tags: ['방문없이 가입', '누구나가입'], maxRate: '2.75%', baseRate: '2.40%', period: 6, benefits: ['카드사용'] },
    { id: 'ibk-d-day', bank: 'IBK기업은행', product: 'IBK D-day통장', tags: ['방문없이 가입', '누구나가입'], maxRate: '2.70%', baseRate: '2.20%', period: 12, benefits: ['급여연동', '공과금연동'] },
    { id: 'hana-one-deposit', bank: '하나은행', product: '하나의 정기예금', tags: ['방문없이 가입', '누구나가입'], maxRate: '2.65%', baseRate: '2.10%', period: 24, benefits: ['연금'] },
    { id: 'kb-star-deposit', bank: 'KB국민은행', product: 'KB Star 정기예금', tags: ['방문없이 가입', '누구나가입'], maxRate: '2.60%', baseRate: '2.00%', period: 12, benefits: ['은행앱사용', '재예치'] },
    { id: 'shinhan-sol-deposit', bank: '신한은행', product: '쏠편한 정기예금', tags: ['특판', '방문없이 가입'], maxRate: '2.55%', baseRate: '1.95%', period: 6, benefits: ['비대면가입', '은행앱사용'] },
    { id: 'kakao-deposit', bank: '카카오뱅크', product: '카카오뱅크 정기예금', tags: ['방문없이 가입', '누구나가입'], maxRate: '2.50%', baseRate: '2.00%', period: 12, benefits: ['비대면가입', '첫거래'] },
];


const SavingsPage = () => {
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState('최고금리순');
    const sortDropdownRef = useRef(null);

    const [isPeriodAmountFilterOpen, setIsPeriodAmountFilterOpen] = useState(false);
    const [depositAmount, setDepositAmount] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('전체');
    const periodAmountFilterRef = useRef(null);
    const periodButtonRef = useRef(null);

    const [isProductTypeFilterOpen, setIsProductTypeFilterOpen] = useState(false);
    const [selectedProductTypes, setSelectedProductTypes] = useState([]);
    const productTypeFilterRef = useRef(null);
    const productTypeButtonRef = useRef(null);

    const [isBenefitFilterOpen, setIsBenefitFilterOpen] = useState(false);
    const [selectedBenefits, setSelectedBenefits] = useState([]);
    const benefitFilterRef = useRef(null);
    const benefitButtonRef = useRef(null);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setIsSortDropdownOpen(false);
            }
            if (periodAmountFilterRef.current && !periodAmountFilterRef.current.contains(event.target) && !periodButtonRef.current.contains(event.target)) {
                setIsPeriodAmountFilterOpen(false);
            }
            if (productTypeFilterRef.current && !productTypeFilterRef.current.contains(event.target) && !productTypeButtonRef.current.contains(event.target)) {
                setIsProductTypeFilterOpen(false);
            }
            if (benefitFilterRef.current && !benefitFilterRef.current.contains(event.target) && !benefitButtonRef.current.contains(event.target)) {
                setIsBenefitFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const sortedData = [...savingsData].sort((a, b) => {
        const rateA = parseFloat(sortOrder === '최고금리순' ? a.maxRate : a.baseRate);
        const rateB = parseFloat(sortOrder === '최고금리순' ? b.maxRate : b.baseRate);
        return rateB - rateA;
    });

    const handlePeriodAmountReset = () => {
        setDepositAmount('');
        setSelectedPeriod('전체');
    };

    const handlePeriodAmountApply = () => {
        console.log('적용된 금액:', depositAmount, '적용된 기간:', selectedPeriod);
        setIsPeriodAmountFilterOpen(false);
    };

    const periodOptions = ['전체', '6개월', '12개월', '24개월'];

    const handleProductTypeChange = (type) => {
      setSelectedProductTypes(prevTypes => 
        prevTypes.includes(type) 
          ? prevTypes.filter(t => t !== type)
          : [...prevTypes, type]
      );
    };

    const handleProductTypeReset = () => {
      setSelectedProductTypes([]);
    };

    const handleProductTypeApply = () => {
      console.log('적용된 상품 유형:', selectedProductTypes);
      setIsProductTypeFilterOpen(false);
    };
    
    const productTypeOptions = ['특판', '방문없이 가입', '누구나가입'];

    const handleBenefitChange = (benefit) => {
      setSelectedBenefits(prevBenefits => 
        prevBenefits.includes(benefit) 
          ? prevBenefits.filter(b => b !== benefit)
          : [...prevBenefits, benefit]
      );
    };

    const handleBenefitReset = () => {
      setSelectedBenefits([]);
    };

    const handleBenefitApply = () => {
      console.log('적용된 우대조건:', selectedBenefits);
      setIsBenefitFilterOpen(false);
    };
    
    const benefitOptions = ['비대면가입', '은행앱사용', '급여연동', '연금', '공과금연동', '카드사용', '첫거래', '입출금통장', '재예치'];
  
  return (
    <div className="savings-page-layout">
      <Header />
      <main className="savings-content">
        <h1 className="page-title">예·적금</h1>

        <div className="content-wrapper">
        <div className="filter-bar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="검색어 입력" />
          </div>
          <div className="filter-item-container" ref={periodButtonRef}>
            <button 
              className={`filter-button ${isPeriodAmountFilterOpen ? 'active' : ''}`}
              onClick={() => setIsPeriodAmountFilterOpen(!isPeriodAmountFilterOpen)}
            >
              기간·금액 {isPeriodAmountFilterOpen ? <FaMinus /> : <FaPlus />}
            </button>
            {isPeriodAmountFilterOpen && (
              <div className="filter-panel" ref={periodAmountFilterRef}>
                <div className="panel-section">
                  <h4>예치금액</h4>
                  <div className="amount-input-group">
                    <input type="number" placeholder="금액 입력" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
                    <span>원</span>
                  </div>
                </div>
                <div className="panel-section">
                  <h4>기간</h4>
                  <div className="period-button-group">
                    {periodOptions.map(period => (
                      <button 
                        key={period}
                        className={`period-button ${selectedPeriod === period ? 'active' : ''}`}
                        onClick={() => setSelectedPeriod(period)}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="panel-actions">
                  <button className="reset-button" onClick={handlePeriodAmountReset}><FaSyncAlt /> 초기화</button>
                  <button className="apply-button" onClick={handlePeriodAmountApply}>적용</button>
                </div>
              </div>
            )}
          </div>
          <div className="filter-item-container" ref={productTypeButtonRef}>
            <button 
              className={`filter-button ${isProductTypeFilterOpen ? 'active' : ''}`}
              onClick={() => setIsProductTypeFilterOpen(!isProductTypeFilterOpen)}
            >
              상품유형 {isProductTypeFilterOpen ? <FaMinus /> : <FaPlus />}
            </button>
            {isProductTypeFilterOpen && (
              <div className="filter-panel" ref={productTypeFilterRef}>
                <div className="panel-section">
                  <h4>유형</h4>
                  <div className="product-type-button-group">
                    {productTypeOptions.map(type => (
                      <button 
                        key={type}
                        className={`period-button ${selectedProductTypes.includes(type) ? 'active' : ''}`}
                        onClick={() => handleProductTypeChange(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="panel-actions">
                  <button className="reset-button" onClick={handleProductTypeReset}><FaSyncAlt /> 초기화</button>
                  <button className="apply-button" onClick={handleProductTypeApply}>적용</button>
                </div>
              </div>
            )}
          </div>
          <div className="filter-item-container" ref={benefitButtonRef}>
            <button 
              className={`filter-button ${isBenefitFilterOpen ? 'active' : ''}`}
              onClick={() => setIsBenefitFilterOpen(!isBenefitFilterOpen)}
            >
              우대조건 {isBenefitFilterOpen ? <FaMinus /> : <FaPlus />}
            </button>
            {isBenefitFilterOpen && (
              <div className="filter-panel large" ref={benefitFilterRef}>
                <div className="panel-section">
                  <h4>우대조건</h4>
                  <div className="benefit-button-group">
                    {benefitOptions.map(benefit => (
                      <button 
                        key={benefit}
                        className={`period-button ${selectedBenefits.includes(benefit) ? 'active' : ''}`}
                        onClick={() => handleBenefitChange(benefit)}
                      >
                        {benefit}
                      </button>
                    ))}
                  </div>
                </div>
                <small className="panel-disclaimer">*신협 상품에는 적용되지 않습니다.</small>
                <div className="panel-actions">
                  <button className="reset-button" onClick={handleBenefitReset}><FaSyncAlt /> 초기화</button>
                  <button className="apply-button" onClick={handleBenefitApply}>적용</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="list-info-bar">
          <span className="total-count">
            총 <strong>{sortedData.length}</strong>건의 예·적금 정보가 있습니다.
          </span>
          <div className="sort-dropdown-container" ref={sortDropdownRef}>
              <button
                  className="sort-dropdown-button"
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              >
                  {sortOrder} <FaChevronDown size="0.8em" />
              </button>
              {isSortDropdownOpen && (
                  <ul className="sort-dropdown-menu">
                      <li onClick={() => { setSortOrder('최고금리순'); setIsSortDropdownOpen(false); }}>최고금리순</li>
                      <li onClick={() => { setSortOrder('기본금리순'); setIsSortDropdownOpen(false); }}>기본금리순</li>
                  </ul>
              )}
          </div>
        </div>

        <div className="savings-list-container">
          {sortedData.map((item) => (
            <Link to={`/savings/${item.id}`} key={item.id} className="savings-item-link">
                <div className="savings-item">
                    <div className="item-left">
                        <div className="bank-logo"><FaLandmark /></div>
                        <div className="product-info">
                            <span className="product-name">{item.product}</span>
                            <span className="bank-name">{item.bank}</span>
                            <div className="tags">
                                {item.tags.map((tag, i) => (
                                    <span key={i} className={`tag ${tag === '특판' ? 'highlight' : ''}`}>{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="item-right">
                        <div className="rate-info">
                            <span className="rate-max">최고 {item.maxRate}</span>
                            <span className="rate-base">기본 {item.baseRate}</span>
                        </div>
                    </div>
                </div>
            </Link>
          ))}
        </div>

        <div className="pagination">
          <a href="#">&lt; 이전</a>
          <a href="#" className="active">1</a>
          <a href="#">2</a>
          <a href="#">3</a>
          <a href="#">4</a>
          <a href="#">5</a>
          <span>...</span>
          <a href="#">99</a>
          <a href="#">다음 &gt;</a>
        </div>
        </div>
      </main>
    </div>
  );
};

export default SavingsPage;