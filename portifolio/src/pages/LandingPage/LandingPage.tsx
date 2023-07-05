// LandingPage.tsx
import React, { FunctionComponent } from 'react';
import './LandingPage.css';
import TopLandingPage from './TopLandingPage/TopLandingPage';
import BottonLandingPage from './BottonLandingPage/BottonLandingPage';

const LandingPage: FunctionComponent = () => {
  return (
    <div className='landing-page-container'>
      <TopLandingPage />
      <BottonLandingPage/>
    </div>
  );
};

export default LandingPage;