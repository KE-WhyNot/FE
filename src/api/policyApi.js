// src/api/policyApi.js
import policyAxios from "./policyAxiosInstance";

/**
 * 청년정책 목록 가져오기
 * @param {Object} params
 * @param {number} params.pageNum - 현재 페이지 번호
 * @param {number} params.pageSize - 한 페이지당 표시할 개수
 * @returns {Promise<{ list: Array, totalCount: number }>}
 */
export const fetchPolicies = async ({ pageNum = 1, pageSize = 12 } = {}) => {
  try {
    const response = await policyAxios.get("/api/policy/list", {
      params: {
        page_num: Number(pageNum),
        page_size: Number(pageSize),
      },
    });

    const result = response.data?.result;

    if (!result) {
      throw new Error("서버 응답에 result 필드가 없습니다.");
    }

    let list = result.youthPolicyList || [];

    /**
     * ✅ [임시 제한] 너무 많은 데이터가 올 경우, 50개까지만 표시
     *    - 나중에 백엔드 페이지네이션이 완성되면 이 부분 제거 가능
     */
    if (list.length > 50) {
      console.warn("⚠️ 데이터가 많아 50개까지만 표시 중입니다.");
      list = list.slice(0, 50);
    }

    return {
      list,
      totalCount: Math.min(result.pagging?.total_count || list.length, 50),
    };
  } catch (error) {
    console.error("❌ 정책 목록 불러오기 실패:", error);
    throw error;
  }
};

/**
 * 정책 상세 정보 가져오기
 * @param {string|number} policyId - 정책 ID
 * @returns {Promise<Object>} 정책 상세 데이터
 */
export const fetchPolicyDetail = async (policyId) => {
  if (!policyId) throw new Error("policyId가 필요합니다.");

  try {
    const response = await policyAxios.get(`/api/policy/${policyId}`);
    const result = response.data?.result;

    if (!result) {
      throw new Error("서버 응답에 result 필드가 없습니다.");
    }

    return result;
  } catch (error) {
    console.error("❌ 정책 상세 불러오기 실패:", error);
    throw error;
  }
};
