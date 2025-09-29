import React, { useState, useEffect, useRef } from 'react';
import './PolicyPage.css';
import Header from '../common/Header';
import {
  FaSearch, FaPlus, FaChevronDown, FaMinus, FaBriefcase, FaHome,
  FaGraduationCap, FaHeartbeat, FaUsers, FaSyncAlt
} from 'react-icons/fa';

// --- 필터링을 위한 상세 데이터 (분야, 세부항목) ---
const policyCategories = {
  '일자리': ['취업', '재직자', '창업'],
  '주거': ['주택 및 거주지', '기숙사', '전월세 및 주거급여 지원'],
  '교육': ['미래역량강화', '교육비지원', '온라인교육'],
  '복지문화': ['취약계층 및 금융지원', '건강', '예술인 지원', '문화 활동'],
  '참여권리': ['청년참여', '정책인프라구축', '청년국제교류', '권익보호'],
};

// --- 퍼스널 정보 필터 데이터 ---
const personalInfoFilters = {
    '학력': ['제한없음', '고졸 미만', '고교 재학', '고졸 예정', '고졸', '대학 재학', '대학 졸업', '석·박사', '기타'],
    '전공요건': ['제한없음', '인문계열', '사회계열', '상경계열', '이학계열', '공학계열', '예체능계열', '농산계열', '기타'],
    '취업상태': ['제한없음', '재직자', '자영업자', '미취업자', '프리랜서', '일용근로자', '(예비)창업자', '단기근로자', '영농종사자', '기타'],
    '특화분야': ['제한없음', '중소기업', '여성', '기초생활수급자', '한부모가정', '장애인', '농업인', '군인', '지역인재', '기타']
};

const policyData = [
  { id: 1, status: '상시', tags: ['일자리', '인천'], title: '청년도전 지원사업', description: '구직단념청년 등의 노동시장 참여 및 취업 촉진 지원', period: '~2025.09.30', agency: '중앙부처', category: '취업', personal_filters: { '취업상태': ['미취업자'] } },
  { id: 2, status: '상시', tags: ['일자리', '울산'], title: '지방 공기업 청년의무고용제', description: '지역 청년 고용 확대', period: '상시', agency: '중앙부처', category: '취업', personal_filters: { '학력': ['대학 졸업'] }  },
  { id: 3, status: '모집중', tags: ['주거', '서울'], title: '청년임차보증금 이자지원', description: '목돈 마련이 어려운 청년들에게 임차보증금 대출 및 이자를 지원', period: '2025.10.01~', agency: '지자체', category: '주택 및 거주지', personal_filters: { '연령': [19, 39], '연소득': [0, 5000] }  },
  { id: 4, status: '마감임박', tags: ['주거', '전북'], title: '청년 월세 지원사업', description: '저소득 청년 가구의 주거비 부담을 덜어주기 위해 월 임차료 지원', period: '~2025.09.29', agency: '지자체', category: '전월세 및 주거급여 지원', personal_filters: { '특화분야': ['기초생활수급자'] } },
  { id: 5, status: '상시', tags: ['교육', '강원'], title: '대학 상생협력 강화', description: '관내 대학의 산학협력 인프라 구축을 통한 미래인재 양성 지원', period: '상시', agency: '지자체', category: '미래역량강화', personal_filters: { '학력': ['대학 재학'] } },
  { id: 6, status: '상시', tags: ['복지문화', '세종'], title: '일상돌봄서비스사업', description: '돌봄이 필요한 청년에게 서비스 지원', period: '상시', agency: '중앙부처', category: '취약계층 및 금융지원', personal_filters: { '특화분야': ['한부모가정', '장애인'] } },
  { id: 7, status: '모집중', tags: ['복지문화', '부산'], title: '부산청년 기쁨두배 통장', description: '부산시 거주 청년의 자산 형성을 통한 자립 기반 마련 지원', period: '2025.09.28~', agency: '지자체', category: '취약계층 및 금융지원', personal_filters: { '특화분야': ['기초생활수급자'] } },
  { id: 8, status: '상시', tags: ['복지문화', '광주'], title: '청년 마음건강 지원', description: '전문 심리상담 서비스를 제공하여 청년의 마음 건강 회복을 지원', period: '상시', agency: '지자체', category: '건강', personal_filters: { '특화분야': [] } },
  { id: 9, status: '상시', tags: ['복지문화', '대전'], title: '대전청년내일희망카드', description: '미취업 청년의 구직활동 및 생활안정을 위해 복지포인트 지원', period: '상시', agency: '지자체', category: '취약계층 및 금융지원', personal_filters: { '취업상태': ['미취업자'] } },
  { id: 10, status: '모집중', tags: ['참여권리', '경기'], title: '경기청년 참여기구', description: '청년이 직접 정책을 제안하고 결정과정에 참여할 수 있는 기회 제공', period: '2025.11.01~', agency: '지자체', category: '청년참여', personal_filters: {} },
  { id: 11, status: '상시', tags: ['참여권리', '경남'], title: '경남 청년 일자리 프렌즈', description: '지역 청년과 기업을 연결하여 일자리 미스매치 해소 및 취업 연계 지원', period: '상시', agency: '지자체', category: '정책인프라구축', personal_filters: {} },
  { id: 12, status: '상시', tags: ['일자리', '대구'], title: '대구형 청년내일채움공제', description: '청년에게 자산 형성의 기회를 제공하여 지역 정착을 유도', period: '상시', agency: '지자체', category: '재직자', personal_filters: { '취업상태': ['재직자'] } },
];

