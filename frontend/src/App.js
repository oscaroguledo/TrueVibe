import logo from './logo.svg';

import React, { useEffect, useState } from "react";
import io from "socket.io-client"; // Import socket.io-client for WebSocket connection
import Sidebar from "./components/ui/SideBar/SideBar"; // Import the Sidebar component
import './App.css';
import useDeviceType from './hooks/useDeviceType';
import Message from './Pages/Message/Message';

function App() {
  const user = {id:'23131243rceve',username:'oscar121',firstname:'Oscar', lastname:'Oguledo',email:'test@gmail.com', image:'',loggedin:true};
  const {isMobile,isTablet} =useDeviceType();
  const [currentScreen, setCurrentScreen] = useState({ icon: 'fa-user', text: 'Profiles' });
  const [socket,setSocket] = useState(null);
  
  
  const screens = [
    { icon: 'fa-user', text: 'Profiles' },
    { icon: 'fa-calendar', text: 'Calendar' },
    { icon: 'fa-address-book', text: 'Contacts' },
    { icon: 'fa-messages', text: 'Chats' },
    { icon: 'fa-bells', text: 'Activities' },
    {icon:'fa-medal',text:'Achievements'},
    {icon:'fa-gear',text:'Settings'}
  ];
  useEffect(() => {
    const socket = io("ws://localhost:8080");
    setSocket(socket);
    socket?.on("connection", (data) => {
      console.log(data,"Connected to socket server");
      // setName(`anon-${socket.id}`);
      
    });

  }, []);

  return (
    <div className="App">
      {/* Close Button */}
      
      {/* Sidebar component */}
      <Sidebar
          screens={screens}
          currentScreen={currentScreen.text}
          onEnterScreen={(screen) => {setCurrentScreen(screen)}}
          user={user}
        />
        
        {/* Main Chat Section */}
        <div className="main-content">
          {/* Mobile Sidebar Toggle Button */}
          
          {/* messages */}
          {currentScreen.text === 'Chats'?
          <Message socket={socket} isMobile={isMobile} isTablet={isTablet} user ={user}/>
          :null}
        </div>
    </div>
  );
}

export default App;
