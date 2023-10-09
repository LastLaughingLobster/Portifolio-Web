// LandingPage.tsx
import React, { FunctionComponent } from 'react';
import './LandingPage.css';
import TopLandingPage from './TopLandingPage/TopLandingPage';

const LandingPage: FunctionComponent = () => {
  return (
    <div className='landing-page-container'>
      <TopLandingPage />
    </div>
  );
};

export default LandingPage;