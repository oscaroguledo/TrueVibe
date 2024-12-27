import React, { useState } from "react";
import Button from '../../components/ui/Button/Button'; // Ensure your Button component is imported

const Message = ({ socket, messages, isMobile, isTablet }) => {
  const [input, setInput] = useState("");
  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === "") return; // Prevent sending empty messages
    socket?.emit("message", {
      text: input,
      room: "Chats",
    });
    setInput(""); // Clear input after sending
  };

  return (
    <div className="message-container">
      <div className="messages-section">
        {/* Chat Messages */}
        <ul className="messages-list">
          {messages.map((msg, index) => (
            <li key={index} className="message-item">
              <div className="message-header">
                <p className="user-name">{msg.user}</p>
                <p className="message-time">{msg.date.toLocaleString()}</p>
              </div>
              <p className="message-text">{msg.text}</p>
            </li>
          ))}
        </ul>

        {/* Message Input */}
        <form className="message-input" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-box"
            placeholder="Enter message..."
          />
          <Button type="submit" icon="fa-heart" text={'Send'} />
        </form>
      </div>
    </div>
  );
};

export default Message;
