import React, { useState } from 'react';
import { Collapse, Avatar, List } from 'antd';
import './Accordion.css'
import getLetterColor from '../../../utils/colors';
import PropTypes from 'prop-types';
import {SuffixBadge} from '../Badge/Badge';
const { Panel } = Collapse;

const Accordion = ({ data, onSelect }) => {
    
    const { color, backgroundColor } = getLetterColor('£');
    const [activeItem, setActiveItem] = useState({categoryId:0, itemId:0}); // Track the active item

    // Handle item click and set the active item
    const handleClick = (categoryid,itemid, item) => {
        
        setActiveItem({categoryId:categoryid, itemId:itemid}); // Set the clicked item as active
        onSelect(item); // Call onSelect with the item
    };
    
    return (
        <Collapse accordion>
            {data.map((d, index) => (
                <Panel
                    header={
                        <div style={{ display: 'flex', justifyContent: 'space-between', cursor:'pointer' }}>
                            <small className='accordion-title'>{d.title}</small>
                            <SuffixBadge overflowCount={1000} count={d.items.length} size={'small'}/>
                        </div>
                        }
                        key={`${index}`}ant-collapse-header
                        className={activeItem.categoryId === d.id ? 'ant-collapse-header-active' : ''}
                    >
                    <List
                        size="small"
                        itemLayout="horizontal"
                        dataSource={d.items}
                        
                        renderItem={(item, index) => (
                        <List.Item
                                key={index}
                                style={{
                                cursor: 'pointer',
                                }}
                                className={activeItem.itemId === item.id ? 'ant-list-item-active' : ''} // Apply 'active' class if this item is selected
                                onClick={() => handleClick(d.id,item.id, { title: item.name|| '', image: item.image || '', members:item.members || [] })} // Set active item on click
                                
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar
                                            src={item.image}
                                            size={22}
                                            className="accordion-item-img"
                                            style={{
                                                backgroundColor: backgroundColor,
                                                color: color,
                                                textTransform: 'uppercase',
                                        }}>
                                            {!item.image ? (item.prefix ? item.prefix : item.name[0]):null}
                                        </Avatar>
                                    }
                                    title={<span className="accordion-item-name">{item.name}</span>}
                                />
                        </List.Item>
                        )}
                    />
                
                </Panel>
            ))}
            
                
        
        </Collapse>
    );
};


Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  suffix: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      image: PropTypes.string,
      prefix: PropTypes.string,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default Accordion;
