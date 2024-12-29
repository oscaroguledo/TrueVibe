import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for validation
import { Menu } from 'antd'; // We will use Ant Design's Menu component to build the sidebar items
import Icon from '../Icon/Icon';  // Assuming you have a custom Icon component for icons

const SidebarItem = ({
  icon,
  text,
  type,
  border,
  onClick,
  ...props
}) => {
  const menuItemStyle = {
    border: border || '1px solid #d9d9d9', // Default border if not provided
    display: 'flex',
    alignItems: 'center', // Align icon and text vertically
    padding: '10px 20px',
  };

  return (
    <Menu.Item
      onClick={onClick}
      style={menuItemStyle}
      {...props}
    >
      {icon && <Icon name={icon} style={{ marginRight: '8px' }} />} {/* Render icon if provided */}
      {text && text} {/* Render text only if `text` is passed */}
    </Menu.Item>
  );
};

// Define PropTypes for validation
SidebarItem.propTypes = {
  icon: PropTypes.string,         // Expecting icon name as a string
  text: PropTypes.string,          // Text for the item
  type: PropTypes.oneOf(['default', 'primary', 'ghost', 'dashed', 'link']),  // Button type
  border: PropTypes.string,       // Custom border style
  onClick: PropTypes.func,         // onClick event handler
};

SidebarItem.defaultProps = {
  icon: null,
  text: '',           // Default text is empty if not provided
  type: 'default',    // Default button type
  border: '1px solid #d9d9d9', // Default border style
  onClick: () => {},   // Default onClick as an empty function
};

export default SidebarItem;
