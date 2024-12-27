import React, { useState } from "react";
import "./SideBar.css"; // Import the Sidebar's CSS file
import Icon from '../Icon/Icon';
import Button from "../Button/Button";
import Avatar from "../Avatar/Avatar";
import Text from "../Typograpghy/Text/Text";


// Sidebar component
const Sidebar = ({ rooms, currentRoom, onEnterRoom, props }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="sidebarcontainer">
      <i
      onClick={() => setSidebarOpen(!sidebarOpen)} 
      className={`fa-thin fa-xmark close-btn ${sidebarOpen ? "close-btn-open" : ""}`}
    />
    <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
      <div className='sidebar-header'>
            <span style={{display:'flex', flex:'row',justifyContent:'space-around', alignItems:'center'}}>
                    <Avatar 
                    src={null} 
                    alt="Profile Picture" 
                    type="image" 
                    shape="circle" 
                    size={60} 
                    border={true} 
                  />
                
                {sidebarOpen?<span className="sidebar-footer-name" >
                <Text>Rooms</Text>
            </span>:null}</span>
      </div>
      <div className="room-list">
        {rooms.map((room,index) => (
          
          <div className={`room-item ${currentRoom.text === room.text? "active" : ""}`} onClick={() => onEnterRoom(room)} >
            {sidebarOpen?<Button 
              key={index}
              icon={room.icon}
              color=""
              
              text={room.text}
              />
              :
              <Icon 
                key={room}
                name={room.icon} color=""
                />}
          </div>
        ))}
      </div>
      <div className={`sidebar-footer ${sidebarOpen ? "sidebar-footer-open" : ""}`} >
          {!props?.isloggedin?<span style={{display:'flex', flex:'row',justifyContent:'space-around', alignItems:'center'}}>
                    <Avatar 
                    src={null}
                    alt="Profile Picture" 
                    type="image" 
                    shape="circle" 
                    size={45} 
                    border={true} 
                  />
                
                {sidebarOpen?<span className="sidebar-footer-name" >
                  <span style={{color:'black'}}>Rooms</span>
                </span>:null}</span>
          :
            <span >
                {sidebarOpen?
                  <Button type="submit" icon="fa-right-to-bracket"  text={'Login'} style={{width:'100%'}} />
                    :
                    <Button type="submit" icon="fa-right-to-bracket"   style={{width:'100%'}} />
                }
            </span>
          }
      </div>
    </div></div>
    
  );
};

export default Sidebar;
