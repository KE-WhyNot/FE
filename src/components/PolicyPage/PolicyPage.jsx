import React, { useEffect, useRef, useState } from "react";
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
import { usePoliciesQuery } from "../../hooks/usePoliciesQuery";
import usePolicyUIStore from "../../store/usePolicyUIStore";
import "./PolicyPage.css";

// --- 필터 데이터 (고정값) ---
const policyCategories = {
  일자리: ["취업", "재직자", "창업"],
  주거: ["주택 및 거주지", "기숙사", "전월세 및 주거급여 지원"],
  교육: ["미래역량강화", "교육비지원", "온라인교육"],
  복지문화: ["취약계층 및 금융지원", "건강", "예술인지원", "문화활동"],
  참여권리: ["청년참여", "정책인프라구축", "청년국제교류", "권익보호"],
};

const personalInfoFilters = {
  학력: [
    "제한없음",
    "고졸 미만",
    "고교 재학",
    "고졸 예정",
    "고교 졸업",
    "대학 재학",
    "대졸 예정",
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
    "농산업계열",
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
  const {
    pageNum,
    pageSize,
    setPageNum,
    sortOrder,
    setSortOrder,
    isSortDropdownOpen,
    toggleSortDropdown,
    closeSortDropdown,
    activeFilter,
    setActiveFilter,
    selectedFilters,
    setSelectedFilters,
    resetFilters,
  } = usePolicyUIStore();

  const sortDropdownRef = useRef(null);

  useEffect(() => {
    setPageNum(1);
  }, [setPageNum]);

  const { data, isLoading, isError, error, refetch, isFetching } =
    usePoliciesQuery(pageNum, pageSize, selectedFilters, sortOrder);

  const policies = data?.list || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // 정렬 드롭다운 외부 클릭 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target)
      ) {
        closeSortDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeSortDropdown]);

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

  const handleSearch = () => {
    // 검색 시점에 API 호출
    refetch();
    setActiveFilter(null);
  };

  const handleReset = () => {
    resetFilters();
    refetch();
  };

  // 지역 선택 모달 상태
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [regions, setRegions] = useState([]);
  const [subRegions, setSubRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedSubRegions, setSelectedSubRegions] = useState([]);

  // 최상위 지역 로드
  useEffect(() => {
    if (isRegionModalOpen) {
      fetch("https://policy.youth-fi.com/api/policy/filter/region/2")
        .then((res) => res.json())
        .then((data) => setRegions(data.data))
        .catch((err) => console.error("지역 목록 로드 실패:", err));
    }
  }, [isRegionModalOpen]);

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    fetch(`https://policy.youth-fi.com/api/policy/filter/region/${region.id}`)
      .then((res) => res.json())
      .then((data) => setSubRegions(data.data))
      .catch((err) => console.error("하위 지역 로드 실패:", err));
  };

  const handleSubRegionToggle = (sub) => {
    setSelectedSubRegions((prev) => {
      if (prev.some((r) => r.id === sub.id)) {
        return prev.filter((r) => r.id !== sub.id);
      } else {
        return [...prev, sub];
      }
    });
  };

  const handleOpenRegionModal = () => setIsRegionModalOpen(true);
  const handleCloseRegionModal = () => setIsRegionModalOpen(false);

  const handleResetRegions = () => {
    setSelectedRegion(null);
    setSubRegions([]);
    setSelectedSubRegions([]);
  };

  const handleApplyRegions = () => {
    const newPersonalFilters = { ...selectedFilters.personal };

    if (selectedRegion) {
      // ✅ 전국 선택 시
      if (selectedRegion.name === "전국") {
        newPersonalFilters["지역"] = "전국";
      }
      // ✅ 시/도 전체 선택 시 (모든 하위 구/군이 선택됨)
      else if (
        selectedSubRegions.length > 0 &&
        selectedSubRegions.length === subRegions.length
      ) {
        newPersonalFilters["지역"] = `${selectedRegion.name} 전체`;
      }
      // ✅ 일부 구/군만 선택 시
      else if (selectedSubRegions.length > 0) {
        newPersonalFilters["지역"] = `${
          selectedRegion.name
        } ${selectedSubRegions.map((r) => r.name).join(", ")}`;
      }
      // ✅ 하위 지역이 전혀 선택되지 않은 경우
      else {
        newPersonalFilters["지역"] = selectedRegion.name;
      }
    } else {
      newPersonalFilters["지역"] = "";
    }

    // 지역 ID 저장 (API 호출 X)
    newPersonalFilters["지역_ID"] = {
      parentId: selectedRegion?.id || null,
      subIds: selectedSubRegions.map((r) => r.id),
    };

    setSelectedFilters({ ...selectedFilters, personal: newPersonalFilters });
    handleCloseRegionModal();
  };

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

        {/* 필터 영역 */}
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

          {/* 정책분야 필터 */}
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

          {/* 퍼스널 정보 필터 */}
          {activeFilter === "personal" && (
            <div className="policy-filter-panel personal-info-panel">
              <div className="personal-info-grid">
                {/* 지역 / 혼인여부 */}
                <div className="filter-row">
                  <div className="filter-group">
                    <label>지역</label>
                    <div className="region-select-box">
                      <select onClick={handleOpenRegionModal}>
                        <option value="">
                          {selectedFilters.personal["지역"]
                            ? selectedFilters.personal["지역"]
                            : "선택하세요."}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="filter-group">
                    <label>혼인여부</label>
                    <div className="region-select-box">
                      <select>
                        <option value="">선택하세요.</option>
                        <option value="미혼">미혼</option>
                        <option value="기혼">기혼</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 연령 / 연소득 */}
                <div className="filter-row">
                  <div className="filter-group">
                    <label>연령</label>
                    <div className="age-group">
                      <input
                        type="number"
                        placeholder="만"
                        min="0"
                        step="1"
                        onInput={(e) => {
                          // 0보다 작은 값 입력 불가
                          if (e.target.value < 0) e.target.value = 0;
                          // 소수점 입력 시 자동 정수화
                          e.target.value = e.target.value.replace(/\D/g, "");
                        }}
                        onWheel={(e) => e.target.blur()} // 🔥 마우스 휠로 값 변경 방지
                      />
                      <span>세</span>
                    </div>
                  </div>

                  <div className="filter-group income-group">
                    <label>연소득 (만원)</label>
                    <input
                      type="number"
                      placeholder="이상"
                      min="1"
                      step="1"
                      onInput={(e) => {
                        // 1 미만 금지
                        if (e.target.value < 1) e.target.value = "";
                        // 숫자만 허용
                        e.target.value = e.target.value.replace(/\D/g, "");
                      }}
                      onWheel={(e) => e.target.blur()} // 🔥 휠 방지
                    />
                    <span>~</span>
                    <input
                      type="number"
                      placeholder="이하"
                      min="1"
                      step="1"
                      onInput={(e) => {
                        if (e.target.value < 1) e.target.value = "";
                        e.target.value = e.target.value.replace(/\D/g, "");
                      }}
                      onWheel={(e) => e.target.blur()}
                    />
                  </div>
                </div>

                {/* 학력/전공/취업상태/특화 */}
                {Object.entries(personalInfoFilters).map(([title, options]) => {
                  if (["혼인여부"].includes(title)) return null;
                  return (
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
                  );
                })}
              </div>

              <div className="panel-actions">
                <button className="search-button" onClick={handleSearch}>
                  <FaSearch /> 검색
                </button>
                <button className="reset-button" onClick={handleReset}>
                  <FaSyncAlt /> 초기화
                </button>
              </div>

              {/* 지역 선택 모달 */}
              {isRegionModalOpen && (
                <div className="modal-overlay">
                  <div className="modal-container">
                    <div className="modal-header">
                      <h3>지역선택</h3>
                      <button
                        className="close-btn"
                        onClick={handleCloseRegionModal}
                      >
                        ×
                      </button>
                    </div>

                    <div className="modal-body">
                      <h4>지역</h4>
                      <div className="region-columns">
                        {/* 왼쪽 시도 리스트 */}
                        <div className="region-list">
                          <div
                            onClick={() => {
                              setSelectedRegion({ id: 0, name: "전국" });
                              setSubRegions([]);
                              setSelectedSubRegions([{ id: 0, name: "전국" }]);
                            }}
                            style={{
                              fontWeight:
                                selectedRegion?.id === 0 ? "600" : "normal",
                              color:
                                selectedRegion?.id === 0 ? "#4f46e5" : "#333",
                              cursor: "pointer",
                              marginBottom: "6px",
                            }}
                          >
                            전국
                          </div>

                          {regions.map((region) => (
                            <div
                              key={region.id}
                              onClick={() => handleRegionClick(region)}
                              style={{
                                fontWeight:
                                  selectedRegion?.id === region.id
                                    ? "600"
                                    : "normal",
                                color:
                                  selectedRegion?.id === region.id
                                    ? "#4f46e5"
                                    : "#333",
                                cursor: "pointer",
                              }}
                            >
                              {region.name}
                            </div>
                          ))}
                        </div>

                        {/* 오른쪽 하위 지역 리스트 */}
                        <div className="region-sublist">
                          {subRegions.length > 0 && (
                            <div
                              onClick={() => {
                                const isAllSelected =
                                  selectedSubRegions.length ===
                                  subRegions.length;
                                if (isAllSelected) {
                                  setSelectedSubRegions([]);
                                } else {
                                  setSelectedSubRegions([...subRegions]);
                                }
                              }}
                              style={{
                                fontWeight:
                                  selectedSubRegions.length ===
                                  subRegions.length
                                    ? "600"
                                    : "normal",
                                color:
                                  selectedSubRegions.length ===
                                  subRegions.length
                                    ? "#4f46e5"
                                    : "#333",
                                cursor: "pointer",
                                marginBottom: "6px",
                              }}
                            >
                              전체
                            </div>
                          )}

                          {subRegions.map((sub) => {
                            const selected = selectedSubRegions.some(
                              (r) => r.id === sub.id
                            );
                            return (
                              <div
                                key={sub.id}
                                onClick={() => handleSubRegionToggle(sub)}
                                style={{
                                  background: selected
                                    ? "#eef2ff"
                                    : "transparent",
                                  color: selected ? "#4f46e5" : "#333",
                                  borderRadius: "6px",
                                  padding: "4px 6px",
                                  cursor: "pointer",
                                }}
                              >
                                {sub.name}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <h4>선택된 지역</h4>
                      <div className="selected-region-list">
                        {selectedSubRegions.length > 0 ? (
                          selectedSubRegions.map((r) => (
                            <span
                              key={r.id}
                              style={{
                                display: "inline-block",
                                margin: "3px",
                                padding: "4px 10px",
                                borderRadius: "12px",
                                background: "#f3f4f6",
                                fontSize: "13px",
                              }}
                            >
                              {r.name}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: "#888" }}>
                            선택된 지역이 없습니다.
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button onClick={handleCloseRegionModal}>돌아가기</button>
                      <button className="reset" onClick={handleResetRegions}>
                        초기화
                      </button>
                      <button className="apply" onClick={handleApplyRegions}>
                        적용하기
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 리스트 영역 */}
        <div className="policy-list-info-bar">
          <span>
            총 <strong>{totalCount}</strong>건의 정책정보가 있습니다.
          </span>

          <div className="sort-dropdown-container" ref={sortDropdownRef}>
            <button
              className="sort-dropdown-button"
              onClick={toggleSortDropdown}
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

        {/* 데이터 표시 */}
        {isLoading || isFetching ? (
          <p style={{ textAlign: "center", marginTop: "50px" }}>
            정책 정보를 불러오는 중입니다...
          </p>
        ) : isError ? (
          <p style={{ textAlign: "center", color: "red" }}>
            데이터를 불러오지 못했습니다: {error.message}
          </p>
        ) : (
          <div className="policy-grid">
            {policies.length > 0 ? (
              policies.map((policy) => (
                <Link
                  to={`/policy/${policy.policy_id}`}
                  key={`${policy.policy_id}-${pageNum}`}
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
              <p className="no-data">검색 결과가 없습니다.</p>
            )}
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setPageNum(Math.max(pageNum - 1, 1))}
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
              onClick={() => setPageNum(Math.min(pageNum + 1, totalPages))}
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
