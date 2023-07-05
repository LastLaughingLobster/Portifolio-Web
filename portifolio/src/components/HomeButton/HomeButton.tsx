// HomeButton.tsx
import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import './HomeButton.css';

const HomeButton: FunctionComponent = () => {
  return (
    <Link to="/" className="home-button">
      <img src="/images/logos/home.png" alt="Home" />
    </Link>
  );
};

export default HomeButton;
