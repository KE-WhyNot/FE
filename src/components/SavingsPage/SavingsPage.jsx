import React, { useState, useEffect, useRef } from 'react';
import './SavingsPage.css';
import Header from '../common/Header';
import { FaSearch, FaPlus, FaChevronDown, FaLandmark } from 'react-icons/fa';

// 예시 데이터 (실제로는 API를 통해 받아옵니다)
const savingsData = [
  {
    bank: 'SH수협은행',
    product: 'Sh첫만남우대예금',
    tags: ['방문없이 가입', '누구나가입'],
    maxRate: '2.90%',
    baseRate: '1.85%',
  },
  {
    bank: 'SC제일은행',
    product: 'e-그린세이브예금',
    tags: ['방문없이 가입', '누구나가입'],
    maxRate: '2.85%',
    baseRate: '2.55%',
  },
  {
    bank: '우리은행',
    product: '우리 첫거래 우대 정기예금',
    tags: ['특판', '방문없이 가입', '누구나가입'],
    maxRate: '2.80%',
    baseRate: '1.80%',
  },
  {
    bank: '제주은행',
    product: 'J정기예금',
    tags: ['특판', '방문없이 가입', '누구나가입'],
    maxRate: '2.75%',
    baseRate: '2.00%',
  },
  {
    bank: 'SH수협은행',
    product: 'Sh해양플라스틱Zero!예금',
    tags: ['방문없이 가입', '누구나가입'],
    maxRate: '2.75%',
    baseRate: '2.40%',
  },
  {
    bank: 'IBK기업은행',
    product: 'IBK D-day통장',
    tags: ['방문없이 가입', '누구나가입'],
    maxRate: '2.70%',
    baseRate: '2.20%',
  },
  {
    bank: '하나은행',
    product: '하나의 정기예금',
    tags: ['방문없이 가입', '누구나가입'],
    maxRate: '2.65%',
    baseRate: '2.10%',
  },
  {
    bank: 'KB국민은행',
    product: 'KB Star 정기예금',
    tags: ['방문없이 가입', '누구나가입'],
    maxRate: '2.60%',
    baseRate: '2.00%',
  },
  {
    bank: '신한은행',
    product: '쏠편한 정기예금',
    tags: ['특판', '방문없이 가입'],
    maxRate: '2.55%',
    baseRate: '1.95%',
  },
  {
    bank: '카카오뱅크',
    product: '카카오뱅크 정기예금',
    tags: ['방문없이 가입', '누구나가입'],
    maxRate: '2.50%',
    baseRate: '2.00%',
  },
];


const SavingsPage = () => {
    // --- State 추가 ---
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState('최고금리순');
    const dropdownRef = useRef(null);

    // --- 드롭다운 외부 클릭 감지를 위한 useEffect ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // --- 정렬 로직 추가 ---
    const sortedData = [...savingsData].sort((a, b) => {
        const rateA = parseFloat(sortOrder === '최고금리순' ? a.maxRate : a.baseRate);
        const rateB = parseFloat(sortOrder === '최고금리순' ? b.maxRate : b.baseRate);
        return rateB - rateA;
    });

  return (
    <div className="savings-page-layout">
      <Header />
      <main className="savings-content">
        <h1 className="page-title">예·적금</h1>

        <div className="content-wrapper">
        {/* --- 검색 및 필터 --- */}
        <div className="filter-bar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="검색어 입력" />
          </div>
          <button className="filter-button">
            기간·금액 <FaPlus />
          </button>
          <button className="filter-button">
            상품유형 <FaPlus />
          </button>
          <button className="filter-button">
            우대조건 <FaPlus />
          </button>
        </div>

        {/* --- 결과 정보 및 정렬 --- */}
        <div className="list-info-bar">
          <span className="total-count">
            총 <strong>4,137</strong>건의 예·적금 정보가 있습니다.
          </span>
          {/* --- 기존 정렬 텍스트를 드롭다운 메뉴로 교체 --- */}
          <div className="sort-dropdown-container" ref={dropdownRef}>
              <button
                  className="sort-dropdown-button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                  {sortOrder} <FaChevronDown size="0.8em" />
              </button>
              {isDropdownOpen && (
                  <ul className="sort-dropdown-menu">
                      <li onClick={() => { setSortOrder('최고금리순'); setIsDropdownOpen(false); }}>최고금리순</li>
                      <li onClick={() => { setSortOrder('기본금리순'); setIsDropdownOpen(false); }}>기본금리순</li>
                  </ul>
              )}
          </div>
        </div>

        {/* --- 예적금 목록 --- */}
        <div className="savings-list-container">
          {/* --- 기존 savingsData 대신 sortedData를 사용 --- */}
          {sortedData.map((item, index) => (
            <div className="savings-item" key={index}>
              <div className="item-left">
                <div className="bank-logo">
                  <FaLandmark />
                </div>
                <div className="product-info">
                  <span className="product-name">{item.product}</span>
                  <span className="bank-name">{item.bank}</span>
                  <div className="tags">
                    {item.tags.map((tag, i) => (
                      <span key={i} className={`tag ${tag === '특판' ? 'highlight' : ''}`}>
                        {tag}
                      </span>
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
          ))}
        </div>

        {/* --- 페이지네이션 --- */}
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