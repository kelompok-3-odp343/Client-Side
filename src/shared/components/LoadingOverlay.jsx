import React from 'react';
import '../styles/components/loading-overlay.css';

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <div className="flex flex-col items-center gap-3">
        <div className="spinner"></div>
        <span className="text-white font-semibold tracking-wider text-sm">Loading...</span>
      </div>
    </div>
  );
};
export default LoadingOverlay;