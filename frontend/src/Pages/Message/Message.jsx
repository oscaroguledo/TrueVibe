import React, { useEffect, useRef, useState } from "react";

import './Message.css';
import Chat from "../../components/ui/Chat/Chat";
import ChatRoom from "./ChatRooms/ChatRoom";
import getLetterColor from "../../utils/colors";
const Message = ({socket, isMobile, isTablet,user }) => {
    const { color, backgroundColor } = getLetterColor('£');

    const accordionItems =  [
      {id:0,title:'favourites',items:[
                { id:0,image: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1', name: 'Item Name 1', online:true},
                { id:1,image: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',name: 'hello', online:true},
                { id:2,image: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3',name: 'Item Name 3', online:false},
              ]},
      {id:1,title:'Direct Messages',items:[
                { id:3,image: 'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name: 'Item Name 1', online:true},
                { id:4,image: 'https://api.dicebear.com/7.x/miniavs/svg?seed=5',name: 'Item Name 2', online:true},
                { id:5,image: 'https://api.dicebear.com/7.x/miniavs/svg?seed=6', name: 'Item Name 3', online:false},
                { id:6,image: 'https://api.dicebear.com/7.x/miniavs/svg?seed=7', name: 'Item Name 2', online:true},
                { id:7,image: 'https://api.dicebear.com/7.x/miniavs/svg?seed=8', name: 'Item Name 3', online:false},
                { id:8,image: 'https://api.dicebear.com/7.x/miniavs/svg?seed=8', name: 'Item Name 2', online:false},
                { id:9,image: 'https://api.dicebear.com/7.x/miniavs/svg?seed=10', name: 'Item Name 3', online:false },
      ]},
      {id:2,title:'Channels',items:[
                { id:10,prefix:'#',image: null, name: 'Item Name 1',membersOnline:2, members: [{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'}] },
                { id:11,prefix:'#',image: null, name: 'Item Name 2', membersOnline:2, members: [{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=5',name:'member2'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'}] },
                { id:12,prefix:'#',image: null, name: 'Item Name 3', membersOnline:2, members: [{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=7',name:'member13'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'}] },
                { id:'13',prefix:'#',image: null, name: 'Item Name 2', membersOnline:2, members: [{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=8',name:'member14'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'}] },
                { id:'14',prefix:'#',image: null, name: 'Item Name 3', membersOnline:2, members: [{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=9',name:'member15'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'}] },
                { id:'15',prefix:'#',image: null, name: 'Item Name 2', membersOnline:2, members: [{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=15',name:'member16'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'}] },
                { id:'16',prefix:'#',image: null, name: 'Item Name 3', membersOnline:2, members: [{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=14',name:'member17'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'}]},
      ]}
    ]
    const activeItem = {categoryId:accordionItems[1].id, itemId:accordionItems[1].items[0].id}
    
    //use useeffect to store the current chat in sqlite
    const [currentRoom, setCurrentRoom] = useState(accordionItems[1].items[0])

    const toggleRoom = (room) => {
      console.log(socket,'===')
        console.log("joining room", room.name);
        socket?.emit("join", room.name);
        setCurrentRoom(room);

        socket.on("join-message", (msg) => {
            console.log("Message received", msg);
          
        });
    }
    
    return (
      <div className="message-container">
          <ChatRoom accordionItems={accordionItems} activeItem={activeItem}  isMobile={isMobile} isTablet={isTablet} updateCurrentRoom={(item) => toggleRoom(item)} />
          <Chat currentRoom ={currentRoom} socket={socket} user={user} isMobile={isMobile} color={color} backgroundColor={backgroundColor} />
      </div>

    );
};

export default Message;
