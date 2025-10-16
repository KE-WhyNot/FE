import { useQuery } from "@tanstack/react-query";
import policyAxios from "../api/policyAxiosInstance";

/**
 * 정책 목록 요청 훅
 * - 필터 상태(selectedFilters), 정렬(sortOrder), 검색어(searchWord)에 따라 API 호출
 */
export const usePoliciesQuery = (
  pageNum,
  pageSize,
  selectedFilters,
  sortOrder,
  searchWord // ✅ 추가됨
) => {
  return useQuery({
    queryKey: [
      "policies",
      pageNum,
      pageSize,
      selectedFilters,
      sortOrder,
      searchWord,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();

      // ✅ 페이지 정보
      params.append("page_num", pageNum);
      params.append("page_size", pageSize);

      // ✅ 검색어 추가
      if (searchWord && searchWord.trim() !== "") {
        params.append("search_word", searchWord.trim());
      }

      // ✅ 정책 카테고리 (소분류)
      Object.entries(selectedFilters.categories || {}).forEach(([_, subs]) => {
        (subs || []).forEach((sub) => {
          if (sub && sub.trim()) params.append("category_small", sub);
        });
      });

      // ✅ 퍼스널 정보 필터
      const personal = selectedFilters.personal || {};

      // ✅ 지역 ID (숫자 변환)
      if (personal["지역_ID"]?.subIds?.length > 0) {
        personal["지역_ID"].subIds.forEach((id) => {
          if (id !== null && id !== undefined) {
            params.append("regions", Number(id));
          }
        });
      }

      // ✅ 혼인여부 (전체 제외)
      if (personal["혼인여부"] && personal["혼인여부"] !== "전체") {
        params.append("marital_status", personal["혼인여부"]);
      }

      // ✅ 연령
      if (personal.age && Number(personal.age) > 0) {
        params.append("age", Number(personal.age));
      }

      // ✅ 연소득 최소 / 최대
      if (personal.income_min && Number(personal.income_min) > 0) {
        params.append("income_min", Number(personal.income_min));
      }
      if (personal.income_max && Number(personal.income_max) > 0) {
        params.append("income_max", Number(personal.income_max));
      }

      // ✅ 학력
      if (personal["학력"] && personal["학력"] !== "제한없음") {
        params.append("education", personal["학력"]);
      }

      // ✅ 전공요건
      if (personal["전공요건"] && personal["전공요건"] !== "제한없음") {
        params.append("major", personal["전공요건"]);
      }

      // ✅ 취업상태
      if (personal["취업상태"] && personal["취업상태"] !== "제한없음") {
        params.append("job_status", personal["취업상태"]);
      }

      // ✅ 특화분야
      if (personal["특화분야"] && personal["특화분야"] !== "제한없음") {
        params.append("specialization", personal["특화분야"]);
      }

      // ✅ 정렬 순서 (한글 → API sort_by 코드 매핑)
      const sortMap = {
        마감임박순: "deadline",
        최신순: "newest",
        오래된순: "oldest",
      };
      params.append("sort_by", sortMap[sortOrder] || "deadline");

      // ✅ 최종 URL
      const queryString = params.toString();
      const url = `/api/policy/list?${queryString}`;

      console.log("📡 [정책 요청 URL]", decodeURIComponent(url));

      // ✅ 요청
      let res;
      try {
        res = await policyAxios.get(url);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          return { list: [], totalCount: 0 };
        }
        throw err;
      }

      // ✅ 데이터 구조 정리
      const result = res.data?.result || {};
      const list = result.youthPolicyList || [];
      const totalCount = result.pagging?.total_count || 0;

      return { list, totalCount };
    },
    keepPreviousData: true,
  });
};
