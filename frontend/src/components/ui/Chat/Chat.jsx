import React, { useEffect, useRef, useState } from "react";
import { Avatar,Typography,Drawer,Dropdown, Menu } from "antd";
import "./Chat.css"; // Custom CSS for styling
import Icon from "../Icon/Icon";
import io from "socket.io-client"; // Import socket.io-client for WebSocket connection
import { Input, SearchInput } from "../TextInput/TextInput";
const { Text } = Typography;


const Chat = ({ currentRoom, socket, user,isMobile,color, backgroundColor }) => {
    const socketid = `anon-${socket.id}`;
    const dropdownRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [messageSent, setMessageSent] = useState(false); // Track if a message is sent

    const [input, setInput] = useState("");
    const [searchbarshow, setSearchBarShow] = useState(false);
    const [ismuted, setIsMuted] = useState(false);

    const toggleMute = () => {
      setIsMuted(!ismuted)
    }
    const toggleSearchBar= () => {
      setSearchBarShow(!searchbarshow);
    };
    
    useEffect(() => {
      // This useEffect will run every time a new message is sent
      if (messageSent) {
          // Reset the messageSent flag to prevent it from triggering again
          setMessageSent(false);
          console.log(socket);
          const handleMessage = (msg) => {
              console.log("Message received", msg);
              // You could append the new message here
              // Filter to ensure only unique messages by id
              setMessages((prevMessages) => {
                  // Remove any existing message with the same id (i.e., filter out duplicates)
                  const filteredMessages = prevMessages.filter((message) => message.id !== msg.id);

                  // Add the new message
                  const updatedMessages = [...filteredMessages, msg];

                  // Sort the messages chronologically by the 'date' field (oldest first)
                  updatedMessages.sort((a, b) => new Date(a.date) - new Date(b.date));

                  return updatedMessages;
              });
          };
      
          socket.on("message", handleMessage);
      
          // Cleanup the listener on component unmount
          return () => {
              socket.off("message", handleMessage);
          };
      }
    }, [messageSent, socket]); // Dependency on messageSent


    const sendMessage = (e) => {
       
        // e.preventDefault();
        if (input.trim() === '') return; // Prevent sending empty messages
        const newMessage = {
            id: `${messages.length}`,
            user: `${user.id}`,
            room: currentRoom.name,
            text: `${input}`,
            subroom: `${currentRoom.name}`, //who the message goes to
            date: `${new Date()}`
          };
        
        socket?.emit("message", newMessage);
        // console.log('=====',newMessage)
        
        // Update the message list safely with functional setState
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        setInput(""); // Clear input after sending
        // Set messageSent to true, which will trigger the useEffect hook
        setMessageSent(true);
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
    
    // Scroll to the bottom when new messages are added
    useEffect(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    }, [messages]); // Trigger whenever messages update
  

    return (
      <div className="chat-container">
          {/* Chat Header */}
          <div className="chat-header">
              <div className="chat-title">
                  <Avatar src={currentRoom.image} children={!currentRoom.image?'#':null} alt={currentRoom.name} size={42} shape="square" />
                  <Text className="chat-title-name">{currentRoom.name}</Text>
                  <div className="chat-title-users">
                    {currentRoom.members?
                      <>
                        <span className="chat-title-users-images">
                            {currentRoom.members?.slice(0,2).map((member, index)=>(
                              <Avatar 
                                  key={index} 
                                  src={member.img || '#'} 
                                  alt={currentRoom.title} 
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
                            <span>{currentRoom?.members?.length||0} members</span>
                              {currentRoom?.members?.length > 0 ?
                                <>
                                  <span className="chat-title-users-members-online">{currentRoom?.membersOnline || 0} Online</span>
                                  <span className="chat-title-users-members-offline">{(currentRoom?.members?.length||0 )- (currentRoom?.membersOnline || 0)} offline</span>
                                </> 
                              :
                              <></>}
                            
                        </small>
                      </>
                      :
                      <div>{currentRoom.online?<small className="chat-online">online</small>:
                        <small className="chat-offline">offline</small>}</div>}
                  </div>
                  
              </div>
              

              <div className="chat-title-suffix">
                {!isMobile ?<><Icon name='fa-video'/> 
                <Icon name='fa-phone'/> 
                <Icon name='fa-magnifying-glass' onClick={toggleSearchBar}/> </>:<></>}
                
                
                <Dropdown
                    ref={dropdownRef}  // Direct ref handling
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
            <ul className="messages-list" 
                  ref={listRef} 
                  onWheel={handleWheel} 
                  onMouseDown={handleMouseDown}
                  >
              
                  {messages.map((msg, index) => (
                    <li key={index} className={`message-item ${msg.user === user.id ? "message-item-me" : "message-item-other"}`}>
                        {msg.user === user.id?
                        <>
                            <div className={`message-details ${msg.user === user.id ? "message-details-me" : "message-details-other"}`}>
                                {/* <div className="message-header">
                                  <p className="user-name">{msg.user.name }</p>
                                </div> */}
                                <div className="message-body">
                                    <span>{msg.text || 'i added new flows to our design system. Now you can use them for yur projects'}</span>
                                </div>
                                <div className="message-footer">
                                  <span className="message-reactions">
                                  {msg.reactions?.map((reaction, index) => (
                                      <span key={index} className={`message-reaction `}>
                                        
                                        <Avatar className="message-reaction-img" shape="circle" size={30} src={reaction.image} children={reaction.image} />
                                        <span className="message-reaction-text">{reaction.amount}</span>
                                      </span>
                                    ))}
                                  </span>
                                    <small className="message-time-and-views">
                                      <span> <Icon name='fa-eye' size={'small'}/>{54}</span>
                                      <span>{'6:43 pm'}</span>
                                    </small>
                                </div>
                              
                            </div>
                            <Avatar
                              src={msg.user?.userImage || <Icon name='fa-user'/>}
                              size={36}
                              shape='square'
                              className="message-item-img"
                              style={{
                                  backgroundColor: backgroundColor,
                                  color: color,
                                  textTransform: 'uppercase',
                                  
                              }} />
                        </>
                        :
                        <>
                          <Avatar
                            src={msg.user?.userImage || <Icon name='fa-user'/>}
                            size={36}
                            shape='square'
                            className="message-item-img"
                            style={{
                                backgroundColor: backgroundColor,
                                color: color,
                                textTransform: 'uppercase',
                                
                            }} />
                          <div className={`message-details ${msg.user === user.id ? "message-details-me" : "message-details-other"}`}>
                              <div className="message-header">
                                <p className="user-name">{`${user.firstname} ${user.lastname}`}</p>
                                
                              </div>
                              <div className="message-body">
                                  <span>{msg.text || 'i added new flows to our design system. Now you can use them for yur projects'}</span>
                              </div>
                              <div className="message-footer">
                                <span className="message-reactions">
                                {msg.reactions?.map((reaction, index) => (
                                    <span key={index} className={`message-reaction `}>
                                      
                                      <Avatar className="message-reaction-img" shape="circle" size={30} src={reaction.image} children={reaction.image} />
                                      <span className="message-reaction-text">{reaction.amount}</span>
                                    </span>
                                  ))}
                                </span>
                                  <small className="message-time-and-views">
                                    <span> <Icon name='fa-eye' size={'small'}/>{54}</span>
                                    <span>{'6:43 pm'}</span>
                                  </small>
                              </div>
                            
                          </div>
                        </>
                        }
                        
                      
                    </li>
                  ))}
            </ul>

            {/* Message Input */}
            <div className="message-input">
              <Input size="large" type="text" value={input}

                onPressEnter= {sendMessage}
                onChange={(e) => setInput(e.target.value)}
                prefix={<Icon name={"fa-paperclip"} size={"large"} />}
                suffix={
                  <span className="suffix">
                    <Icon name={`${ismuted?'fa-microphone-slash ':'fa-duotone fa-light fa-microphone'}`} size={"large"} onClick={toggleMute} />
                    <Icon name={"fa-paper-plane"} size={"large"} onClick={sendMessage} />
                  </span>}
                className="input-box"
                placeholder="Enter message..." /> 
            </div>
          </div>
      </div>
    );
};

export default Chat;
