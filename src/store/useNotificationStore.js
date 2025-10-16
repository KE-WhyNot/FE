import { create } from "zustand";
import notifyAxios from "../api/notifyAxiosInstance";

const useNotificationStore = create((set) => ({
  notifications: [],
  headerNotifications: [],
  unreadCount: 0,
  totalPages: 0,
  loading: false,

  // ✅ 전체 알림 불러오기 (Notification 페이지용)
  fetchNotifications: async (userId, page = 0, size = 10) => {
    if (!userId) {
      console.warn("⚠️ fetchNotifications: userId 없음, 요청 중단");
      return;
    }
    set({ loading: true });
    try {
      console.log("📤 요청 파라미터:", { userId, page, size });
      const res = await notifyAxios.get("/notifications", {
        headers: { "X-User-Id": userId },
        params: {
          page,
          size: Number(size), // ✅ 명시적 숫자 변환
          sort: "createdAt,desc", // ✅ 문자열 형태로 전달
        },
      });

      console.log("📬 응답 데이터:", res.data);

      const { content, totalPages } = res.data.data ?? {};
      set({
        notifications: content || [],
        totalPages: totalPages ?? 1,
      });
    } catch (err) {
      console.error("🔴 알림 불러오기 실패:", err);
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Header용 최신 4개만 가져오기
  fetchHeaderNotifications: async (userId) => {
    if (!userId) {
      console.warn("⚠️ fetchHeaderNotifications: userId 없음, 요청 중단");
      return;
    }
    try {
      const res = await notifyAxios.get("/notifications", {
        headers: { "X-User-Id": userId },
        params: { page: 0, size: 4, sort: "createdAt,desc" },
      });
      const { content } = res.data.data;
      set({ headerNotifications: content || [] });
    } catch (err) {
      console.error("🔴 Header 알림 불러오기 실패:", err);
    }
  },

  // ✅ 안읽은 알림 수 가져오기
  fetchUnreadCount: async (userId) => {
    if (!userId) {
      console.warn("⚠️ fetchUnreadCount: userId 없음, 요청 중단");
      return;
    }
    try {
      const res = await notifyAxios.get("/notifications/unread-count", {
        headers: { "X-User-Id": userId },
      });
      set({ unreadCount: res.data?.data?.count || 0 });
    } catch (err) {
      console.error("🔴 안읽은 알림 수 로드 실패:", err);
    }
  },

  // ✅ 알림 읽음 처리
  markAsRead: async (userId, id) => {
    if (!userId) {
      console.warn("⚠️ markAsRead: userId 없음, 요청 중단");
      return;
    }
    try {
      await notifyAxios.post(`/notifications/${id}/read`, null, {
        headers: { "X-User-Id": userId },
      });
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.notificationId === id ? { ...n, read: true } : n
        ),
        headerNotifications: state.headerNotifications.map((n) =>
          n.notificationId === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(state.unreadCount - 1, 0),
      }));
    } catch (err) {
      console.error("🔴 읽음 처리 실패:", err);
    }
  },
}));

export default useNotificationStore;
