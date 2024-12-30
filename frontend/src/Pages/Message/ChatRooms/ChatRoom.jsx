import React, { useEffect, useState } from "react";
import { Typography} from "antd"; // Importing Ant Design components
import './ChatRoom.css';
import Accordion from "../../../components/ui/Accordion/Accordion";
import {SearchInput} from '../../../components/ui/TextInput/TextInput';
const { Text } = Typography;

const ChatRoom = ({ isMobile, isTablet,updateCurrentChat }) => {
    
    const [currentchat, setCurrentChat] = useState({title:'',image:'',members:[]})
    const [searchQuery, setSearchQuery] = useState('');  // New state for the search query


    //use useeffect to store the current chat in sqlite
    const toggleCurrentChat = (item) => {
        
        setCurrentChat(item);
        updateCurrentChat(item);
    }
    useEffect(() => {
        //   console.log(currentchat,'====');
        }, [currentchat]);

    
    const accordionItems =[
        {id:0,title:'favourites',items:[
                  { id:0,image: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1', name: 'Item Name 1'},
                  { id:1,image: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',name: 'hello'},
                  { id:2,image: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3',name: 'Item Name 3'},
                ]},
        {id:1,title:'Direct Messages',items:[
                  { id:3,image: 'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name: 'Item Name 1'},
                  { id:4,image: 'https://api.dicebear.com/7.x/miniavs/svg?seed=5',name: 'Item Name 2'},
                  { id:5,image: 'https://api.dicebear.com/7.x/miniavs/svg?seed=6', name: 'Item Name 3'},
                  { id:6,image: 'https://api.dicebear.com/7.x/miniavs/svg?seed=7', name: 'Item Name 2'},
                  { id:7,image: 'https://api.dicebear.com/7.x/miniavs/svg?seed=8', name: 'Item Name 3'},
                  { id:8,image: 'https://api.dicebear.com/7.x/miniavs/svg?seed=8', name: 'Item Name 2'},
                  { id:9,image: 'https://api.dicebear.com/7.x/miniavs/svg?seed=10', name: 'Item Name 3' },
        ]},
        {id:2,title:'Channels',items:[
                  { id:10,prefix:'#',image: null, name: 'Item Name 1', members: [{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'}] },
                  { id:11,prefix:'#',image: null, name: 'Item Name 2', members: [{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=5',name:'member2'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'}] },
                  { id:12,prefix:'#',image: null, name: 'Item Name 3', members: [{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=7',name:'member13'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'}] },
                  { id:'13',prefix:'#',image: null, name: 'Item Name 2', members: [{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=8',name:'member14'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'}] },
                  { id:'14',prefix:'#',image: null, name: 'Item Name 3', members: [{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=9',name:'member15'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'}] },
                  { id:'15',prefix:'#',image: null, name: 'Item Name 2', members: [{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=15',name:'member16'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'}] },
                  { id:'16',prefix:'#',image: null, name: 'Item Name 3', members: [{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=14',name:'member17'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'},{img:'https://api.dicebear.com/7.x/miniavs/svg?seed=4',name:'member1'}]},
        ]}
    ]
    // Function to handle real-time search filter
    const filteredItems = accordionItems.map((category) => ({
                                                ...category,
                                                items: category.items.filter((item) =>
                                                    item.id?.toString().includes(searchQuery) ||
                                                    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    category.title?.toLowerCase().includes(searchQuery.toLowerCase())
                                                )
                                            }))
                                        .filter((category) => category.items.length > 0); // Remove category if no matching items
    

    return (
        <div className="messages-channels-section">
            <Text className="messages-channels-section-title">ChatRoom </Text>
            {/* Search Input */}
            <SearchInput
                size="small"
                suffix="fa-magnifying-glass"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}  // Update search query on change
            />
            {/* Accordion Component */}
            <Accordion
                data={filteredItems}  // Pass the filtered items to the Accordion
                onSelect={(item) => toggleCurrentChat(item)}
            />
        </div>

    );
};

export default ChatRoom;
