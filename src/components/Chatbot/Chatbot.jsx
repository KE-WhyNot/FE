import React, { useState } from "react";
import "./Chatbot.css";
import { IoSend } from "react-icons/io5";
import chatbotAvatar from "../../assets/images/chatbot.png";
import financeAxios from "../../api/financeAxiosInstance"; // ✅ 금융 API axios 인스턴스
import useAuthStore from "../../store/useAuthStore"; // ✅ 로그인 유저 정보 (있다면)

// ✅ 세션 ID 생성 (고유값 보존)
const getSessionId = () => {
  if (!sessionStorage.getItem("chat_session_id")) {
    sessionStorage.setItem("chat_session_id", Date.now().toString());
  }
  return sessionStorage.getItem("chat_session_id");
};

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "안녕하세요! 저는 당신만의 금융 비서, 유스파이입니다. 무엇을 도와드릴까요?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, isAuthenticated } = useAuthStore();

  // ✅ 유저 ID 확보 (로그인 여부 고려)
  const userId =
    isAuthenticated && user
      ? user.id || user.userId || user.username || "unknown_user"
      : "guest";

  const sessionId = getSessionId();

  // ✅ 메시지 전송 함수
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 사용자 메시지 추가
    const userMessage = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // ✅ 요청 전 localStorage에 userId 저장 (interceptor가 읽어감)
      localStorage.setItem("userId", userId);

      // ✅ API 요청 본문
      const payload = {
        message: input,
        user_id: userId,
        session_id: sessionId,
      };

      console.log("📡 [Chat 요청 전송]", payload);

      // ✅ 요청
      const res = await financeAxios.post("/api/ai/chat", payload);
      const data = res.data?.result;

      console.log("🤖 [Chat 응답 수신]", data);

      const replyText =
        data?.success && data?.reply_text
          ? data.reply_text
          : "죄송합니다, 응답을 처리할 수 없습니다.";

      // ✅ 봇 응답 추가
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: replyText,
          sender: "bot",
        },
      ]);
    } catch (error) {
      console.error("❌ Chatbot API 오류:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          text: "죄송합니다. 서버와의 연결 중 오류가 발생했습니다.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-overlay" onClick={onClose}>
      <div className="chatbot-container" onClick={(e) => e.stopPropagation()}>
        {/* --- 헤더 --- */}
        <div className="chatbot-header">
          <div className="header-info">
            <img
              src={chatbotAvatar}
              alt="Chatbot Avatar"
              className="bot-avatar-img"
            />
            <div>
              <h3>유스파이</h3>
              <span>온라인</span>
            </div>
          </div>
          <button onClick={onClose} className="close-btn">
            &times;
          </button>
        </div>

        {/* --- 메시지 영역 --- */}
        <div className="chatbot-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-bubble ${msg.sender}`}>
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="message-bubble bot loading">
              <span>...</span>
            </div>
          )}
        </div>

        {/* --- 입력창 --- */}
        <form className="chatbot-input-form" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="무엇이 궁금하신가요?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="send-btn" disabled={loading}>
            <IoSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
