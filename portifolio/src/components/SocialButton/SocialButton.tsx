// SocialButton.tsx
import React, { FunctionComponent } from 'react';
import './SocialButton.css';

interface SocialButtonProps {
  image: string;
  alt: string;
  url: string;
}

const SocialButton: FunctionComponent<SocialButtonProps> = ({ image, alt, url }) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <button className="social-button">
        <img src={image} alt={alt} />
      </button>
    </a>
  );
};

export default SocialButton;
