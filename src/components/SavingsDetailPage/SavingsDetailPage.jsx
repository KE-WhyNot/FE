import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SavingsDetailPage.css';
import Header from '../common/Header';
import { FaLandmark, FaShareAlt, FaArrowLeft } from 'react-icons/fa';

// SavingsPage에 있던 예시 데이터를 여기로 가져와 상세 페이지에서 사용합니다.
const savingsData = [
    { id: 'ad8c6895fdfa41f3b7a384f9abc78ab8', bank: 'SH수협은행', product: 'Sh첫만남우대예금', tags: ['방문없이 가입', '누구나가입'], maxRate: '2.90%', baseRate: '1.85%', period: 12, benefits: ['첫거래', '비대면가입'] },
    { id: 'e-greencsaveyegum', bank: 'SC제일은행', product: 'e-그린세이브예금', tags: ['방문없이 가입', '누구나가입'], maxRate: '2.85%', baseRate: '2.55%', period: 6, benefits: ['비대면가입'] },
    { id: 'woori-first-deal', bank: '우리은행', product: '우리 첫거래 우대 정기예금', tags: ['특판', '방문없이 가입', '누구나가입'], maxRate: '2.80%', baseRate: '1.80%', period: 12, benefits: ['첫거래', '은행앱사용'] },
    // ... 나머지 데이터
];


const SavingsDetailPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const product = savingsData.find(item => item.id === productId);

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
                
                <div className="product-summary-card">
                    <div className="summary-header">
                        <div className="bank-logo"><FaLandmark /></div>
                        <div>
                            <span className="bank-name">{product.bank}</span>
                            <h1 className="product-name">{product.product}</h1>
                        </div>
                    </div>
                    <div className="summary-body">
                        <div className="rate-info-main">
                            <span className="rate-label">최고금리 (세전)</span>
                            <span className="rate-value">{product.maxRate}</span>
                        </div>
                        <div className="tags">
                            {product.tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
                        </div>
                    </div>
                </div>

                <div className="product-details-grid">
                    <div className="detail-item">
                        <span className="detail-label">기본금리</span>
                        <span className="detail-value">{product.baseRate}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">최대 기간</span>
                        <span className="detail-value">{product.period}개월</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">가입 대상</span>
                        <span className="detail-value">누구나</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">가입 방법</span>
                        <span className="detail-value">비대면</span>
                    </div>
                </div>

                <div className="product-description-card">
                    <h2>상품 특징</h2>
                    <p>이 상품은 첫 거래 고객을 위한 우대 금리를 제공하는 정기예금입니다. 비대면으로 간편하게 가입할 수 있으며, 특정 조건을 만족할 경우 추가 금리 혜택을 받을 수 있습니다.</p>
                    <ul>
                        <li>판매기간: 2025-01-01 ~ 2025-12-31</li>
                        <li>가입한도: 100만원 이상 5,000만원 이하</li>
                    </ul>
                </div>

                <div className="action-buttons">
                    <button className="share-button"><FaShareAlt /> 공유하기</button>
                    <button className="signup-button">가입하기</button>
                </div>
            </main>
        </div>
    );
};

export default SavingsDetailPage;