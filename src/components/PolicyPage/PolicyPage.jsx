import React, { useState, useEffect, useRef } from 'react';
import './PolicyPage.css';
import Header from '../common/Header';
import { FaSearch, FaPlus, FaChevronDown } from 'react-icons/fa';

// 예시 데이터
const policyData = [
  {
    status: '상시',
    tags: ['복지문화', '세종'],
    title: '일상돌봄서비스사업',
    description: '돌봄이 필요한 청년, 생계를 책임지는 가족돌봄청년에게 서비스 지원',
    period: '상시',
  },
  {
    status: '상시',
    tags: ['참여권리', '강원'],
    title: '대학 상생협력 강화',
    description: '춘천시와 관내 대학의 산학협력 인프라 구축을 통한 미래인재 양성 지원',
    period: '상시',
  },
  {
    status: '상시',
    tags: ['일자리', '대구'],
    title: '대구형 청년내일채움공제',
    description: '청년에게 자산 형성의 기회를 제공하여 지역 정착을 유도하고 지역기업의 고용안정화를 지원',
    period: '상시',
  },
  {
    status: '상시',
    tags: ['일자리', '울산'],
    title: '지방 공기업 청년의무고용제',
    description: '「청년고용촉진 특별법」에 따른 지방공기업 청년 고용비율 달성을 목표로 지역 청년 고용 확대',
    period: '상시',
  },
  {
    status: '모집중',
    tags: ['주거', '서울'],
    title: '청년임차보증금 이자지원',
    description: '목돈 마련이 어려운 청년들에게 임차보증금 대출 및 이자를 지원하여 주거비 부담 완화',
    period: '2025.10.01~',
  },
  {
    status: '모집중',
    tags: ['금융', '부산'],
    title: '부산청년 기쁨두배 통장',
    description: '부산시 거주 청년의 자산 형성을 통한 자립 기반 마련 지원',
    period: '2025.09.28~',
  },
  {
    status: '마감임박',
    tags: ['일자리', '인천'],
    title: '청년도전 지원사업',
    description: '구직단념청년 등의 노동시장 참여 및 취업 촉진 지원',
    period: '~2025.09.30',
  },
  {
    status: '상시',
    tags: ['마음건강', '광주'],
    title: '청년 마음건강 지원',
    description: '전문 심리상담 서비스를 제공하여 청년의 마음 건강 회복을 지원',
    period: '상시',
  },
  {
    status: '상시',
    tags: ['복지문화', '대전'],
    title: '대전청년내일희망카드',
    description: '미취업 청년의 구직활동 및 생활안정을 위해 복지포인트 지원',
    period: '상시',
  },
  {
    status: '모집중',
    tags: ['참여권리', '경기'],
    title: '경기청년 참여기구',
    description: '청년이 직접 정책을 제안하고 결정과정에 참여할 수 있는 기회 제공',
    period: '2025.11.01~',
  },
  {
    status: '상시',
    tags: ['일자리', '경남'],
    title: '경남 청년 일자리 프렌즈',
    description: '지역 청년과 기업을 연결하여 일자리 미스매치 해소 및 취업 연계 지원',
    period: '상시',
  },
  {
    status: '마감임박',
    tags: ['주거', '전북'],
    title: '청년 월세 지원사업',
    description: '저소득 청년 가구의 주거비 부담을 덜어주기 위해 월 최대 20만원 임차료 지원',
    period: '~2025.09.29',
  },
];

const PolicyPage = () => {
  // ✨ 드롭다운 메뉴가 열려있는지 관리하는 상태
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // ✨ 선택된 정렬 기준을 관리하는 상태
  const [sortOrder, setSortOrder] = useState('관련도순');
  // ✨ 드롭다운 DOM 요소를 참조하기 위한 ref
  const dropdownRef = useRef(null);
  
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // ✨ 드롭다운 외부를 클릭했을 때 메뉴가 닫히도록 하는 로직
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    // 이벤트 리스너 등록
    document.addEventListener('mousedown', handleClickOutside);
    // 컴포넌트가 사라질 때 이벤트 리스너 제거
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="policy-page-layout">
      <Header />
      <main className="policy-content">
        <h1 className="page-title">청년정책 검색</h1>
        
        <div className="policy-filter-bar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="검색어 입력" />
          </div>
          <button className="filter-button">담당기관 <FaPlus /></button>
          <button className="filter-button">정책분야 <FaPlus /></button>
          <button className="filter-button">퍼스널 정보 <FaPlus /></button>
        </div>

        <div className="policy-list-info-bar">
          <span>총 <strong>4,137</strong>건의 정책정보가 있습니다.</span>
          <div className="sort-dropdown-container" ref={dropdownRef}>
              <button 
                className="sort-dropdown-button" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {sortOrder} <FaChevronDown size="0.8em" />
              </button>
              {isDropdownOpen && (
                <ul className="sort-dropdown-menu">
                  <li onClick={() => { setSortOrder('관련도순'); setIsDropdownOpen(false); }}>관련도순</li>
                  <li onClick={() => { setSortOrder('최신순'); setIsDropdownOpen(false); }}>최신순</li>
                  <li onClick={() => { setSortOrder('인기순'); setIsDropdownOpen(false); }}>인기순</li>
                </ul>
              )}
            </div>
        </div>

        <div className="policy-grid">
          {policyData.map((policy, index) => (
            <div className="policy-card" key={index}>
              <div className="card-top">
                <span className="status-badge">{policy.status}</span>
                <div className="tags">
                  {policy.tags.map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
              <h3 className="policy-title">{policy.title}</h3>
              <p className="policy-description">{policy.description}</p>
              <div className="card-footer">
                <div className="period-info">
                  <strong>신청기간</strong>
                  <span>{policy.period}</span>
                </div>
                <button className="details-button">자세히보기</button>
              </div>
            </div>
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
          <a href="#">460</a>
          <a href="#">다음 &gt;</a>
        </div>
      </main>
    </div>
  );
};

export default PolicyPage;