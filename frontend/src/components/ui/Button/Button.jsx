import PropTypes from 'prop-types';  // Import PropTypes
import './Button.css';

const Button = ({ 
  type = 'button', 
  icon, 
  text, 
  iconPosition = 'left', 
  onClick, 
  disabled = false, 
  size = 'medium', 
  color = 'primary' ,
  className,
  style
}) => {
  return (
    <button 
      type={type} 
      className={`btn btn-${size} btn-${color} btn-${disabled ? 'disabled' : ''} ${className}`} 
      onClick={onClick} 
      disabled={disabled}
      style={style}
    >
      {icon && iconPosition === 'left' && (
        <span className="btn-icon-left">
          <i className={`fa-light ${icon}`}></i>
        </span>
      )}
      {text && <span className="btn-text">{text}</span>}
      {icon && iconPosition === 'right' && (
        <span className="btn-icon-right">
          <i className={`fa-thin ${icon}`}></i>
        </span>
      )}
    </button>
  );
};

// Define prop types
Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset']),  // Ensuring valid values for the 'type' prop
  icon: PropTypes.string,  // icon is a string (class name for FontAwesome icon)
  text: PropTypes.string,  // text is a string
  className: PropTypes.string,
  iconPosition: PropTypes.oneOf(['left', 'right']),  // iconPosition can either be 'left' or 'right'
  onClick: PropTypes.func.isRequired,  // onClick should be a function (required)
  disabled: PropTypes.bool,  // disabled is a boolean
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large', 'xlarge', '2xl', '3xl']),  // size must be one of these values
  color: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success', 'warning','']),  // color must be one of these values
};

// Default props if no value is provided
Button.defaultProps = {
  iconPosition: 'left',
  disabled: false,
  size: 'medium',
  color: 'primary',
  type: 'button',  // Default to 'button' for the type prop
};

export default Button;
