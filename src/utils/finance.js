// src/utils/finance.js
export const percentStringToDecimal = (s) => {
  if (typeof s === 'number') return s;
  if (typeof s === 'string') {
    const n = parseFloat(s.replace('%', '').trim());
    return isNaN(n) ? 0 : n / 100;
  }
  return 0;
};

export const toCurrency = (n) =>
  Number.isFinite(n) ? Math.floor(n).toLocaleString() : '0';

function inferMonths(byPeriod) {
  for (const p of byPeriod || []) {
    const m = /\d+/.exec(p.period || '');
    if (m) return parseInt(m[0], 10);
  }
  return 12;
}
function inferPeriodLabel(byPeriod) {
  return (byPeriod && byPeriod[0] && byPeriod[0].period) || '12개월';
}

export function normalizeDetail(resp) {
  console.log('[normalize] input keys', resp && Object.keys(resp));

  const top = (resp && resp.topinfo) || {};
  const ratesRoot = (resp && resp.interest_rates) || [];
  const ratesBottom = (resp && resp.bottom2 && resp.bottom2.interest_rates) || [];
  const rawRates = ratesRoot.length ? ratesRoot : ratesBottom;

  const byPeriod = (rawRates || []).map((r) => ({
    period: (r && (r.period || r.save_trm)) || '',
    rate:
      typeof (r && r.rate) === 'number'
        ? r.rate
        : percentStringToDecimal(r && (r.rate || r.intr_rate)),
  }));

  const nums = byPeriod.map((r) => r.rate).filter((x) => Number.isFinite(x));
  const max = nums.length ? Math.max(...nums) : 0;
  const base = nums.length ? nums[0] : 0;

  const out = {
    id: top && top.finproduct_id,
    bank: top && top.bank_name,
    product: top && top.product_name,
    rates: { max, base },         // 소수 (0.028)
    termMonths: inferMonths(byPeriod),
    details: {
      periodLabel: inferPeriodLabel(byPeriod),
      amountRange: top && top.product_guideline,
      method: top && top.join_way,
      target: (top && (top.target || top.join_member)) || '',
      benefitCondition: top && top.spcl_cnd,
      interestPayment: '만기일시지급',
      notice: undefined,
      protection: undefined,
    },
    rateInfo: {
      byPeriod,
      byCondition: [],
    },
  };

  console.log('[normalize] output sample', out);
  return out;
}