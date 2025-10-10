import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaChevronDown,
  FaMinus,
  FaBriefcase,
  FaHome,
  FaGraduationCap,
  FaHeartbeat,
  FaUsers,
  FaSyncAlt,
} from "react-icons/fa";
import Header from "../common/Header";
import usePolicyStore from "../../store/usePolicyStore";
import "./PolicyPage.css";

// --- 필터 데이터 (남겨둠, 나중에 API 연결 시 사용 예정) ---
const policyCategories = {
  일자리: ["취업", "재직자", "창업"],
  주거: ["주택 및 거주지", "기숙사", "전월세 및 주거급여 지원"],
  교육: ["미래역량강화", "교육비지원", "온라인교육"],
  복지문화: ["취약계층 및 금융지원", "건강", "예술인 지원", "문화 활동"],
  참여권리: ["청년참여", "정책인프라구축", "청년국제교류", "권익보호"],
};

const personalInfoFilters = {
  학력: [
    "제한없음",
    "고졸 미만",
    "고교 재학",
    "고졸 예정",
    "고졸",
    "대학 재학",
    "대학 졸업",
    "석·박사",
    "기타",
  ],
  전공요건: [
    "제한없음",
    "인문계열",
    "사회계열",
    "상경계열",
    "이학계열",
    "공학계열",
    "예체능계열",
    "농산계열",
    "기타",
  ],
  취업상태: [
    "제한없음",
    "재직자",
    "자영업자",
    "미취업자",
    "프리랜서",
    "일용근로자",
    "(예비)창업자",
    "단기근로자",
    "영농종사자",
    "기타",
  ],
  특화분야: [
    "제한없음",
    "중소기업",
    "여성",
    "기초생활수급자",
    "한부모가정",
    "장애인",
    "농업인",
    "군인",
    "지역인재",
    "기타",
  ],
  혼인여부: ["전체", "미혼", "기혼"],
};

