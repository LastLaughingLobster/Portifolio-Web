// CubeFace.tsx
import React from 'react';
import './CubeFace.css';

interface CubeFaceProps {
  colors: string[];
}

const CubeFace: React.FC<CubeFaceProps> = ({ colors }) => {
  return (
    <div className="cube-face">
      {colors.map((color, index) => (
        <div key={index} className={`cube-square ${color}`}></div>
      ))}
    </div>
  );
};

export default CubeFace;
