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

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = { sender: "bot", text: "Oops! Something went wrong." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
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
            AI Chat bot
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
            {loading && <div className="chat-message bot">Typing...</div>}
          </div>
          <div className="ai-chat-input">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
