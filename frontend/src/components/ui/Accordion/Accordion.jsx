import React from 'react';
import { Collapse, Avatar } from 'antd';


const { Panel } = Collapse;

const Accordion = ({ title, suffix, items }) => {
  return (
    <Collapse accordion>
      <Panel
        header={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{title}</span>
            <span>{suffix}</span>
          </div>
        }
        key="1"
      >
        <div>
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '5px 0',
                borderBottom: '1px solid #eaeaea',
              }}
            >
              <Avatar style={{ backgroundColor: '#2a9d8f', marginRight: '10px' }}>
                {item.prefix}
              </Avatar>
              <span style={{ flex: 1, textAlign: 'center' }}>{item.name}</span>
              <span style={{ color: '#e76f51' }}>{item.suffix}</span>
            </div>
          ))}
        </div>
      </Panel>
    </Collapse>
  );
};

export default Accordion;
