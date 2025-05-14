import React from 'react';
import './LoadingIndicator.css';

const LoadingIndicator = () => {
  return (
    <div className="loading-indicator">
      <div className="dot-pulse">
        <div className="dot-pulse__dot"></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;