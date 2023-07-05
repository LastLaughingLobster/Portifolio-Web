// LogoImage.tsx
import React, { FunctionComponent } from 'react';
import './LogoImage.css';

interface LogoImageProps {
  logo: string;
  name: string;
}

const LogoImage: FunctionComponent<LogoImageProps> = ({ logo, name }) => {
  return (
    <div className="logo-image">
      <div className="image-wrapper">
        <img src={logo} alt={name} />
      </div>
      <p>{name}</p>
    </div>
  );
};

export default LogoImage;
