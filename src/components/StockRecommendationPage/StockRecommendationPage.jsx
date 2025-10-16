import React from 'react';
import './StockRecommendationPage.css';
import Header from '../common/Header';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';

// 스크린샷 기반의 예시 데이터 (불필요한 항목 제거)
const stockData = [
    { rank: 1, name: '삼성전자', sector: '기술', price: '79,400', change: -1.8 },
    { rank: 2, name: 'SK하이닉스', sector: '기술', price: '348,000', change: 5.1 },
    { rank: 3, name: 'LG에너지솔루션', sector: '기술', price: '349,500', change: -1.7 },
    { rank: 4, name: '삼성바이오로직스', sector: '헬스케어', price: '1,036,000', change: -0.4 },
    { rank: 5, name: '한화에어로스페이스', sector: '산업', price: '1,041,000', change: 5.6 },
    { rank: 6, name: '현대차', sector: '소비순환재', price: '215,000', change: 0 },
    { rank: 7, name: 'HD현대중공업', sector: '산업', price: '503,000', change: 0.9 },
    { rank: 8, name: 'KB금융', sector: '금융', price: '117,800', change: -1.5 },
    { rank: 9, name: '기아', sector: '소비순환재', price: '101,400', change: -0.3 },
    { rank: 10, name: '두산에너빌리티', sector: '산업', price: '63,300', change: 7.6 },
    { rank: 11, name: '셀트리온', sector: '헬스케어', price: '168,700', change: -0.8 },
    { rank: 12, name: 'NAVER', sector: '기술', price: '25,000', change: 0.4 },
    { rank: 13, name: '한화오션', sector: '금융', price: '70,800', change: 1.4 },
    { rank: 14, name: '한화솔루션', sector: '산업', price: '110,800', change: 1.2 },
    { rank: 15, name: '삼성물산', sector: '산업', price: '155,800', change: 0 },
    { rank: 16, name: 'HD한국조선해양', sector: '산업', price: '416,000', change: 1.1 },
    { rank: 17, name: '삼성생명', sector: '금융', price: '100,100', change: -1.7 },
    { rank: 18, name: '카카오', sector: '기술', price: '62,900', change: -0.3 },
    { rank: 19, name: '현대모비스', sector: '소비순환재', price: '305,000', change: -0.2 },
    { rank: 20, name: 'SK스퀘어', sector: '기술', price: '205,000', change: 2.7 },
    { rank: 21, name: '알테오젠', sector: '헬스케어', price: '493,000', change: 0.3 },
    { rank: 22, name: '하나금융지주', sector: '금융', price: '90,800', change: -0.1 },
    { rank: 23, name: 'HMM', sector: '산업', price: '25,700', change: 1.1 },
    { rank: 24, name: '한국전력', sector: '유틸리티', price: '35,800', change: 0 },
    { rank: 25, name: '현대글로비스', sector: '산업', price: '223,000', change: 3.7 },
    { rank: 26, name: '메리츠금융지주', sector: '금융', price: '123,600', change: -2.1 },
    { rank: 27, name: 'LG화학', sector: '소재', price: '288,000', change: -1.9 },
    { rank: 28, name: 'POSCO홀딩스', sector: '소재', price: '282,000', change: -1 },
    { rank: 29, name: 'HD현대일렉트릭', sector: '산업', price: '594,000', change: -1.2 },
    { rank: 30, name: '삼성화재', sector: '금융', price: '464,500', change: 0 },
];


const StockRecommendationPage = () => {
    // 숫자의 부호에 따라 클래스를 반환하는 함수
    const getChangeColorClass = (change) => {
        if (change > 0) return 'text-blue';
        if (change < 0) return 'text-red';
        return 'text-grey';
    };

    return (
        <div className="stock-recommendation-layout">
            <Header />
            <main className="stock-recommendation-content">
                <h1>
                    <span className="title-prefix">포트폴리오 - </span>주식 추천
                </h1>
                <div className="stock-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>종목 명</th>
                                <th>분야 <FaCaretDown /></th>
                                <th className="text-right">현재가격</th>
                                <th className="text-right">일일 변동률(%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockData.map((stock) => (
                                <tr key={stock.rank}>
                                    <td className="text-center">{stock.rank}</td>
                                    <td>{stock.name}</td>
                                    <td>{stock.sector}</td>
                                    <td className="text-right">{`₩${stock.price}`}</td>
                                    <td className={`text-right ${getChangeColorClass(stock.change)}`}>
                                        {stock.change > 0 && <FaCaretUp />}
                                        {stock.change < 0 && <FaCaretDown />}
                                        {stock.change}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default StockRecommendationPage;