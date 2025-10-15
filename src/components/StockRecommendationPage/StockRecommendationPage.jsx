import React from 'react';
import './StockRecommendationPage.css';
import Header from '../common/Header';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';

// 스크린샷 기반의 예시 데이터
const stockData = [
    { rank: 1, name: '삼성전자', exchange: '서울', sector: '기술', industry: '컴퓨터, 주변기기 및 가전제품', marketCap: '496.87조', per: 18.6, peg: 1.6, price: '79,400', change: -1.8 },
    { rank: 2, name: 'SK하이닉스', exchange: '서울', sector: '기술', industry: '반도체 및 반도체 장비', marketCap: '228.53조', per: 8.1, peg: 0.01, price: '348,000', change: 5.1 },
    { rank: 3, name: 'LG에너지솔루션', exchange: '서울', sector: '기술', industry: '반도체 및 반도체 장비', marketCap: '83.10조', per: -84.1, peg: 0.17, price: '349,500', change: -1.7 },
    { rank: 4, name: '삼성바이오로직스', exchange: '서울', sector: '헬스케어', industry: '제약', marketCap: '74.02조', per: 57.5, peg: 2.29, price: '1,036,000', change: -0.4 },
    { rank: 5, name: '한화에어로스페이스', exchange: '서울', sector: '산업', industry: '항공우주 및 방위', marketCap: '50.73조', per: 20.3, peg: 0.03, price: '1,041,000', change: 5.6 },
    { rank: 6, name: '현대차', exchange: '서울', sector: '소비순환재', industry: '자동차 및 자동차 부품', marketCap: '47.01조', per: 4.9, peg: -0.85, price: '215,000', change: 0 },
    { rank: 7, name: 'HD현대중공업', exchange: '서울', sector: '산업', industry: '기계, 공구, 중장비, 선박', marketCap: '44.25조', per: 48.5, peg: 0.14, price: '503,000', change: 0.9 },
    { rank: 8, name: 'KB금융', exchange: '서울', sector: '금융', industry: '은행 서비스', marketCap: '43.55조', per: 8.1, peg: 0.21, price: '117,800', change: -1.5 },
    { rank: 9, name: '기아', exchange: '서울', sector: '소비순환재', industry: '자동차 및 자동차 부품', marketCap: '39.25조', per: 4.8, peg: -0.51, price: '101,400', change: -0.3 },
    { rank: 10, name: '두산에너빌리티', exchange: '서울', sector: '산업', industry: '기계, 공구, 중장비, 선박', marketCap: '37.66조', per: -365.3, peg: 2.18, price: '63,300', change: 7.6 },
    { rank: 11, name: '셀트리온', exchange: '서울', sector: '헬스케어', industry: '생명과학 및 의학 연구', marketCap: '37.45조', per: 78.1, peg: 2.58, price: '168,700', change: -0.8 },
    { rank: 12, name: 'NAVER', exchange: '서울', sector: '기술', industry: '소프트웨어 및 IT 서비스', marketCap: '34.94조', per: 18, peg: 0.61, price: '25,000', change: 0.4 },
    { rank: 13, name: '한화오션', exchange: '서울', sector: '금융', industry: '은행 서비스', marketCap: '33.94조', per: 7.8, peg: 0.82, price: '70,800', change: 1.4 },
    { rank: 14, name: '한화솔루션', exchange: '서울', sector: '산업', industry: '기계, 공구, 중장비, 선박', marketCap: '33.55조', per: 50.7, peg: 1.17, price: '110,800', change: 1.2 },
    { rank: 15, name: '삼성물산', exchange: '서울', sector: '산업', industry: '상업 서비스 및 공급', marketCap: '31.96조', per: 15.1, peg: -1.21, price: '155,800', change: 0 },
    { rank: 16, name: 'HD한국조선해양', exchange: '서울', sector: '산업', industry: '기계, 공구, 중장비, 선박', marketCap: '29.11조', per: 19.1, peg: 0.2, price: '416,000', change: 1.1 },
    { rank: 17, name: '삼성생명', exchange: '서울', sector: '금융', industry: '보험', marketCap: '28.54조', per: 13.5, peg: -1.96, price: '100,100', change: -1.7 },
    { rank: 18, name: '카카오', exchange: '서울', sector: '기술', industry: '소프트웨어 및 IT 서비스', marketCap: '28.15조', per: 145.7, peg: 1.11, price: '62,900', change: -0.3 },
    { rank: 19, name: '현대모비스', exchange: '서울', sector: '소비순환재', industry: '자동차 및 자동차 부품', marketCap: '27.54조', per: 8.8, peg: 0.35, price: '305,000', change: -0.2 },
    { rank: 20, name: 'SK스퀘어', exchange: '서울', sector: '기술', industry: '소프트웨어 및 IT 서비스', marketCap: '26.54조', per: 4.6, peg: 0.01, price: '205,000', change: 2.7 },
    { rank: 21, name: '알테오젠', exchange: '코스닥', sector: '헬스케어', industry: '제약', marketCap: '26.27조', per: 303.9, peg: 0.05, price: '493,000', change: 0.3 },
    { rank: 22, name: '하나금융지주', exchange: '서울', sector: '금융', industry: '은행 서비스', marketCap: '24.81조', per: 8.7, peg: 0.37, price: '90,800', change: -0.1 },
    { rank: 23, name: 'HMM', exchange: '서울', sector: '산업', industry: '화물 운송 및 물류 서비스', marketCap: '24.04조', per: 8.5, peg: 0.04, price: '25,700', change: 1.1 },
    { rank: 24, name: '한국전력', exchange: '서울', sector: '유틸리티', industry: '전기 유틸리티 및 IPP', marketCap: '23.62조', per: 3.7, peg: 0.03, price: '35,800', change: 0 },
    { rank: 25, name: '현대글로비스', exchange: '서울', sector: '산업', industry: '기계, 공구, 중장비, 선박', marketCap: '23.47조', per: 39.2, peg: 0.27, price: '223,000', change: 3.7 },
    { rank: 26, name: '메리츠금융지주', exchange: '서울', sector: '금융', industry: '투자지주회사', marketCap: '22.11조', per: 10, peg: -2.29, price: '123,600', change: -2.1 },
    { rank: 27, name: 'LG화학', exchange: '서울', sector: '소재', industry: '화학', marketCap: '21.81조', per: -12.9, peg: 0.02, price: '288,000', change: -1.9 },
    { rank: 28, name: 'POSCO홀딩스', exchange: '서울', sector: '소재', industry: '금속 및 채광', marketCap: '21.55조', per: 44.4, peg: -0.62, price: '282,000', change: -1 },
    { rank: 29, name: 'HD현대일렉트릭', exchange: '서울', sector: '산업', industry: '기계, 공구, 중장비, 선박', marketCap: '21.38조', per: 39.5, peg: 1.86, price: '594,000', change: -1.2 },
    { rank: 30, name: '삼성화재', exchange: '서울', sector: '금융', industry: '보험', marketCap: '19.67조', per: 11.1, peg: -1.74, price: '464,500', change: 0 },
];


