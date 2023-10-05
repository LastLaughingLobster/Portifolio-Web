import React, { FunctionComponent } from 'react';
import './SocialButton.css';

interface SocialButtonProps {
  image: string;
  alt: string;
  url: string;
}

const SocialButton: FunctionComponent<SocialButtonProps> = ({ image, alt, url }) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="social-button-anchor">
      <div className="social-button">
        <img src={image} alt={alt} />
        <span>{alt}</span>
      </div>
    </a>
  );
};

export default SocialButton;
