// TopLandingPage.tsx
import React, { FunctionComponent } from 'react';
import './TopLandingPage.css';
import SocialButton from '../../../components/SocialButton/SocialButton';
import LandingPageBackground from '../../Usefull/Backgrounds/LandingPage/LandingPageBackground';
import CubyBackGround from '../../../components/CubyBackGround/Cuby';
import GridTillesBackground from '../../../components/CubyBackGround/GridTillesBackground';
import RubiksImageGenerator from '../../../components/CubyBackGround/RubiksImageGenerator';
import ProjectCard from '../../../components/ProjectCard/ProjectCard';

const TopLandingPage: FunctionComponent = () => {
  return (
    <>  
      <div className="top-landing-page">
        <div className="empty-section">
         <RubiksImageGenerator imagePath={`${process.env.PUBLIC_URL}/images/Photos/me_white.png`} />
        </div>
        <div className="text-section">
          <div className="text-group">
            <h2>Hi, I am</h2>
            <h1>Henrique Neto</h1>
            <h3>Computer Scientist and Beyond</h3>
          </div>
          <div className="social-buttons">
            <SocialButton image={ process.env.PUBLIC_URL + "/images/logos/twitter.png" } alt="Twitter" url="https://twitter.com/?lang=en" />
            <SocialButton image={ process.env.PUBLIC_URL + "/images/logos/git.png" } alt="GitHub" url="https://github.com" />
            <SocialButton image={ process.env.PUBLIC_URL + "/images/logos/linkedin.png" } alt="LinkedIn" url="https://linkedin.com" />
          </div>
        </div>
      </div>
    </>
  );
};


export default TopLandingPage;
