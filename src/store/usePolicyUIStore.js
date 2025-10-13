// store/usePolicyUIStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware"; // ✅ 페이지 이동/새로고침 후에도 상태 유지

const usePolicyUIStore = create(
  persist(
    (set) => ({
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

      // ✅ 검색 상태
      searchInput: "", // 입력 중 검색어
      searchWord: "", // 실제 API 호출 시 사용될 검색어

      // ✅ 액션 함수들
      setPageNum: (pageNum) => set({ pageNum }),
      setSortOrder: (sortOrder) => set({ sortOrder }),
      toggleSortDropdown: () =>
        set((state) => ({ isSortDropdownOpen: !state.isSortDropdownOpen })),
      closeSortDropdown: () => set({ isSortDropdownOpen: false }),

      setActiveFilter: (filter) => set({ activeFilter: filter }),

      setSelectedFilters: (selectedFilters) => set({ selectedFilters }),
      setAppliedFilters: (appliedFilters) => set({ appliedFilters }),

      // ✅ 검색어 관련 setter
      setSearchInput: (val) => set({ searchInput: val }),
      setSearchWord: (val) => set({ searchWord: val }),

      // ✅ 초기화 (UI + API용 필터 + 검색어 모두 리셋)
      resetFilters: () =>
        set({
          selectedFilters: { categories: {}, personal: {} },
          appliedFilters: { categories: {}, personal: {} },
          activeFilter: null,
          sortOrder: "마감임박순",
          pageNum: 1,
          searchInput: "",
          searchWord: "",
        }),
    }),
    {
      name: "policy-ui-storage", // localStorage key
      getStorage: () => localStorage, // 새로고침 후에도 상태 유지
    }
  )
);

export default usePolicyUIStore;
