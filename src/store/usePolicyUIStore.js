// store/usePolicyUIStore.js
import { create } from "zustand";

const usePolicyUIStore = create((set) => ({
  // ✅ 페이지네이션 관련 상태
  pageNum: 1,
  pageSize: 12,

  // ✅ 정렬 상태
  sortOrder: "관련도순",
  isSortDropdownOpen: false,

  // ✅ 필터 상태
  activeFilter: null,
  selectedFilters: {
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

  resetFilters: () =>
    set({
      selectedFilters: { categories: {}, personal: {} },
      activeFilter: null,
    }),
}));

export default usePolicyUIStore;
