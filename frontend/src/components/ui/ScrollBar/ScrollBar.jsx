import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Upload} from 'antd';  // Import necessary Ant Design components
import './ScrollBar.css';
import Button from '../Button/Button';

const ScrollBar = ({ items, itemsshape='square', size='medium', itemsslicestart = 0, itemssliceend=4, axis = 'vertical', children, shorter }) => {
  const row = items.slice(itemsslicestart, itemssliceend); // Slice the items according to the given number

  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    if (axis === 'horizontal') {
      setStartX(e.clientX);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
    } else {
      setStartY(e.clientY);
      setScrollTop(scrollContainerRef.current.scrollTop);
    }
    scrollContainerRef.current.style.cursor = 'grabbing'; // Change cursor on drag start
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
  
    const deltaX = axis === 'horizontal' ? e.clientX - startX : 0;
    const deltaY = axis === 'vertical' ? e.clientY - startY : 0;
  
    if (axis === 'horizontal') {
      scrollContainerRef.current.scrollLeft = scrollLeft - deltaX;
    } else {
      scrollContainerRef.current.scrollTop = scrollTop - deltaY;
    }
  };
  

  const handleMouseUp = () => {
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = 'grab'; // Reset cursor when dragging stops
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      scrollContainerRef.current.style.cursor = 'grab'; // Reset cursor on mouse leave
    }
  };

  return (
    <div
        ref={scrollContainerRef}
        className={`scrollbar-scrollable-bar scrollbar-scrollable-bar-${axis === 'horizontal' ? 'horizontal' : 'vertical'} scrollbar-scrollable-bar-${shorter ? 'shorter' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
            height: axis === 'vertical' ? '100%' : 'auto', // Set height for vertical scroll
            overflow: axis === 'horizontal' ? 'auto' : 'hidden', // Enable scrolling
        }}
        >
        <div className="scrollbar-scrollable-row">
            {/* Render custom children if provided */}
            {
              children.map((child, index) =>(
                <div key={`row-${index}`} className={`scrollbar-scroll-item scrollbar-scroll-item-${size} scrollbar-scroll-item-${itemsshape === 'circle' ?  'circle' : "square"}  p-1 `}>
                  {child}                
                </div>
              ))
            }
        </div>
    </div>

  );
};

// Prop Validation
ScrollBar.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object), // Array of objects for items
    itemsslicestart: PropTypes.number,
    itemssliceend: PropTypes.number,
    itemsshape: PropTypes.oneOf(['circle', 'square']),
    axis: PropTypes.oneOf(['horizontal', 'vertical']),
    children: PropTypes.node, // Any renderable React node (element, string, etc.)
    shorter: PropTypes.bool,
    size: PropTypes.oneOf(['small','medium-small','medium', 'large']),
};


export default ScrollBar;
