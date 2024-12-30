import logo from './logo.svg';

import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client"; // Import socket.io-client for WebSocket connection
import Sidebar from "./components/ui/SideBar/SideBar"; // Import the Sidebar component
import './App.css';
import Button from './components/ui/Button/Button';
import useDeviceType from './hooks/useDeviceType';
import Message from './Pages/Message/Message';

function App() {
  const user = {id:'23131243rceve',firstname:'Oscar', lastname:'Oguledo', img:'',loggedin:true};
  const {isMobile,isTablet} =useDeviceType();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentRoom, setCurrentRoom] = useState({ icon: 'fa-user', text: 'Profiles' });
  const [name, setName] = useState(null);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const onceRef = useRef(false);

  useEffect(() => {
      setMessages([]);
      socket?.emit("join", currentRoom.text);
    }, [currentRoom.text,socket]);
  
  useEffect(() => {
      if (onceRef.current) {
        return;
      }
  
      onceRef.current = true;
  
      const socket = io("ws://localhost:8080");
      setSocket(socket);
  
      socket.on("connect", () => {
        console.log("Connected to socket server");
        setName(`anon-${socket.id}`);
        setConnected(true);
        console.log("joining room", currentRoom.text);
  
        socket.emit("join", currentRoom.text);
      });
  
      socket.on("message", (msg) => {
        console.log("Message received", msg);
        msg.date = new Date(msg.date);
        setMessages((messages) => [ ...messages,msg]);
      });
  
      socket.on("messages", (msg) => {
        console.log("Messages received", msg);
        // let messages = msgs.messages.map((msg) => {
        //   msg.date = new Date(msg.date);
        //   return msg;
        // });
        // setMessages(messages);
        setMessages((messages) => [  ...messages,msg]);
      });
    }, []);

  // const sendMessage = (e) => {
  //   e.preventDefault();
  //   socket?.emit("message", {
  //     text: input,
  //     room: currentRoom.text,
  //   });
  //   setInput("");
  // };
  const rooms = [
    { icon: 'fa-user', text: 'Profiles' },
    { icon: 'fa-calendar', text: 'Calendar' },
    { icon: 'fa-address-book', text: 'Contacts' },
    { icon: 'fa-messages', text: 'Chats' },
    { icon: 'fa-bells', text: 'Activities' },
    {icon:'fa-medal',text:'Achievements'},
    {icon:'fa-gear',text:'Settings'}
  ];

  return (
    <div className="App">
      {/* Close Button */}
      
      {/* Sidebar component */}
      <Sidebar
          rooms={rooms}
          currentRoom={currentRoom.text}
          onEnterRoom={(room) => {setCurrentRoom(room)}}
          user={user}
        />
        
        {/* Main Chat Section */}
        <div className="main-content">
          {/* Mobile Sidebar Toggle Button */}
          
          
          {/* Chat Header
          <div className="chat-header">
            <h1>{currentRoom.text}</h1>
          </div> */}

          {/* messages */}
          {currentRoom.text === 'Chats'?
          <Message socket={socket} messages={messages} isMobile={isMobile} isTablet={isTablet} user ={user}/>
          :null}
        </div>
    </div>
  );
}

export default App;
