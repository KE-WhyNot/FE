import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SavingsDetailPage.css';
import Header from '../common/Header';
import { FaLandmark, FaArrowLeft } from 'react-icons/fa';
import { fetchFinanceProductDetail } from '../../api/client.js';
import { normalizeDetail, toCurrency, percentStringToDecimal } from '../../utils/finance.js';

// 상세 페이지에 필요한 정보를 포함하도록 예시 데이터 확장
const savingsData = [
    { 
        id: 'ad8c6895fdfa41f3b7a384f9abc78ab8', 
        bank: 'SH수협은행', 
        product: 'Sh첫만남우대예금', 
        tags: ['방문없이 가입', '누구나가입'], 
        maxRate: '2.80%', 
        baseRate: '1.75%', 
        period: 12, 
        details: {
            period: '1년',
            amount: '100만원 이상 3,000만원 이하',
            method: '비대면(인터넷뱅킹, 스마트폰뱅킹)',
            target: '실명의 개인(1인 1계좌)',
            benefitCondition: '첫거래',
            interestPayment: '만기일시지급: 해지 요청 시 이자를 지급',
            notice: '만기 전 해지할 경우 약정 금리보다 낮은 중도해지금리가 적용됩니다.',
            protection: '이 예금은 예금자보호법에 따라 원금과 소정의 이자를 합하여 1인당 "5천만원까지"(SH수협은행의 여타 보호 상품과 합산) 보호됩니다.',
        },
        rateInfo: {
            byPeriod: [{ period: '12개월', rate: '1.750%' }],
            byCondition: [
                { condition: '수협은행 예·적금(입출금이 자유로운 예금 제외) 첫거래 고객(신규 시점)', benefit: '최대 연 1.05%p의 우대금리를 만기해지 시 제공' },
                { condition: '개인(신용)정보 수집·이용 동의서(상품서비스 안내 등)에 상품서비스 안내수단 전체 동의한 경우(신규 시 확정)', benefit: '0.05%' },
                { condition: '이 예금 신규일부터 만기 전일까지 당행 ‘스마트폰뱅킹의 상품 알리기’를 통해 이 상품 추천 시(만기해지 시 확정)', benefit: '0.8%' },
            ],
        }
    },
    // ... (다른 상품 데이터도 이와 유사한 구조로 추가 가능)
];


const SavingsDetailPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading ] = useState(true);
    const [error, setError ] = useState(null);
    const [product, setProduct] = useState(null);

    const [activeTab, setActiveTab] = useState('info');
    const [depositAmount, setDepositAmount] = useState(10000000);
    // ✨ 1. 선택된 금리 타입을 관리하는 state 추가 ('max' 또는 'base')
    const [selectedRateType, setSelectedRateType] = useState('max'); 
    const [calculated, setCalculated] = useState({ principal: 0, preTaxInterest: 0, tax: 0, postTaxAmount: 0 });


    useEffect(() => {
        let on = true;
        setLoading(true); setError(null);
        fetchFinanceProductDetail(productId)
            .then(raw => on && setProduct(normalizeDetail(raw)))
            .catch(e => on && setError(e.message || String(e)))
            .finally(() => on && setLoading(false));
        return () => { on = false; };
        }, [productId]);

    useEffect(() => {
        if (product) {
            const principal = depositAmount || 0;
            // ✨ 2. 선택된 금리 타입에 따라 다른 이율을 적용
            const rate = selectedRateType === 'max' ? product.rates.max : product.rates.base
            
            const months = product.termMonths ?? 12;
            const preTaxInterest = principal * rate * (months / 12);
            const tax = preTaxInterest * 0.154;
            const postTaxAmount = principal + preTaxInterest - tax;

            setCalculated({
                principal: principal,
                preTaxInterest: preTaxInterest,
                tax: tax,
                postTaxAmount: postTaxAmount,
            });
        }
    }, [depositAmount, product, selectedRateType]); // ✨ selectedRateType을 종속성 배열에 추가

        if (loading) return <div>불러오는 중...</div>;
        if (error) return <div>오류: {error}</div>;
        if (!product) {
        return <div>상품 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="savings-detail-layout">
            <Header />
            <main className="savings-detail-content">
                <button onClick={() => navigate(-1)} className="back-button">
                    <FaArrowLeft /> 목록으로
                </button>
                
                <div className="product-summary-card-new">
                    <div className="summary-header-new">
                        <div>
                            <h1 className="product-name-new">{product.product}</h1>
                            <span className="bank-name-new">{product.bank}</span>
                        </div>
                        <div className="bank-logo-new">
                        {/* product.imageUrl이 있을 경우에만 이미지를 보여줍니다. */}
                        {product.imageUrl ? (
                            <img src={product.imageUrl} alt={`${product.bank} 로고`} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                        ) : (
                            <FaLandmark />
                        )}
                        </div>
                    </div>
                    <div className="tags-new">
                        {product.tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
                    </div>
                    <div className="rates-new">
                        <div className="rate-item">
                            <span>최고</span>
                            <strong>연 {(product.rates.max * 100).toFixed(2)}%</strong>
                        </div>
                        <div className="rate-item">
                            <span>기본</span>
                            <strong>연 {(product.rates.base * 100).toFixed(2)}%</strong>
                            <small>({product.termMonths}개월, 세전)</small>                        </div>
                    </div>
                    {/* ✨ 3. 버튼 영역 삭제 */}
                </div>

                <div className="tab-navigation">
                    <button className={activeTab === 'info' ? 'active' : ''} onClick={() => setActiveTab('info')}>상품 안내</button>
                    <button className={activeTab === 'rate' ? 'active' : ''} onClick={() => setActiveTab('rate')}>금리 안내</button>
                </div>

                {activeTab === 'info' && (
                    <div className="tab-content">
                        {/* ... (상품 안내 탭 내용은 동일) ... */}
                        <div className="product-info-grid">
                            <div className="info-row"><div className="info-label">기간</div><div className="info-value">{product.details.period}</div></div>
                            <div className="info-row"><div className="info-label">상품 가이드</div><div className="info-value" dangerouslySetInnerHTML={{ __html: product.details.amount }} /></div>
                            <div className="info-row"><div className="info-label">가입방법</div><div className="info-value">{product.details.method}</div></div>
                            <div className="info-row"><div className="info-label">대상</div><div className="info-value">{product.details.target}</div></div>
                            <div className="info-row"><div className="info-label">우대조건</div><div className="info-value" dangerouslySetInnerHTML={{ __html: product.details.benefitCondition }} /></div>
                            <div className="info-row"><div className="info-label">이자지급</div><div className="info-value">{product.details.interestPayment}</div></div>
                            <div className="info-row notice"><div className="info-label">유의사항</div><div className="info-value">{product.details.notice}</div></div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'rate' && (
                    <div className="tab-content">
                        <div className="rate-calculator">
                            <h4>12개월 만기시 세후수령액 (단리)</h4>
                            <div className="amount-input-wrapper">
                                <input 
                                    type="text" 
                                    value={toCurrency(depositAmount)}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/,/g, '');
                                        if (!isNaN(value)) {
                                            setDepositAmount(Number(value));
                                        }
                                    }}
                                />
                                <span>원</span>
                            </div>

                            {/* ✨ 4. 금리 버튼에 onClick 핸들러와 active 클래스 조건 추가 */}
                            <div className="rate-options">
                                <div 
                                    className={`rate-option ${selectedRateType === 'max' ? 'active' : ''}`}
                                    onClick={() => setSelectedRateType('max')}
                                >
                                    <span>최고금리</span><strong>{(product.rates.max * 100).toFixed(2)}%</strong>
                                </div>
                                <div 
                                    className={`rate-option ${selectedRateType === 'base' ? 'active' : ''}`}
                                    onClick={() => setSelectedRateType('base')}
                                >
                                    <span>기본금리</span><strong>{(product.rates.base * 100).toFixed(2)}%</strong>
                                </div>
                            </div>
                            
                            <div className="calculation-result">
                                <div className="result-row"><span>원금합계</span><span className="interest">+ {toCurrency(calculated.preTaxInterest)}원</span></div>
                                <div className="result-row"><span>세전이자</span><span className="interest">+ {toCurrency(calculated.preTaxInterest)}원</span></div>
                                <div className="result-row"><span>이자과세(15.4%)</span><span className="tax">- {toCurrency(calculated.tax)}원</span></div>
                            </div>
                            <div className="final-amount">
                                <span>세후수령액</span>
                                <strong>{toCurrency(calculated.postTaxAmount)}원</strong>
                            </div>
                        </div>

                        <div className="rate-details">
                            <h4>기간별 금리</h4>
                            <table className="rate-table">
                                <thead><tr><th>기간</th><th>금리</th></tr></thead>
                                <tbody>
                                    {product.rateInfo.byPeriod.map((item, i) => {
                                        // 기간별 금리 정보가 하나뿐일 때, 선택된 금리(최고/기본)를 동적으로 보여줍니다.
                                        if (product.rateInfo.byPeriod.length === 1) {
                                            const displayRate = selectedRateType === 'max'
                                                ? (product.rates.max * 100).toFixed(2)
                                                : (product.rates.base * 100).toFixed(2);
                                            return (
                                                <tr key={i}>
                                                    <td>{item.period}</td>
                                                    <td>{displayRate}%</td>
                                                </tr>
                                            );
                                        }
                                        // 여러 기간 정보가 있을 때는 기존 방식대로 보여줍니다.
                                        return (
                                            <tr key={i}>
                                                <td>{item.period}</td>
                                                <td>{parseFloat(item.rate).toFixed(2)}%</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <h4>조건별</h4>
                             <ul className="condition-list">
                                {product.rateInfo.byCondition.map((item, i) => (
                                    <li key={i}><strong>{i+1}</strong> <div><span>{item.condition}</span><small>{item.benefit}</small></div></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SavingsDetailPage;