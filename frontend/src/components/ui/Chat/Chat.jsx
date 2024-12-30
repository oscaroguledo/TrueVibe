import React, { useState } from "react";
import { Avatar,Typography } from "antd";
import "./Chat.css"; // Custom CSS for styling
import Button from "../Button/Button";
import Icon from "../Icon/Icon";
import getLetterColor from "../../../utils/colors";
import { Input } from "../TextInput/TextInput";
const { Text } = Typography;


const Chat = ({ title, image, members, socket, user }) => {
    const { color, backgroundColor } = getLetterColor('£');
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    //use useffect to load from json first, if not possible then load from the server
    // load the first 10 every one sec
    //on evry load. update the sqlite3 and use state
    const sendMessage = (e) => {
      e.preventDefault();
      if (input.trim()) return; // Prevent sending empty messages
      const newMessage = {
          user: user.id, ///the person sending the message
          text: input,
          room: "Chats",
          subroom: title, //who the message goes to
          date: new Date(),
        };
      socket?.emit("message", newMessage);
      setMessages([...messages, newMessage]);
      setInput(""); // Clear input after sending
  };

  return (
    <div className="chat-container">
        {/* Chat Header */}
        <div className="chat-header">
            <div className="chat-title">
                <Avatar src={image} alt={title} size={42} />
                <Text className="chat-title-name">{title}</Text>
                <div className="chat-title-users">
                  {members?
                    <>
                      <span className="chat-title-users-images">
                          {members?.slice(0,2).map((member, index)=>(
                            <Avatar 
                                key={index} 
                                src={member.img} 
                                alt={title} 
                                size={32} 
                                children={member.name?member.name[0]:'O'}
                                style={{
                                  backgroundColor: backgroundColor,
                                  color: color,
                                  textTransform: 'uppercase',}}
                            />
                          ))}
                      </span>
                      <small className="chat-title-users-online">
                          + {members?members.length:3 - 3} Online
                      </small>
                    </>
                    :<></>}
                
                </div>
            </div>
            

            <div className="chat-title-suffix">
              <Icon name='fa-circle-info'/>
              <Icon name='fa-gear'/> 
              <Icon name='fa-ellipsis-vertical'/></div>
        </div>

        {/* Chat Messages */}
        <ul className="messages-list">
          {messages.map((msg, index) => (
            <li key={index} className={`message-item ${msg.user === "You" ? "my-message" : "other-message"}`}>
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
          <Input type="text" value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-box"
            placeholder="Enter message..." /> 
          <Button type="submit" icon='fa-paper-plane' className='message-input-submit-btn' text="Send" />
        </form>
    </div>
  );
};

export default Chat;
