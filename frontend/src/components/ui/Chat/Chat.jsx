import React, { useRef, useState } from "react";
import { Avatar,Typography,Drawer,Dropdown, Menu } from "antd";
import "./Chat.css"; // Custom CSS for styling
import Button from "../Button/Button";
import Icon from "../Icon/Icon";

import { Input, SearchInput } from "../TextInput/TextInput";
const { Text } = Typography;


const Chat = ({ currentChat, socket, user,isMobile,color, backgroundColor }) => {
    
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [searchbarshow, setSearchBarShow] = useState(false);
    const [ismuted, setIsMuted] = useState(false);

    const toggleMute = () => {
      setIsMuted(!ismuted)
    }
    const toggleSearchBar= () => {
      setSearchBarShow(!searchbarshow);
    };
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
          subroom: currentChat.name, //who the message goes to
          date: new Date(),
        };
      socket?.emit("message", newMessage);
      setMessages([...messages, newMessage]);
      setInput(""); // Clear input after sending
  };
  const [openDrawer, setOpenDrawer] = useState(false);
  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onDrawerClose = () => {
    setOpenDrawer(false);
  };
  // Define your Menu items
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <span style={{display:'flex', alignItems:'center', justifyContent: 'flex-start'}} onClick={showDrawer} >
          <Icon name="fa-circle-info" />
          <span style={{marginLeft:'8px', marginBottom:'2px'}}>Details</span>
        </span>
        {/* You can add other content inside the Menu.Item */}
      </Menu.Item>
      <Menu.Item key="2">
        <span style={{display:'flex', alignItems:'center', justifyContent: 'flex-start'}}>
          <Icon name='fa-gear'/>
          <span style={{marginLeft:'8px', marginBottom:'2px'}}>Settings</span>
        </span>
        
        {/* You can add other content inside the Menu.Item */}
      </Menu.Item>
      {isMobile ?
          <>
            <Menu.Item key="3">
              <span style={{display:'flex', alignItems:'center', justifyContent: 'flex-start'}}>
                <Icon name='fa-video'/>
                <span style={{marginLeft:'8px', marginBottom:'2px'}}>Video Call</span>
              </span>
              
              {/* You can add other content inside the Menu.Item */}
            </Menu.Item>
            <Menu.Item key="4">
              <span style={{display:'flex', alignItems:'center', justifyContent: 'flex-start'}}>
                <Icon name='fa-phone'/> 
                <span style={{marginLeft:'8px', marginBottom:'2px'}}>Audio Call</span>
              </span>
              
              {/* You can add other content inside the Menu.Item */}
            </Menu.Item>
            <Menu.Item key="5">
              <span style={{display:'flex', alignItems:'center', justifyContent: 'flex-start'}} onClick={toggleSearchBar}>
                <Icon name='fa-magnifying-glass' />
                <span style={{marginLeft:'8px', marginBottom:'2px'}}>Search</span>
              </span>
              
              {/* You can add other content inside the Menu.Item */}
            </Menu.Item>
              
          </>
          :
        null}
              
    </Menu>
  );

  
  const listRef = useRef(null);

  const handleWheel = (e) => {
    // Scroll the list based on mouse wheel movement
    if (listRef.current) {
      listRef.current.scrollTop += e.deltaY;
    }
  };

  const handleMouseDown = (e) => {
    const startY = e.clientY;
    const startScrollTop = listRef.current.scrollTop;

    const handleMouseMove = (moveEvent) => {
      const delta = moveEvent.clientY - startY;
      listRef.current.scrollTop = startScrollTop - delta;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  return (
    <div className="chat-container">
        {/* Chat Header */}
        <div className="chat-header">
            <div className="chat-title">
                <Avatar src={currentChat.image} children={!currentChat.image?'#':null} alt={currentChat.name} size={42} shape="square" />
                <Text className="chat-title-name">{currentChat.name}</Text>
                <div className="chat-title-users">
                  {currentChat.members?
                    <>
                      <span className="chat-title-users-images">
                          {currentChat.members?.slice(0,2).map((member, index)=>(
                            <Avatar 
                                key={index} 
                                src={member.img || '#'} 
                                alt={currentChat.title} 
                                size={32} 
                                children={member.name?member.name[0]:'O'}
                                style={{
                                  backgroundColor: backgroundColor,
                                  color: color,
                                  textTransform: 'uppercase',}}
                            />
                          ))}
                      </span>
                      <small className="chat-title-users-members">
                          <span>{currentChat?.members?.length||0} members</span>
                            {currentChat?.members?.length > 0 ?
                              <>
                                <span className="chat-title-users-members-online">{currentChat?.membersOnline || 0} Online</span>
                                <span className="chat-title-users-members-offline">{(currentChat?.members?.length||0 )- (currentChat?.membersOnline || 0)} offline</span>
                              </> 
                            :
                            <></>}
                          
                      </small>
                    </>
                    :
                    <div>{currentChat.online?<small className="chat-online">online</small>:
                      <small className="chat-offline">offline</small>}</div>}
                </div>
                
            </div>
            

            <div className="chat-title-suffix">
              {!isMobile ?<><Icon name='fa-video'/> 
              <Icon name='fa-phone'/> 
              <Icon name='fa-magnifying-glass' onClick={toggleSearchBar}/> </>:<></>}
              
              
              <Dropdown
                  overlay={menu}
                  placement="bottomRight"
                  trigger={['click']}
                  arrow={{
                    pointAtCenter: true,
                  }}
                >
                  <Icon name='fa-ellipsis-vertical' onClick={(e) => e.preventDefault()}/>
              </Dropdown>
            </div>
            <Drawer
              title="Basic Drawer"
              placement="right"
              closable={true}
              
              onClose={onDrawerClose}
              open={openDrawer}
              key="right"
            >
              <p>Some contents...</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
            </Drawer>
        </div>
        <div className="chat-content">
          <SearchInput 
                size="large"
                prefix={<Icon name={"fa-magnifying-glass"} size={"large"} />}
                className={`chat-search-bar ${searchbarshow?'chat-search-bar-visible':'chat-search-bar-hidden'}`} />
        
          {/* Chat Messages */}
          <ul className="messages-list" ref={listRef} onWheel={handleWheel} 
                onMouseDown={handleMouseDown}>
            {messages.map((msg, index) => (
              <li key={index} className={`message-item ${msg.user.id === "You" ? "my-message" : "other-message"}`}>
                <div className="message-header">
                  <p className="user-name">{msg.user}</p>
                  <p className="message-time">{msg?.date?.toLocaleString()}</p>
                </div>
                <p className="message-text">{msg.text}</p>
              </li>
            ))}
            {[1,2,3,4,5,6,7,8,9,0,5,4,3,4,4,1,2,3,4,5,6,7,8,9,0,5,4,3,4,4].map((msg, index) => (
              <li key={index} className={`message-item`}>
                  <Avatar
                      src={msg.user?.image || <Icon name='fa-user'/>}
                      size={36}
                      shape='square'
                      className="message-item-img"
                      style={{
                          backgroundColor: backgroundColor,
                          color: color,
                          textTransform: 'uppercase',
                          
                      }} />
                  <div className={`message-details ${msg.user?msg.user.id:msg === "You" ? "message-details-my-message" : "message-details-other-message"}`}>
                      <div className="message-header">
                        <p className="user-name">{msg.user || 'oscar oguledo'}</p>
                        
                      </div>
                      <div className="message-body">
                          <span>{msg.text || 'i added new flows to our design system. Now you can use them for yur projects'}</span>
                      </div>
                      <div className="message-footer">
                        <span className="message-reactions">
                        {[{img:null, amount:4},{img:null, amount:4}].map((reaction, index) => (
                            <span key={index} className={`message-reaction `}>
                              
                              <Avatar className="message-reaction-img" shape="circle" size={18} src={reaction.img} children={!reaction.img?'#':null} />
                              <span className="message-reaction-text">{reaction.amount}</span>
                            </span>
                          ))}
                        </span>
                          <small className="message-time-and-views">
                            <span> <Icon name='fa-eye' size={'small'}/>{msg?.date?.toLocaleString() || 54}</span>
                            <span>{msg?.date?.toLocaleString() || '6:43 pm'}</span>
                          </small>
                      </div>
                    
                  </div>
                
              </li>
            ))}
          </ul>

          {/* Message Input */}
          <form className="message-input" onSubmit={sendMessage}>
            <Input size="large" type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              prefix={<Icon name={"fa-paperclip"} size={"large"} />}
              suffix={
                <span className="suffix">
                  <Icon name={`${ismuted?'fa-microphone-slash ':'fa-duotone fa-light fa-microphone'}`} size={"large"} onClick={toggleMute} />
                  <Icon name={"fa-paper-plane"} size={"large"} />
                </span>}
              className="input-box"
              placeholder="Enter message..." /> 
          </form>
        </div>
    </div>
  );
};

export default Chat;