const PolicyPage = () => {
  const { policiesByPage, totalCount, isLoading, fetchPolicies } =
    usePolicyStore();

  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(12);

  const [sortOrder, setSortOrder] = useState("관련도순");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef(null);

  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: {},
    personal: {},
  });

  const policies = policiesByPage[pageNum] || [];
  const totalPages = Math.ceil(totalCount / pageSize);

  // ✅ 페이지 전환 시 데이터 로드
  useEffect(() => {
    fetchPolicies(pageNum, pageSize);
  }, [pageNum, pageSize, fetchPolicies]);

  // ✅ 외부 클릭 시 정렬 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target)
      ) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFilter = (name) => {
    setActiveFilter(activeFilter === name ? null : name);
  };

  const handleCategoryChange = (category, sub) => {
    const updated = { ...selectedFilters.categories };
    const list = updated[category] || [];

    if (list.includes(sub)) {
      updated[category] = list.filter((x) => x !== sub);
    } else {
      updated[category] = [...list, sub];
    }

    setSelectedFilters({ ...selectedFilters, categories: updated });
  };

  const handleSelectAll = (category, checked) => {
    const updated = { ...selectedFilters.categories };
    if (checked) updated[category] = policyCategories[category];
    else delete updated[category];
    setSelectedFilters({ ...selectedFilters, categories: updated });
  };

  const handlePersonalFilterChange = (type, value) => {
    const updated = { ...selectedFilters.personal };
    updated[type] = updated[type] === value ? null : value;
    setSelectedFilters({ ...selectedFilters, personal: updated });
  };

  const handleSearch = () => setActiveFilter(null);
  const handleReset = () =>
    setSelectedFilters({ categories: {}, personal: {} });

  const categoryIcons = {
    일자리: <FaBriefcase />,
    주거: <FaHome />,
    교육: <FaGraduationCap />,
    복지문화: <FaHeartbeat />,
    참여권리: <FaUsers />,
  };

  return (
    <div className="policy-page-layout">
      <Header />
      <main className="policy-content">
        <h1 className="page-title">청년정책 검색</h1>

        {/* --- 필터 영역 --- */}
        <div className="policy-filter-container">
          <div className="policy-filter-bar">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="검색어 입력" />
            </div>
            <button
              className={`filter-button ${
                activeFilter === "category" ? "active" : ""
              }`}
              onClick={() => toggleFilter("category")}
            >
              정책분야 {activeFilter === "category" ? <FaMinus /> : <FaPlus />}
            </button>
            <button
              className={`filter-button ${
                activeFilter === "personal" ? "active" : ""
              }`}
              onClick={() => toggleFilter("personal")}
            >
              퍼스널 정보{" "}
              {activeFilter === "personal" ? <FaMinus /> : <FaPlus />}
            </button>
          </div>

          {activeFilter === "category" && (
            <div className="policy-filter-panel">
              <div className="panel-grid">
                {Object.entries(policyCategories).map(
                  ([category, subcategories]) => {
                    const allSelected =
                      (selectedFilters.categories[category] || []).length ===
                      subcategories.length;
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
                              checked={allSelected}
                              onChange={(e) =>
                                handleSelectAll(category, e.target.checked)
                              }
                            />
                            <label htmlFor={`all-${category}`}>전체</label>
                          </div>
                          {subcategories.map((sub) => (
                            <div className="subcategory-item" key={sub}>
                              <input
                                type="checkbox"
                                id={sub}
                                checked={(
                                  selectedFilters.categories[category] || []
                                ).includes(sub)}
                                onChange={() =>
                                  handleCategoryChange(category, sub)
                                }
                              />
                              <label htmlFor={sub}>{sub}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
              <div className="panel-actions">
                <button className="search-button" onClick={handleSearch}>
                  <FaSearch /> 검색
                </button>
                <button className="reset-button" onClick={handleReset}>
                  <FaSyncAlt /> 초기화
                </button>
              </div>
            </div>
          )}

          {activeFilter === "personal" && (
            <div className="policy-filter-panel personal-info-panel">
              <div className="personal-info-grid">
                {Object.entries(personalInfoFilters).map(([title, options]) => (
                  <div className="filter-row" key={title}>
                    <label className="row-label">{title}</label>
                    <div className="tag-group">
                      {options.map((option) => (
                        <button
                          key={option}
                          className={`tag-button ${
                            selectedFilters.personal[title] === option
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            handlePersonalFilterChange(title, option)
                          }
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="panel-actions">
                <button className="search-button" onClick={handleSearch}>
                  <FaSearch /> 검색
                </button>
                <button className="reset-button" onClick={handleReset}>
                  <FaSyncAlt /> 초기화
                </button>
              </div>
            </div>
          )}
        </div>

        {/* --- 리스트 영역 --- */}
        <div className="policy-list-info-bar">
          <span>
            총 <strong>{totalCount}</strong>건의 정책정보가 있습니다.
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
                <li onClick={() => setSortOrder("관련도순")}>관련도순</li>
                <li onClick={() => setSortOrder("최신순")}>최신순</li>
                <li onClick={() => setSortOrder("인기순")}>인기순</li>
              </ul>
            )}
          </div>
        </div>

        {isLoading && !policies.length ? (
          <p style={{ textAlign: "center", marginTop: "50px" }}>
            정책 정보를 불러오는 중입니다...
          </p>
        ) : (
          <div className="policy-grid">
            {policies.length > 0 ? (
              policies.map((policy) => (
                <Link
                  to={`/policy/${policy.policy_id}`}
                  key={policy.policy_id}
                  className="policy-card-link"
                >
                  <div className="policy-card">
                    <div className="card-top">
                      <span className="status-badge">{policy.status}</span>
                      <div className="tags">
                        <span className="tag">{policy.category_large}</span>
                        {policy.keyword?.map((tag, i) => (
                          <span key={i} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h3 className="policy-title">{policy.title}</h3>
                    <p className="policy-description">
                      {policy.summary_raw || "설명이 없습니다."}
                    </p>
                    <div className="card-footer">
                      <div className="period-info">
                        <span className="period-label">신청기간</span>
                        <span className="period-date">
                          {policy.period_apply || "상시"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="no-data">표시할 정책이 없습니다.</p>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setPageNum((p) => Math.max(p - 1, 1))}
              disabled={pageNum === 1}
            >
              &lt; 이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(
                Math.max(0, pageNum - 3),
                Math.min(totalPages, pageNum + 2)
              )
              .map((page) => (
                <button
                  key={page}
                  className={page === pageNum ? "active" : ""}
                  onClick={() => setPageNum(page)}
                >
                  {page}
                </button>
              ))}
            <button
              onClick={() => setPageNum((p) => Math.min(p + 1, totalPages))}
              disabled={pageNum === totalPages}
            >
              다음 &gt;
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default PolicyPage;
