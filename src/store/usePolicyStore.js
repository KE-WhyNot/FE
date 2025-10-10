import { create } from "zustand";
import axios from "axios";

const usePolicyStore = create((set, get) => ({
  policiesByPage: {},
  totalCount: 0,
  isLoading: false,
  error: null,

  fetchPolicies: async (pageNum = 1, pageSize = 12) => {
    const cached = get().policiesByPage[pageNum];
    if (cached) return;

    set({ isLoading: true, error: null });

    try {
      const res = await axios.get(
        `https://policy.youth-fi.com/api/policy/list?page_num=${pageNum}&page_size=${pageSize}`
      );

      const result = res.data?.result;

      if (result) {
        let list = result.youthPolicyList || [];

        // ✅ [임시] 데이터가 너무 많을 경우, 최대 100개까지만 표시
        // 👉 나중에 백엔드 페이지네이션 정상화되면 이 부분은 제거해도 됨
        if (list.length > 50) {
          console.warn("⚠️ 너무 많은 데이터 수신됨, 100개까지만 표시 중");
          list = list.slice(0, 50);
        }

        set((state) => ({
          policiesByPage: {
            ...state.policiesByPage,
            [pageNum]: list,
          },
          totalCount: Math.min(result.pagging.total_count || 0, 50), // 표시되는 개수도 맞춰줌
        }));
      }
    } catch (err) {
      console.error("❌ 정책 리스트 불러오기 실패:", err);
      set({ error: err });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default usePolicyStore;