const PolicyPage = () => {
  const [sortOrder, setSortOrder] = useState('관련도순');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef(null);

  const [activeFilter, setActiveFilter] = useState(null); 
  const [selectedFilters, setSelectedFilters] = useState({
    agency: '전체',
    categories: {},
    personal: {}
  });

  const filterRef = useRef(null);

  const filteredPolicies = policyData.filter(policy => {
    const agencyMatch = selectedFilters.agency === '전체' || policy.agency === selectedFilters.agency;
    const selectedCategories = Object.values(selectedFilters.categories).flat();
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(policy.category);
    
    const personalMatch = Object.entries(selectedFilters.personal).every(([key, value]) => {
      if (value === '제한없음') return true;
      const policyValue = policy.personal_filters?.[key];
      if (!policyValue) return true; // 정책에 해당 조건 없으면 통과
      if(Array.isArray(policyValue)) {
        return policyValue.includes(value);
      }
      return false;
    });

    return agencyMatch && categoryMatch && personalMatch;
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setActiveFilter(null);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFilter = (filterName) => {
    setActiveFilter(activeFilter === filterName ? null : filterName);
  };

  const handleCategoryChange = (category, subcategory) => {
    const updatedCategories = { ...selectedFilters.categories };
    const currentSubcategories = updatedCategories[category] || [];

    if (currentSubcategories.includes(subcategory)) {
      updatedCategories[category] = currentSubcategories.filter(item => item !== subcategory);
    } else {
      updatedCategories[category] = [...currentSubcategories, subcategory];
    }
    
    if (updatedCategories[category].length === 0) {
      delete updatedCategories[category];
    }

    setSelectedFilters({ ...selectedFilters, categories: updatedCategories });
  };

  const handleSelectAll = (category, isChecked) => {
    const updatedCategories = { ...selectedFilters.categories };

    if (isChecked) {
      updatedCategories[category] = policyCategories[category];
    } else {
      delete updatedCategories[category];
    }

    setSelectedFilters({ ...selectedFilters, categories: updatedCategories });
  };
  
  const handlePersonalFilterChange = (filterType, value) => {
      const newPersonalFilters = { ...selectedFilters.personal };
      if (newPersonalFilters[filterType] === value) {
          delete newPersonalFilters[filterType];
      } else {
          newPersonalFilters[filterType] = value;
      }
      setSelectedFilters({ ...selectedFilters, personal: newPersonalFilters });
  }

  const handleSearch = () => setActiveFilter(null);
  
  const handleReset = () => {
    setSelectedFilters({ agency: '전체', categories: {}, personal: {} });
  };
  
  const categoryIcons = {
    '일자리': <FaBriefcase />, '주거': <FaHome />, '교육': <FaGraduationCap />,
    '복지문화': <FaHeartbeat />, '참여권리': <FaUsers />,
  };

  return (
    <div className="policy-page-layout">
      <Header />
      <main className="policy-content">
        <h1 className="page-title">청년정책 검색</h1>
        
        <div className="policy-filter-container" ref={filterRef}>
          <div className="policy-filter-bar">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="검색어 입력" />
            </div>
            <div className="filter-item">
                <button className={`filter-button ${activeFilter === 'agency' ? 'active' : ''}`} onClick={() => toggleFilter('agency')}>
                    담당기관 {activeFilter === 'agency' ? <FaMinus /> : <FaPlus />}
                </button>
                {activeFilter === 'agency' && (
                    <ul className="filter-dropdown-menu">
                        <li onClick={() => { setSelectedFilters(f => ({...f, agency: '전체'})); setActiveFilter(null); }}>전체</li>
                        <li onClick={() => { setSelectedFilters(f => ({...f, agency: '중앙부처'})); setActiveFilter(null); }}>중앙부처 정책</li>
                        <li onClick={() => { setSelectedFilters(f => ({...f, agency: '지자체'})); setActiveFilter(null); }}>지자체 정책</li>
                    </ul>
                )}
            </div>
            <button className={`filter-button ${activeFilter === 'category' ? 'active' : ''}`} onClick={() => toggleFilter('category')}>
              정책분야 {activeFilter === 'category' ? <FaMinus /> : <FaPlus />}
            </button>
            <button className={`filter-button ${activeFilter === 'personal' ? 'active' : ''}`} onClick={() => toggleFilter('personal')}>
              퍼스널 정보 {activeFilter === 'personal' ? <FaMinus /> : <FaPlus />}
            </button>
          </div>
          
          {activeFilter === 'category' && (
            <div className="policy-filter-panel">
              <div className="panel-grid">
                {Object.entries(policyCategories).map(([category, subcategories]) => {
                  const isAllSelected = (selectedFilters.categories[category] || []).length === subcategories.length;
                  return (
                    <div className="panel-category" key={category}>
                      <div className="category-header">
                        {categoryIcons[category]}
                        <h4>{category}</h4>
                      </div>
                      <div className="subcategory-list">
                        <div className="subcategory-item all-checkbox">
                          <input
                            type="checkbox"
                            id={`all-${category}`}
                            checked={isAllSelected}
                            onChange={(e) => handleSelectAll(category, e.target.checked)}
                          />
                          <label htmlFor={`all-${category}`}>전체</label>
                        </div>
                        {subcategories.map(sub => (
                          <div className="subcategory-item" key={sub}>
                            <input
                              type="checkbox"
                              id={sub}
                              checked={(selectedFilters.categories[category] || []).includes(sub)}
                              onChange={() => handleCategoryChange(category, sub)}
                            />
                            <label htmlFor={sub}>{sub}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="panel-actions">
                <button className="search-button" onClick={handleSearch}><FaSearch /> 검색</button>
                <button className="reset-button" onClick={handleReset}><FaSyncAlt /> 초기화</button>
              </div>
            </div>
          )}
          
          {activeFilter === 'personal' && (
            <div className="policy-filter-panel personal-info-panel">
                <div className="personal-info-grid">
                    <div className="filter-row">
                        <div className="filter-group">
                            <label>지역</label>
                            <select><option>선택하세요.</option></select>
                            <button className="select-button">선택</button>
                        </div>
                        <div className="filter-group">
                            <label>혼인여부</label>
                            <select><option>선택하세요.</option></select>
                        </div>
                    </div>
                    <div className="filter-row">
                        <div className="filter-group">
                            <label>연령</label>
                            <input type="number" placeholder="만" />
                            <span>세</span>
                        </div>
                         <div className="filter-group income-group">
                            <label>연소득</label>
                            <input type="number" placeholder="이상" />
                            <span>~</span>
                            <input type="number" placeholder="이하" />
                        </div>
                    </div>
                    {Object.entries(personalInfoFilters).map(([title, options]) => (
                        <div className="filter-row" key={title}>
                             <label className="row-label">{title}</label>
                             <div className="tag-group">
                                {options.map(option => (
                                    <button
                                        key={option}
                                        className={`tag-button ${selectedFilters.personal[title] === option ? 'active' : ''}`}
                                        onClick={() => handlePersonalFilterChange(title, option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                             </div>
                        </div>
                    ))}
                </div>
              <div className="panel-actions">
                <button className="search-button" onClick={handleSearch}><FaSearch /> 검색</button>
                <button className="reset-button" onClick={handleReset}><FaSyncAlt /> 초기화</button>
              </div>
            </div>
          )}
        </div>
        
        <div className="policy-list-info-bar">
          <span>총 <strong>{filteredPolicies.length}</strong>건의 정책정보가 있습니다.</span>
          <div className="sort-dropdown-container" ref={sortDropdownRef}>
              <button 
                className="sort-dropdown-button" 
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              >
                {sortOrder} <FaChevronDown size="0.8em" />
              </button>
              {isSortDropdownOpen && (
                <ul className="sort-dropdown-menu">
                  <li onClick={() => { setSortOrder('관련도순'); setIsSortDropdownOpen(false); }}>관련도순</li>
                  <li onClick={() => { setSortOrder('최신순'); setIsSortDropdownOpen(false); }}>최신순</li>
                  <li onClick={() => { setSortOrder('인기순'); setIsSortDropdownOpen(false); }}>인기순</li>
                </ul>
              )}
            </div>
        </div>
        <div className="policy-grid">
          {filteredPolicies.map((policy) => (
            <div className="policy-card" key={policy.id}>
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
                  <span className="period-label">신청기간</span>
                  <span className="period-date">{policy.period}</span>
                </div>
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