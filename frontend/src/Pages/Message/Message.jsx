import React, { useEffect, useState } from "react";
import './Message.css';
import Chat from "../../components/ui/Chat/Chat";
import ChatRoom from "./ChatRooms/ChatRoom";

const Message = ({ socket, messages, isMobile, isTablet,user }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentchat, setCurrentChat] = useState({title:'',image:'',members:[]})

    //use useeffect to store the current chat in sqlite
    useEffect(() => {
          console.log(currentchat,'====');
        }, [currentchat]);


    // const sendMessage = (e) => {
    //   e.preventDefault();
    //   if (input.trim() === "") return; // Prevent sending empty messages
    //   socket?.emit("message", {
    //     text: input,
    //     room: "Chats",
    //   });
    //   setInput(""); // Clear input after sending
    // };
  

    return (
      <div className="message-container">
          
          <ChatRoom  isMobile={isMobile} isTablet={isTablet} updateCurrentChat={(item) => setCurrentChat(item)}  />

          <Chat title ={currentchat.title} image={currentchat.image} members={currentchat.members} socket={socket} user={user} />
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
