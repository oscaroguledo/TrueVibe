import React, { useState } from "react";
import { Layout, Menu, Avatar, Typography,Dropdown } from "antd"; // Importing Ant Design components
import { LogoutOutlined } from '@ant-design/icons'; // Importing Ant Design icons
import "./SideBar.css"; // Import your custom CSS
import Sider from "antd/es/layout/Sider";
import Icon from "../Icon/Icon";
import getLetterColor from '../../../utils/colors';
import Button from "../Button/Button";
const { Text } = Typography;

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
        1st menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
        2nd menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        3rd menu item
      </a>
    </Menu.Item>
  </Menu>
);

const Sidebar = ({ rooms, currentRoom, onEnterRoom, ...props }) => {
  console.log(props,'===')
  const { color, backgroundColor } = getLetterColor(props.user.firstname[0]||props.user.name[0]||'O');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentmenuitem, setCurrentMenuItem] = useState(currentRoom?.text || rooms[0].text);
  const [modalVisible, setModalVisible] = useState(false);

  // Define the Menu for the Dropdown
  const menuItems = (
    <Menu>
      <Menu.Item key="1">Item 1</Menu.Item>
      <Menu.Item key="2">Item 2</Menu.Item>
      <Menu.Item key="3">Item 3</Menu.Item>
    </Menu>
  );

  const clickMenuItem =(key) =>{
    onEnterRoom(rooms.find(room => room.text === key));
    setCurrentMenuItem(key);
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={sidebarOpen ? 250 : 78} // Conditional width based on sidebarOpen
        className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}
        // collapsible
        collapsed={!sidebarOpen}
        onCollapse={() => setSidebarOpen(!sidebarOpen)}
        
        theme="light"
      >
        
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Avatar 
              src="" 
              alt="Profile Picture" 
              shape="circle" 
              size={50} 
              style={{ marginRight: 10 }}
            />
            <Text className={`sidebar-header-name ${!sidebarOpen?'sidebar-header-name-hidden':''}`} strong
            >Rooms</Text>
          </div>
        </div>

        {/* Rooms List */}
        <Menu
          // mode="inline"
          selectedKeys={[currentRoom.text]}
          onClick={({ key }) => clickMenuItem(key)}
          style={{ paddingTop: 20 }}
          className="room-list"
        >
          {rooms.map((room, index) => (
            <Menu.Item 
              key={room.text} 
              icon={<Icon name={room.icon}/>}
              className={`room-item ${currentmenuitem === room.text ? 'room-item-active' : ''}`}
            >
              <Text className={`room-item-name ${!sidebarOpen?'room-item-name-hidden':''}`} strong
                >{room.text}</Text>
                
            </Menu.Item>
          ))}
        </Menu>
        
        
        
        <div className="sidebar-bottom" style={{ display: 'flex', justifyContent: 'space-between', flexDirection:'column'}}>
          <div className="sidebar-close-menu">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width:'100%'}}>
                  <Button icon={!sidebarOpen?'fa-bars':'fa-xmark'} border={'none'} onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <Text className={`sidebar-close-menu-name ${!sidebarOpen?'sidebar-close-menu-name-hidden':''}`} strong
                      >elele</Text>
                    </Button>
              </div>
          </div>
          {/* Sidebar Footer */}
          <div className="sidebar-footer">
            {!props?.user.isloggedin ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Avatar 
                    src="o" 
                    size={50} 
                    alt="oscar oguledo" shape="circle" 
                    className="sidebar-footer-img"
                    style={{ color: color, backgroundColor: backgroundColor}} children={'O'} 
                />
                <Text className={`sidebar-footer-name ${!sidebarOpen?'sidebar-footer-name-hidden':''}`} strong
                  >oscar oguledo 
                    <Icon name='fa-ellipsis-vertical' style={{marginLeft:'50px'}}/>
                  </Text>
                  
                
              </div>
            ) : (
              <Button 
                type="primary"
                icon={<LogoutOutlined />} 
                style={{ width: '100%' }}
                onClick={() => {/* Handle logout */}}
              >
                  <Text className={`sidebar-footer-name ${!sidebarOpen?'sidebar-footer-name-hidden':'' }`}>Logout</Text>{/* Show "Logout" when sidebar is open */}
              </Button>
            )}
          </div>
        </div>
      </Sider>
    </Layout>
  );
};

export default Sidebar;
