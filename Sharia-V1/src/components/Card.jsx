// Card.js
import React from 'react';
// import '../styles/card.css'; 

const Card = ({ children, className = "" }) => {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
};

export default Card;