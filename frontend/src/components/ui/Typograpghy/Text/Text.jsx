import React from 'react';
import PropTypes from 'prop-types';
import './Text.css'; // Optional, if you want to add additional styles

const Text = ({
  children,
  size = 'medium',
  weight = 'normal',
  color = 'black',
  align = 'left',
  className = '',
  style = {},
}) => {
  return (
    <p
      className={`text text-${size} text-${weight} text-${color} text-align-${align} ${className}`}
      style={style}
    >
      {children}
    </p>
  );
};

Text.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  weight: PropTypes.oneOf(['light', 'normal', 'bold']),
  color: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  className: PropTypes.string,
  style: PropTypes.object,
};

Text.defaultProps = {
  size: 'medium',
  weight: 'normal',
  color: 'black',
  align: 'left',
  className: '',
  style: {},
};

export default Text;
