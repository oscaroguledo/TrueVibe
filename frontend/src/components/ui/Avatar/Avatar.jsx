import React from 'react';
import PropTypes from 'prop-types';
import './Avatar.css'; // Import the corresponding CSS for styling

const Avatar = ({ src, alt, type, shape, size, border }) => {
  const avatarStyles = {
    width: `${size}px`, // Set the width dynamically
    height: `${size}px`, // Set the height dynamically
    borderRadius: shape === 'circle' ? '50%' : '0%', // Circular or square shape
    border: border ? '2px solid #ccc' : 'none', // Optional border
  };

  const renderContent = () => {
    if (type === 'video') {
      return (
        <video 
          src={src} 
          alt={alt} 
          autoPlay 
          loop 
          muted 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      );
    }
    if (type === 'image') {
      return (
        <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      );
    }
    return <span alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }}> {src}</span>;
  };

  return (
    <div className="avatar-container" style={avatarStyles}>
      {renderContent()}
    </div>
  );
};

// Define the prop types
Avatar.propTypes = {
  src: PropTypes.string.isRequired, // Source URL for image/video
  alt: PropTypes.string, // Alt text for image
  type: PropTypes.oneOf(['image', 'video']).isRequired, // Type of content
  shape: PropTypes.oneOf(['circle', 'square']).isRequired, // Shape of the avatar
  size: PropTypes.number.isRequired, // Size of the avatar
  border: PropTypes.bool, // Optional border around the avatar
};

// Default props if no value is provided
Avatar.defaultProps = {
  alt: 'Avatar', // Default alt text
  border: false, // Default to no border
};

export default Avatar;