const StockRecommendationPage = () => {
    // 숫자의 부호에 따라 클래스를 반환하는 함수
    const getChangeColorClass = (change) => {
        if (change > 0) return 'text-blue';
        if (change < 0) return 'text-red';
        return 'text-grey';
    };

    // 특정 PEG 비율에 하이라이트를 주기 위한 함수
    const getPegHighlightClass = (peg) => {
        if (peg < 0.5) return 'highlight-red';
        if (peg >= 0.5 && peg < 1.0) return 'highlight-orange';
        return '';
    };

    return (
        <div className="stock-recommendation-layout">
            <Header />
            <main className="stock-recommendation-content">
                {/* ✨ h1 태그 수정 */}
                <h1>
                    <span className="title-prefix">포트폴리오 - </span>주식 추천
                </h1>
                <div className="stock-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>기본</th>
                                <th>종목 명</th>
                                <th>거래소 <FaCaretDown /></th>
                                <th>분야 <FaCaretDown /></th>
                                <th>업종 <FaCaretDown /></th>
                                <th>시가총액 <FaCaretDown /></th>
                                <th>주가수익비율 <FaCaretDown /></th>
                                <th>PEG 비율 <FaCaretDown /></th>
                                <th>현재가격 <FaCaretDown /></th>
                                <th>일일 변동률(%) <FaCaretDown /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockData.map((stock) => (
                                <tr key={stock.rank}>
                                    <td className="text-center">{stock.rank}</td>
                                    <td>{stock.name}</td>
                                    <td>{stock.exchange}</td>
                                    <td>{stock.sector}</td>
                                    <td>{stock.industry}</td>
                                    <td className="text-right">{stock.marketCap}</td>
                                    <td className={`text-right ${getPegHighlightClass(stock.per)}`}>{stock.per}x</td>
                                    <td className={`text-right ${getPegHighlightClass(stock.peg)}`}>{stock.peg}</td>
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