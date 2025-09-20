import React, { useState, useRef } from "react";
import "../css/AIChat.css";

export default function AIChat() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I am your AI assistant. How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef(null);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // professors for fake demo
  const professors = ["Dr. Smith", "Prof. Gupta", "Dr. Lee", "Prof. Johnson"];

  // simple fake AI dataset
  const fakeReplies = (userInput) => {
    const lower = userInput.toLowerCase();

    if (lower.includes("hi") || lower.includes("hii") || lower.includes("hello")) {
      return "Hii 👋, how are you? How can I help you today?";
    }

    if (lower.includes("whats new") || lower.includes("what's new")) {
      // randomly decide between video update or top professor
      if (Math.random() > 0.5) {
        return "A professor just added a new video 🎥. Go check it out!";
      } else {
        const randomProf = professors[Math.floor(Math.random() * professors.length)];
        return `The top professor right now is ${randomProf} 🌟.`;
      }
    }

    if (lower.includes("bye")) {
      return "Goodbye! 👋 Have a great day!";
    }

    if (lower.includes("react")) {
      return "React is a JavaScript library for building user interfaces ⚛️.";
    }

    if (lower.includes("css")) {
      return "CSS is used to style and design web pages 🎨.";
    }

    return "Hmm 🤔 I’m not sure, but I can still chat with you!";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const reply = fakeReplies(userMessage.text);
      const botMessage = { sender: "bot", text: reply };
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
    }, 1000); // fake typing delay
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // Drag handlers
  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };
  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };
  const handleMouseUp = () => setDragging(false);

  return (
    <div
      className={`ai-chat-wrapper ${isOpen ? "open" : ""}`}
      style={{ top: position.y, left: position.x }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={chatRef}
    >
      {/* Floating button */}
      {!isOpen && (
        <button className="ai-float-button" onClick={() => setIsOpen(true)} onMouseDown={handleMouseDown}>
          💬
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="ai-chat-window">
          <div className="chat-header" onMouseDown={handleMouseDown}>
            <span className="chat-header-title">
              <span className="chat-header-status"></span> AI Chat Bot
            </span>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              ✖
            </button>
          </div>
          <div className="ai-chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="typing-indicator">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            )}
          </div>
          <div className="ai-chat-input">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSend} className={loading ? "loading" : ""}>
              {loading ? "" : "➤"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
