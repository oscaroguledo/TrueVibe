import React from 'react';
import PropTypes from 'prop-types';
import './Title.css'; // Optional, if you want to add additional styles

const Title = ({
  children,
  level = 1,
  weight = 'bold',
  color = 'black',
  align = 'left',
  className = '',
  style = {},
}) => {
  const Tag = `h${level}`; // Dynamically set the heading level (h1, h2, h3, etc.)

  return (
    <Tag
      className={`title title-${weight} title-${color} title-align-${align} ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
};

Title.propTypes = {
  children: PropTypes.node.isRequired,
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  weight: PropTypes.oneOf(['normal', 'bold']),
  color: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  className: PropTypes.string,
  style: PropTypes.object,
};

Title.defaultProps = {
  level: 1,
  weight: 'bold',
  color: 'black',
  align: 'left',
  className: '',
  style: {},
};

export default Title;
