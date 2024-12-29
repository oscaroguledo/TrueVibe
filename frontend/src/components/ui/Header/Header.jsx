import React from "react";
import './Header.css'; // Make sure to style it if needed

const Header = ({ title, middleItems, rightSuffix }) => {
  return (
    <header className="header-container">
      {/* Left Title */}
      <div className="header-title">
        <h1>{title}</h1>
      </div>

      {/* Middle Items */}
      <div className="header-middle-items">
        {middleItems.map((item, index) => (
          <span key={index} className="middle-item">{item}</span>
        ))}
      </div>

      {/* Right Suffix */}
      <div className="header-right-suffix">
        {rightSuffix}
      </div>
    </header>
  );
};

export default Header;
