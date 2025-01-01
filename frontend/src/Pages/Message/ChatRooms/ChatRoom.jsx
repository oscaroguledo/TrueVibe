import React, { useEffect, useState } from "react";
import { Typography} from "antd"; // Importing Ant Design components
import './ChatRoom.css';
import Accordion from "../../../components/ui/Accordion/Accordion";
import {SearchInput} from '../../../components/ui/TextInput/TextInput';
import Icon from "../../../components/ui/Icon/Icon";
const { Text } = Typography;

const ChatRoom = ({ accordionItems,activeItem,isMobile, isTablet,updateCurrentChat }) => {
    
    const [currentchat, setCurrentChat] = useState({name:'',image:'',members:[]})
    const [searchQuery, setSearchQuery] = useState('');  // New state for the search query


    //use useeffect to store the current chat in sqlite
    const toggleCurrentChat = (item) => {
        setCurrentChat(item);
        updateCurrentChat(item);
    }
    useEffect(() => {
        //   console.log(currentchat,'====');
        }, [currentchat]);

    
    
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
                size="large"
                prefix={<Icon name={"fa-magnifying-glass"} size={"large"} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}  // Update search query on change
            />
            {/* Accordion Component */}
            <Accordion
                data={filteredItems}  // Pass the filtered items to the Accordion
                activeItem = {activeItem}
                onSelect={(item) => toggleCurrentChat(item)}
            />
        </div>

    );
};

export default ChatRoom;
