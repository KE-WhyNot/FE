import React from 'react';
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
          <div className="sort-dropdown">
            최고금리순 <FaChevronDown />
          </div>
        </div>

        {/* --- 예적금 목록 --- */}
        <div className="savings-list-container">
          {savingsData.map((item, index) => (
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