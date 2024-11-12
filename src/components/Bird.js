import React from 'react';

export const BIRD_HEIGHT = 40;
export const BIRD_WIDTH = 40;

function Bird({ size, top }) {
  return (
    <div className="bird-container" style={{ top, left: '20%' }}>
      <div className="bird">
        <div className="wing"></div>
        <div className="beak"></div>
        <div className="eye"></div>
      </div>
    </div>
  );
}

export default Bird; 