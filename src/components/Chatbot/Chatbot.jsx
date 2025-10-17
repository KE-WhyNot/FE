import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import { IoSend } from "react-icons/io5";
import chatbotAvatar from "../../assets/images/chatbot.png";
import financeAxios from "../../api/financeAxiosInstance";
import useAuthStore from "../../store/useAuthStore";

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
  const [loadingMessage, setLoadingMessage] = useState("잠시만 기다려주세요.");
  const [loading, setLoading] = useState(false);

  const { user, isAuthenticated } = useAuthStore();
  const userId =
    isAuthenticated && user
      ? user.id || user.userId || user.username || "unknown_user"
      : "guest";
  const sessionId = getSessionId();

  const messagesEndRef = useRef(null);

  // ✅ 새 메시지가 추가될 때마다 스크롤 맨 아래로 이동
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  // ✅ 로딩 텍스트 순환 효과
  useEffect(() => {
    if (!loading) return;
    const states = [
      "잠시만 기다려주세요.",
      "잠시만 기다려주세요..",
      "잠시만 기다려주세요...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingMessage(states[i]);
      i = (i + 1) % states.length;
    }, 600);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      localStorage.setItem("userId", userId);

      const payload = {
        message: input,
        user_id: userId,
        session_id: sessionId,
      };

      const res = await financeAxios.post("/api/ai/chat", payload);
      const data = res.data?.result;
      const replyText =
        data?.success && data?.reply_text
          ? data.reply_text
          : "죄송합니다, 응답을 처리할 수 없습니다.";

      // ✅ 줄바꿈 적용 및 ‘더보기’용 처리
      const formattedText = replyText.split("\n");
      const isLong = formattedText.length > 10;
      const previewText = isLong
        ? formattedText.slice(0, 10).join("\n")
        : formattedText.join("\n");

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: previewText,
          fullText: formattedText.join("\n"),
          sender: "bot",
          expandable: isLong,
          expanded: false,
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

  // ✅ “더보기” 클릭 시 전체 내용 표시
  const handleExpand = (id) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, expanded: true, text: msg.fullText } : msg
      )
    );
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
              {msg.text.split("\n").map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
              {msg.expandable && !msg.expanded && (
                <button
                  className="more-btn"
                  onClick={() => handleExpand(msg.id)}
                >
                  ...더보기
                </button>
              )}
            </div>
          ))}

          {loading && (
            <div className="message-bubble bot loading">
              <span>{loadingMessage}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
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
