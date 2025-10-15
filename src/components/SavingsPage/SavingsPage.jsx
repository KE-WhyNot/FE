import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './SavingsPage.css';
import Header from '../common/Header';
import { FaSearch, FaPlus, FaChevronDown, FaMinus, FaSyncAlt } from 'react-icons/fa';
import policyAxiosInstance from '../../api/policyAxiosInstance'; // ✅ 수정: 공용 인스턴스 사용
import Modal from '../common/Modal';
import qs from 'qs'; // ✅ qs 라이브러리 추가

const SavingsPage = () => {
    const [savingsData, setSavingsData] = useState([]);
    const [benefitOptions, setBenefitOptions] = useState([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const itemsPerPage = 10;

    const [selectedBankCategory, setSelectedBankCategory] = useState(0); 

    const [selectedCategories, setSelectedCategories] = useState([]);
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
    
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [bankOptions, setBankOptions] = useState([]);
    const [modalBankType, setModalBankType] = useState(1);
    const [tempSelectedBanks, setTempSelectedBanks] = useState([]);
    const [selectedBanks, setSelectedBanks] = useState([]);
    
    useEffect(() => {
      const fetchBenefitOptions = async () => {
        try {
          const benefitRes = await policyAxiosInstance.get('/api/finproduct/filter/special_condition?type=1');
          setBenefitOptions(benefitRes.data);
        } catch (error) {
          console.error("Failed to fetch benefit options:", error);
        }
      };
      fetchBenefitOptions();
    }, []);

    useEffect(() => {
        if (!isBankModalOpen) return;
        const fetchBankOptions = async () => {
            try {
                const response = await policyAxiosInstance.get('/api/finproduct/filter/bank', {
                    params: { type: modalBankType }
                });
                setBankOptions(response.data || []);
            } catch (error) {
                console.error("Failed to fetch bank options:", error);
                setBankOptions([]);
            }
        };
        fetchBankOptions();
    }, [isBankModalOpen, modalBankType]);

    useEffect(() => {
        const fetchSavingsData = async () => {
            try {
                const params = {
                    page_num: currentPage,
                    page_size: itemsPerPage,
                    product_type: selectedCategories.length === 1 ? (selectedCategories[0] === '예금' ? 1 : 2) : 0,
                    bank_type: selectedBankCategory !== 0 ? selectedBankCategory : null,
                    banks: selectedBanks.length > 0 ? selectedBanks : null,
                    periods: selectedPeriod === '전체' ? null : parseInt(selectedPeriod.replace('개월','')),
                    special_conditions: selectedBenefits.length > 0 ? selectedBenefits : null,
                    interest_rate_sort: sortOrder === '최고금리순' ? 'include_bonus' : 'base_only',
                };
                
                Object.keys(params).forEach(key => {
                  if (params[key] === null || params[key] === '' || (Array.isArray(params[key]) && params[key].length === 0)) {
                     if(key !== 'product_type') {
                       delete params[key];
                    }
                  }
                });
                
                // ✅ 수정: paramsSerializer 추가
                const response = await policyAxiosInstance.get('/api/finproduct/list', {
                  params,
                  paramsSerializer: params => {
                    return qs.stringify(params, { arrayFormat: 'repeat' });
                  }
                });
                
                let filteredData = response.data.result.finProductList;
                if (selectedProductTypes.length > 0) {
                    filteredData = filteredData.filter(item => 
                        selectedProductTypes.every(type => item.product_type_chip.includes(type))
                    );
                }

                setSavingsData(filteredData);
                setTotalCount(response.data.result.pagging.total_count);

            } catch (error) {
                console.error("Failed to fetch savings data:", error);
            }
        };

        fetchSavingsData();
    }, [selectedBankCategory, selectedCategories, selectedPeriod, selectedBenefits, sortOrder, currentPage, selectedProductTypes, selectedBanks]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) { setIsSortDropdownOpen(false); }
            if (periodAmountFilterRef.current && !periodAmountFilterRef.current.contains(event.target) && !periodButtonRef.current.contains(event.target)) { setIsPeriodAmountFilterOpen(false); }
            if (productTypeFilterRef.current && !productTypeFilterRef.current.contains(event.target) && !productTypeButtonRef.current.contains(event.target)) { setIsProductTypeFilterOpen(false); }
            if (benefitFilterRef.current && !benefitFilterRef.current.contains(event.target) && !benefitButtonRef.current.contains(event.target)) { setIsBenefitFilterOpen(false); }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePeriodAmountReset = () => { setDepositAmount(''); setSelectedPeriod('전체'); };
    const handlePeriodAmountApply = () => { setIsPeriodAmountFilterOpen(false); };
    const periodOptions = ['전체', '6개월', '12개월', '24개월'];

    const handleCategoryChange = (category) => { setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [category]); setCurrentPage(1); };
    const handleProductTypeChange = (type) => { setSelectedProductTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]); setCurrentPage(1); };
    
    const handleBankCategoryChange = (bankCategoryId) => {
      setSelectedBankCategory(bankCategoryId);
      setCurrentPage(1); 
    };

    const handleProductTypeReset = () => { 
        setSelectedProductTypes([]); 
        setSelectedCategories([]); 
        setSelectedBankCategory(0);
        setSelectedBanks([]);
        setCurrentPage(1);
    };
    const handleProductTypeApply = () => { setIsProductTypeFilterOpen(false); };
    
    const productTypeOptions = ['방문없이 가입', '누구나가입'];

    const handleBenefitChange = (benefit) => { setSelectedBenefits(prev => prev.includes(benefit) ? prev.filter(b => b !== benefit) : [...prev, benefit]); setCurrentPage(1); };
    const handleBenefitReset = () => { setSelectedBenefits([]); };
    const handleBenefitApply = () => { setIsBenefitFilterOpen(false); };
  
    const categoryTitle = selectedCategories.length === 1 ? selectedCategories[0] : '예·적금';
    
    const handleOpenBankModal = (bankType) => {
        setSelectedBankCategory(bankType);
        setModalBankType(bankType);
        setTempSelectedBanks(selectedBanks);
        setIsBankModalOpen(true);
    };

    const handleCloseBankModal = () => {
        setIsBankModalOpen(false);
    };

    const handleTempBankSelect = (bankNickname) => {
        setTempSelectedBanks(prev => 
            prev.includes(bankNickname) 
            ? prev.filter(b => b !== bankNickname) 
            : [...prev, bankNickname]
        );
    };

    const handleSelectAllBanks = (e) => {
        if (e.target.checked) {
            setTempSelectedBanks(bankOptions.map(b => b.nickname));
        } else {
            setTempSelectedBanks([]);
        }
    };

    const handleApplyBankSelection = () => {
        setSelectedBanks(tempSelectedBanks);
        handleCloseBankModal();
        setCurrentPage(1);
    };
    
    const renderPagination = () => {
        const totalPages = Math.ceil(totalCount / itemsPerPage);
        if (totalPages <= 1) return null;
        const pageGroupSize = 5;
        const currentPageGroup = Math.ceil(currentPage / pageGroupSize);
        let startPage = (currentPageGroup - 1) * pageGroupSize + 1;
        let endPage = Math.min(startPage + pageGroupSize - 1, totalPages);
        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }
        return (
          <div className="pagination">
            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.max(prev - 1, 1)); }}>&lt; 이전</a>
            {startPage > 1 && (<> <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(1); }}>1</a> <span>...</span> </>)}
            {pageNumbers.map(number => (<a href="#" key={number} className={currentPage === number ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCurrentPage(number); }}> {number} </a>))}
            {endPage < totalPages && (<> <span>...</span> <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(totalPages); }}>{totalPages}</a> </>)}
            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.min(prev + 1, totalPages)); }}>다음 &gt;</a>
          </div>
        );
    };

  return (
    <div className="savings-page-layout">
      <Header />
      <main className="savings-content">
        <h1 className="page-title">예·적금</h1>
        <div className="content-wrapper">
          <div className="filter-bar">
            <div className="search-box"> <FaSearch className="search-icon" /> <input type="text" placeholder="검색어 입력" /> </div>
            <div className="filter-item-container" ref={periodButtonRef}>
              <button className={`filter-button ${isPeriodAmountFilterOpen ? 'active' : ''}`} onClick={() => setIsPeriodAmountFilterOpen(!isPeriodAmountFilterOpen)}> 기간·금액 {isPeriodAmountFilterOpen ? <FaMinus /> : <FaPlus />} </button>
              {isPeriodAmountFilterOpen && ( <div className="filter-panel" ref={periodAmountFilterRef}> <div className="panel-section"> <h4>기간</h4> <div className="period-button-group"> {periodOptions.map(period => ( <button key={period} className={`period-button ${selectedPeriod === period ? 'active' : ''}`} onClick={() => setSelectedPeriod(period)}> {period} </button> ))} </div> </div> <div className="panel-actions"> <button className="reset-button" onClick={handlePeriodAmountReset}><FaSyncAlt /> 초기화</button> <button className="apply-button" onClick={handlePeriodAmountApply}>적용</button> </div> </div> )}
            </div>
            
            <div className="filter-item-container" ref={productTypeButtonRef}>
              <button className={`filter-button ${isProductTypeFilterOpen ? 'active' : ''}`} onClick={() => setIsProductTypeFilterOpen(!isProductTypeFilterOpen)}> 상품유형 {isProductTypeFilterOpen ? <FaMinus /> : <FaPlus />} </button>
              {isProductTypeFilterOpen && (
                <div className="filter-panel large" ref={productTypeFilterRef}>
                  <div className="panel-section">
                    <h4>상품 분류</h4>
                    <div className="product-category-button-group">
                      <button className={`period-button ${selectedCategories.includes('예금') ? 'active' : ''}`} onClick={() => handleCategoryChange('예금')}> 예금 </button>
                      <button className={`period-button ${selectedCategories.includes('적금') ? 'active' : ''}`} onClick={() => handleCategoryChange('적금')}> 적금 </button>
                    </div>
                  </div>
                  <div className="panel-section">
                    <h4>금융기관</h4>
                    <div className="product-bank-type-button-group">
                        <button 
                          className={`period-button ${selectedBankCategory === 1 ? 'active' : ''}`} 
                          onClick={() => handleOpenBankModal(1)}
                        >
                          은행
                        </button>
                        <button 
                          className={`period-button ${selectedBankCategory === 2 ? 'active' : ''}`} 
                          onClick={() => handleOpenBankModal(2)}
                        >
                          저축은행
                        </button>
                        <button 
                          className={`period-button ${selectedBankCategory === 0 ? 'active' : ''}`} 
                          onClick={() => { handleBankCategoryChange(0); setSelectedBanks([]); }}
                        >
                          전체
                        </button>
                    </div>
                  </div>
                  <div className="panel-section">
                    <h4>상세 유형</h4>
                    <div className="product-type-button-group">
                      {productTypeOptions.map(type => ( <button key={type} className={`period-button ${selectedProductTypes.includes(type) ? 'active' : ''}`} onClick={() => handleProductTypeChange(type)}> {type} </button>))}
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
              <button className={`filter-button ${isBenefitFilterOpen ? 'active' : ''}`} onClick={() => setIsBenefitFilterOpen(!isBenefitFilterOpen)}> 우대조건 {isBenefitFilterOpen ? <FaMinus /> : <FaPlus />} </button>
              {isBenefitFilterOpen && ( <div className="filter-panel large" ref={benefitFilterRef}> <div className="panel-section"> <h4>우대조건</h4> <div className="benefit-button-group"> {benefitOptions.map(benefit => ( <button key={benefit.id} className={`period-button ${selectedBenefits.includes(benefit.db_row_name) ? 'active' : ''}`} onClick={() => handleBenefitChange(benefit.db_row_name)}> {benefit.name} </button> ))} </div> </div> <small className="panel-disclaimer">*신협 상품에는 적용되지 않습니다.</small> <div className="panel-actions"> <button className="reset-button" onClick={handleBenefitReset}><FaSyncAlt /> 초기화</button> <button className="apply-button" onClick={handleBenefitApply}>적용</button> </div> </div> )}
            </div>
          </div>

          <div className="list-info-bar">
            <span className="total-count"> 총 <strong>{totalCount}</strong>건의 {categoryTitle} 정보가 있습니다. </span>
            <div className="sort-dropdown-container" ref={sortDropdownRef}>
              <button className="sort-dropdown-button" onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}> {sortOrder} <FaChevronDown size="0.8em" /> </button>
              {isSortDropdownOpen && ( <ul className="sort-dropdown-menu"> <li onClick={() => { setSortOrder('최고금리순'); setIsSortDropdownOpen(false); }}>최고금리순</li> <li onClick={() => { setSortOrder('기본금리순'); setIsSortDropdownOpen(false); }}>기본금리순</li> </ul> )}
            </div>
          </div>

          <div className="savings-list-container">
            {savingsData.map((item) => (
              <Link to={`/savings/${item.finproduct_id}`} key={item.finproduct_id} className="savings-item-link">
                  <div className="savings-item">
                      <div className="item-left">
                          <div className="bank-logo">
                            <img src={item.image_url} alt={item.bank_name} style={{ width: '100%', height: '100%', borderRadius: '50%' }}/>
                          </div>
                          <div className="product-info">
                              <span className="product-name">{item.product_name}</span>
                              <span className="bank-name">{item.bank_name}</span>
                              <div className="tags">
                                  {item.product_type_chip.map((tag, i) => ( <span key={i} className={`tag ${tag === '특판' ? 'highlight' : ''}`}>{tag}</span> ))}
                              </div>
                          </div>
                      </div>
                      <div className="item-right">
                          <div className="rate-info">
                              <span className="rate-max">최고 {item.max_interest_rate}%</span>
                              <span className="rate-base">기본 {item.min_interest_rate}%</span>
                          </div>
                      </div>
                  </div>
              </Link>
            ))}
          </div>
          
          {renderPagination()}

        </div>
      </main>

      {isBankModalOpen && (
        <Modal isOpen={isBankModalOpen} onClose={handleCloseBankModal} title="은행 선택">
          <div className="bank-modal-body">
            <div className="bank-modal-tabs">
              <button 
                className={`bank-modal-tab ${modalBankType === 1 ? 'active' : ''}`}
                onClick={() => setModalBankType(1)}
              >
                은행
              </button>
              <button 
                className={`bank-modal-tab ${modalBankType === 2 ? 'active' : ''}`}
                onClick={() => setModalBankType(2)}
              >
                저축은행
              </button>
            </div>
            <div className="bank-modal-header">
              <label>
                <input 
                    type="checkbox" 
                    onChange={handleSelectAllBanks}
                    checked={bankOptions.length > 0 && tempSelectedBanks.length === bankOptions.length}
                /> 
                모든 은행 선택
              </label>
            </div>
            <div className="bank-grid">
              {bankOptions.map(bank => (
                <div 
                  key={bank.id} 
                  className={`bank-item ${tempSelectedBanks.includes(bank.nickname) ? 'active' : ''}`}
                  onClick={() => handleTempBankSelect(bank.nickname)}
                >
                  <div className="bank-item-logo">
                    <img src={bank.image_url} alt={bank.kor_co_nm} />
                  </div>
                  <span className="bank-item-name">{bank.nickname}</span>
                  <div className="bank-item-plus">+</div>
                </div>
              ))}
            </div>
            <div className="bank-modal-footer">
              <button className="confirm-button" onClick={handleApplyBankSelection}>확인</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SavingsPage;