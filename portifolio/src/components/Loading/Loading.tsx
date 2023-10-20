// LoadingAnimation.tsx
import React, { useState, useEffect } from 'react';
import CubeFace from './CubeFace';
import './Loading.css';

const cubeColors = ['red', 'green', 'blue', 'orange', 'white'];

// Generate random face configuration
const getRandomFaceConfiguration = (): string[] => {
  let faceConfiguration = [];
  for (let i = 0; i < 9; i++) {
    faceConfiguration.push(cubeColors[Math.floor(Math.random() * cubeColors.length)]);
  }
  return faceConfiguration;
};

// Generate an array of random face configurations
const generateFaceColors = (numFaces: number): string[][] => {
  let configurations = [];
  for (let i = 0; i < numFaces; i++) {
    configurations.push(getRandomFaceConfiguration());
  }
  return configurations;
};

const faceColors = generateFaceColors(6); 

const LoadingAnimation: React.FC = () => {
  const [currentFace, setCurrentFace] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFace((prev) => (prev + 1) % faceColors.length);
    }, 800); // Change face every second

    return () => clearInterval(interval);
  }, []);

  return <div>
    <CubeFace colors={faceColors[currentFace]} />
  </div>;
};

export default LoadingAnimation;
