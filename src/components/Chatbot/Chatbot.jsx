import React, { useState } from "react";
import "./Chatbot.css";
import { IoSend } from "react-icons/io5"; // ✨ 전송 아이콘

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "안녕하세요! 저는 당신만의 금융 비서, 유스파이입니다. 무엇을 도와드릴까요?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { id: Date.now(), text: input, sender: "user" },
    ];
    setMessages(newMessages);
    setInput("");

    // 간단한 봇 답변 로직 (임시)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: "답변 로직 처리해야함", sender: "bot" },
      ]);
    }, 1000);
  };

  return (
    // ✨ 뒷배경을 어둡게 하는 오버레이를 다시 추가합니다.
    <div className="chatbot-overlay" onClick={onClose}>
      {/* ✨ 이벤트 버블링을 막아, 챗봇 창 클릭 시 닫히지 않게 합니다. */}
      <div className="chatbot-container" onClick={(e) => e.stopPropagation()}>
        <div className="chatbot-header">
          <div className="header-info">
            <div className="bot-avatar">🤖</div>
            <div>
              <h3>유스파이</h3>
              <span>온라인</span>
            </div>
          </div>
          <button onClick={onClose} className="close-btn">
            &times;
          </button>
        </div>
        <div className="chatbot-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-bubble ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <form className="chatbot-input-form" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="무엇이 궁금하신가요?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="send-btn">
            <IoSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
