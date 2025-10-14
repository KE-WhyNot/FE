import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SavingsDetailPage.css';
import Header from '../common/Header';
import { FaLandmark, FaArrowLeft } from 'react-icons/fa';
import policyAxiosInstance from '../../api/policyAxiosInstance';
import { normalizeDetail, toCurrency, percentStringToDecimal } from '../../utils/finance.js';

const SavingsDetailPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading ] = useState(true);
    const [error, setError ] = useState(null);
    const [product, setProduct] = useState(null);

    const [activeTab, setActiveTab] = useState('info');
    const [depositAmount, setDepositAmount] = useState(10000000);
    const [selectedRateType, setSelectedRateType] = useState('max');
    const [calculated, setCalculated] = useState({ principal: 0, preTaxInterest: 0, tax: 0, postTaxAmount: 0 });

    // ✅ 여기서 axiosInstance로 직접 API 요청
    useEffect(() => {
        let on = true;
        setLoading(true);
        setError(null);

        const fetchDetail = async () => {
            try {
                const url = `https://policy.youth-fi.com/api/finproduct/${encodeURIComponent(productId)}`;
                const res = await policyAxiosInstance.get(url);
                if (on) setProduct(normalizeDetail(res.data));
            } catch (e) {
                if (on) setError(e.message || String(e));
            } finally {
                if (on) setLoading(false);
            }
        };

        fetchDetail();
        return () => { on = false; };
    }, [productId]);

    useEffect(() => {
        if (product) {
            const principal = depositAmount || 0;
            const rate = selectedRateType === 'max' ? product.rates.max : product.rates.base;
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
    }, [depositAmount, product, selectedRateType]);

    if (loading) return <div>불러오는 중...</div>;
    if (error) return <div>오류: {error}</div>;
    if (!product) return <div>상품 정보를 찾을 수 없습니다.</div>;

    const ratesToDisplay = [
      { label: '최고', value: product.rates.max },
      { label: '기본', value: product.rates.base, term: product.termMonths },
    ];

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
                        {ratesToDisplay.map(rateInfo => (
                            <div className="rate-item" key={rateInfo.label}>
                                <span>{rateInfo.label}</span>
                                <strong>연 {(rateInfo.value * 100).toFixed(2)}%</strong>
                                {rateInfo.term && <small>({rateInfo.term}개월, 세전)</small>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="tab-navigation">
                    <button className={activeTab === 'info' ? 'active' : ''} onClick={() => setActiveTab('info')}>상품 안내</button>
                    <button className={activeTab === 'rate' ? 'active' : ''} onClick={() => setActiveTab('rate')}>금리 안내</button>
                </div>

                {activeTab === 'info' && (
                    <div className="tab-content">
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
                                <thead><tr><th>기간</th><th>기본 금리</th><th>최고 금리</th></tr></thead>
                                <tbody>
                                    {product.rateInfo.byPeriod.map((item, i) => (
                                        <tr key={i}>
                                            <td>{item.period}</td>
                                            <td>{parseFloat(item.base_rate).toFixed(2)}%</td>
                                            <td>{parseFloat(item.max_rate).toFixed(2)}%</td>
                                        </tr>
                                    ))}
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