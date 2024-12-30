import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for validation
import { Button as CustomButton } from 'antd';
import Icon from '../Icon/Icon';  // Assuming you have a custom Icon component for icons
import './Button.css';
const Button = ({
  icon,
  text,
  type,
  variant,
  border,
  onClick,
  children,
  ...props
}) => {
  const buttonStyle = {
    border: border, // Default border if not provided
  };
  const className = `${props.className} ant-btn-${variant}`

  return (
    <CustomButton
      type={type} // Default button type
      variant={variant}
      onClick={onClick}
      style={buttonStyle}
      className={className }
      icon={icon ? <Icon name={icon} /> : null} // Render icon if `icon` prop is provided
      {...props}
    >
      {children?children:<>{text && text}</>}
    </CustomButton>
  );
};

// Define PropTypes for validation
Button.propTypes = {
  icon: PropTypes.string,         // Expecting icon name as a string
  text: PropTypes.string,          // Text for the button
  variant : PropTypes.oneOf(['filled', 'outlined']),  // Button type
  border: PropTypes.string,       // Custom border style
  onClick: PropTypes.func,         // onClick event handler
};

Button.defaultProps = {
  icon: null,
  text: '',           // Default text is empty if not provided
  variant:'outlined',
  onClick: () => {},   // Default onClick as an empty function
};

export default Button;
