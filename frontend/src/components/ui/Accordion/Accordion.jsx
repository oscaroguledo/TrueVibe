import React, { useState } from 'react';
import { Collapse, Avatar, List } from 'antd';
import './Accordion.css'
import getLetterColor from '../../../utils/colors';
import PropTypes from 'prop-types';
import {Badge, SuffixBadge} from '../Badge/Badge';
import Icon from '../Icon/Icon';
const { Panel } = Collapse;

const Accordion = ({ data,activeItem:active, onSelect }) => {
    
    const { color, backgroundColor } = getLetterColor('£');
    const [activeItem, setActiveItem] = useState(active); // Track the active item

    // Handle item click and set the active item
    const handleClick = (categoryid,item) => {
        setActiveItem({categoryId:categoryid, itemId:item.id}); // Set the clicked item as active
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
                                onClick={() => handleClick(d.id,item)} // Set active item on click
                                
                            >
                                <List.Item.Meta
                                    avatar={
                                        (item.prefix === '#')?
                                            <Avatar
                                                src={item.image}
                                                size={36}
                                                shape='square'
                                                className="accordion-item-img"
                                                style={{
                                                    backgroundColor: backgroundColor,
                                                    color: color,
                                                    textTransform: 'uppercase',
                                                }}>
                                                {!item.image ? (item.prefix ? item.prefix : item.name[0]):null}
                                            </Avatar>
                                            :
                                            <Badge dot={true} color={`${item.online?'green':'red'}`}>
                                                <Avatar
                                                    src={item.image || <Icon name='fa-user'/>}
                                                    size={36}
                                                    shape='square'
                                                    className="accordion-item-img"
                                                    style={{
                                                        backgroundColor: backgroundColor,
                                                        color: color,
                                                        textTransform: 'uppercase',
                                                    }}>
                                                    {!item.image ? (item.prefix ? item.prefix : item.name[0]):null}
                                                </Avatar>
                                            </Badge>
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
