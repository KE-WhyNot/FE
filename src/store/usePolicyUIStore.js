// store/usePolicyUIStore.js
import { create } from "zustand";

const usePolicyUIStore = create((set) => ({
  // ✅ 페이지네이션 관련 상태
  pageNum: 1,
  pageSize: 12,

  // ✅ 정렬 상태
  sortOrder: "마감임박순",
  isSortDropdownOpen: false,

  // ✅ 필터 상태
  activeFilter: null,
  selectedFilters: {
    categories: {},
    personal: {},
  },

  // ✅ 실제 API 요청에 사용되는 필터 상태
  appliedFilters: {
    categories: {},
    personal: {},
  },

  // ✅ 액션 함수들
  setPageNum: (pageNum) => set({ pageNum }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  toggleSortDropdown: () =>
    set((state) => ({ isSortDropdownOpen: !state.isSortDropdownOpen })),
  closeSortDropdown: () => set({ isSortDropdownOpen: false }),

  setActiveFilter: (filter) => set({ activeFilter: filter }),

  setSelectedFilters: (selectedFilters) => set({ selectedFilters }),
  setAppliedFilters: (appliedFilters) => set({ appliedFilters }),

  // ✅ 초기화 (UI + API용 필터 둘 다 리셋)
  resetFilters: () =>
    set({
      selectedFilters: { categories: {}, personal: {} },
      appliedFilters: { categories: {}, personal: {} },
      activeFilter: null,
      sortOrder: "마감임박순", // ⚙️ 정렬도 초기화 (원하면 삭제 가능)
      pageNum: 1,
    }),
}));

export default usePolicyUIStore;
