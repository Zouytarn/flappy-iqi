import React from 'react';

export const OBSTACLE_WIDTH = 50;

function Pipe({ top, height, left, isTop }) {
  return (
    <div 
      className={`pipe ${isTop ? 'pipe-inverted' : ''}`}
      style={{
        top,
        height,
        left,
        width: OBSTACLE_WIDTH,
      }}
    >
      <div className="pipe-head" />
      <div className="pipe-body" />
    </div>
  );
}

export default Pipe; 