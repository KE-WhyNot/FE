// hooks/usePoliciesQuery.js
import { useQuery } from "@tanstack/react-query";
import { fetchPolicies } from "../api/policyApi";

export const usePoliciesQuery = (pageNum, pageSize) => {
  return useQuery({
    queryKey: ["policies", pageNum, pageSize],
    queryFn: () => fetchPolicies({ pageNum, pageSize }),
    keepPreviousData: true, // ✅ 페이지 이동 시 부드럽게
    staleTime: 1000 * 60 * 3, // ✅ 3분 캐싱
  });
};
