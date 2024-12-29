import React, { useState } from "react";
import Button from '../../components/ui/Button/Button'; // Ensure your Button component is imported
import './Message.css';
import Header from "../../components/ui/Header/Header";
const Message = ({ socket, messages, isMobile, isTablet }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  const middleItems = ["Item 1", "Item 2", "Item 3"];
  const rightSuffix = <i
                        onClick={() => setSidebarOpen(!sidebarOpen)} 
                        className={`fa-thin fa-xmark open-btn ${sidebarOpen ? "open-btn-open" : ""}`}
                      />;


  return (
    <div className="message-container">
        <div className="messages-channels-section">
          <div className="channel-item">
            <h3>Chats</h3>
            <p>View all your messages and ongoing conversations.</p>
          </div>

          <div className="channel-item">
            <h3>Notifications</h3>
            <p>Check your latest notifications for updates and alerts.</p>
          </div>

          <div className="channel-item">
            <h3>Contacts</h3>
            <p>Manage your contacts and add new ones.</p>
          </div>
        </div>

        <div className="messages-section">
          <Header
            title="My Awesome App" 
            middleItems={middleItems} 
            rightSuffix={rightSuffix} 
          />
          {/* Chat Messages */}
          <ul className="messages-list">
            
            {messages.map((msg, index) => (
              <li key={index} className="message-item">
                <div className="message-header">
                  <p className="user-name">{msg.user}</p>
                  <p className="message-time">{msg?.date?.toLocaleString()}</p>
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
        <div className={`messages-profile-section ${sidebarOpen?'messages-profile-section-open':''}`}>
          <div className="channel-item">
            <h3>Chats</h3>
            <p>View all your messages and ongoing conversations.</p>
          </div>

          <div className="channel-item">
            <h3>Notifications</h3>
            <p>Check your latest notifications for updates and alerts.</p>
          </div>

          <div className="channel-item">
            <h3>Contacts</h3>
            <p>Manage your contacts and add new ones.</p>
          </div>
        </div>
      
    </div>

  );
};

export default Message;
