// src/utils/finance.js
export const percentStringToDecimal = (s) => {
  if (typeof s === "number") return s / 100;
  if (typeof s === "string") {
    const n = parseFloat(s.replace("%", "").trim());
    return isNaN(n) ? 0 : n / 100;
  }
  return 0;
};

export const toCurrency = (n) =>
  Number.isFinite(n) ? Math.floor(n).toLocaleString() : "0";

function inferMonths(byPeriod) {
  for (const p of byPeriod || []) {
    const m = /\d+/.exec(p.period || "");
    if (m) return parseInt(m[0], 10);
  }
  return 12;
}
function inferPeriodLabel(byPeriod) {
  return (byPeriod && byPeriod[0] && byPeriod[0].period) || "12개월";
}

export function normalizeDetail(resp) {
  console.log("[normalize] input keys", resp && Object.keys(resp));

  const top = resp?.top || {};
  const bottom1 = resp?.bottom1 || {};
  const bottom2 = resp?.bottom2 || {};

  const rawRates = (bottom2 && bottom2.interest_rates) || [];

  // ✨ 수정된 중복 제거 로직: 객체 전체를 기반으로 고유한 항목만 필터링
  const uniqueRates = Array.from(
    new Map(rawRates.map((item) => [JSON.stringify(item), item])).values()
  );

  let byPeriod = uniqueRates.map((r) => ({
    period: r.period || r.save_trm || "",
    // ✨ bottom2.interest_rates에 base_rate가 있으므로 그것을 우선 사용
    base_rate: String(r.base_rate || r.intr_rate || 0),
    // ✨ bottom2.interest_rates에 bonus_rate가 있으므로 그것을 우선 사용
    max_rate: String(r.bonus_rate || r.rate || r.intr_rate || 0),
  }));

  // 기간별 금리 정보가 없을 경우, 기본 정보를 바탕으로 한 줄을 생성합니다.
  if (byPeriod.length === 0 && bottom1.period) {
    byPeriod.push({
      period: bottom1.period,
      base_rate: String(top.min_interest_rate || 0),
      max_rate: String(top.max_interest_rate || top.min_interest_rate || 0),
    });
  }

  // '조건별' 우대금리 문자열을 파싱하여 객체 배열로 만듭니다.
  const specialConditionsString = bottom1.special_conditions || "";
  const byCondition = specialConditionsString
    .split(/<br\s*\/?>/i)
    .map((line) => line.replace(/①|②|③|④|⑤/g, "").trim())
    .filter((line) => line)
    .map((line) => {
      const match = line.match(/(.*\S)\s*\((.+)\)$/);
      if (match) {
        return { condition: match[1].trim(), benefit: match[2].trim() };
      }
      return { condition: line, benefit: "" };
    });

  const out = {
    id: top.finproduct_id,
    bank: top.bank_name,
    product: top.product_name,
    imageUrl: top.image_url,
    tags: top.product_type_chip || [],
    rates: {
      max: percentStringToDecimal(top.max_interest_rate),
      base: percentStringToDecimal(top.min_interest_rate),
    },
    termMonths: inferMonths(byPeriod),
    details: {
      period: bottom1.period || "", // '기간' 데이터 연결
      amount: bottom1.product_guide,
      method: bottom1.subscription_method,
      target: bottom1.target,
      benefitCondition: bottom1.special_conditions,
      interestPayment: "만기일시지급",
      notice:
        "만기 전 해지할 경우 약정 금리보다 낮은 중도해지금리가 적용됩니다.",
    },
    rateInfo: {
      byPeriod,
      byCondition,
    },
  };

  console.log("[normalize] output sample", out);
  return out;
}
