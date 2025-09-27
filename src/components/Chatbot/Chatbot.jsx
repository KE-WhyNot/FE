import React, { useState } from 'react';
import './Chatbot.css';

// ✨ onClose prop은 여전히 닫기 기능을 위해 필요합니다.
const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: '안녕하세요! 저는 당신만의 금융 비서, 유스파이입니다. 무엇을 도와드릴까요?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessages = [...messages, { id: Date.now(), text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');
    // ... (임시 답변 로직)
  };

  return (
    // ✨ 오버레이 div를 제거하고 chatbot-container를 최상위 요소로 변경
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>유스파이</h3>
        <button onClick={onClose} className="close-btn">&times;</button>
      </div>
      <div className="chatbot-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
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
        <button type="submit">전송</button>
      </form>
    </div>
  );
};

export default Chatbot;