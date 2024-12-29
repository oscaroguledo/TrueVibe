import React from 'react';
import PropTypes from 'prop-types';  // Import PropTypes to define expected props
import './Icon.css';  // Import any CSS for icon styling

const Icon = ({
  name,            // The name of the icon (FontAwesome class name)
  size = 'medium', // The size of the icon ('small', 'medium', 'large', etc.)
  color = 'primary', // The color of the icon (you can pass CSS classes like 'red', 'blue', etc.)
  className = '',  // Additional custom classes if needed
  onClick ,
  style         // A callback function for the onClick event
}) => {
  return (
    <i
      className={`icon icon-${size} icon-${color} ${className} fa-light ${name} `}
      onClick={onClick} style={style}
    />
  );
};

// Define prop types to ensure that the props are used correctly
Icon.propTypes = {
    name: PropTypes.string.isRequired, // The icon name is required (FontAwesome class name)
    size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large', 'xlarge', '2xl', '3xl']),  // size must be one of these values
    color: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success', 'warning']),  // color must be one of these values
  
    className: PropTypes.string,  // Additional custom classes for styling
    onClick: PropTypes.func, // onClick function (optional)
};

// Default props if no value is provided
Icon.defaultProps = {
  size: 'medium',
  color: 'primary',
  className: '',
  onClick: null,  // Default to no onClick handler
};

export default Icon;
