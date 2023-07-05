// TopLandingPage.tsx
import React, { FunctionComponent } from 'react';
import './TopLandingPage.css';
import SocialButton from '../../../components/SocialButton/SocialButton';

const TopLandingPage: FunctionComponent = () => {
    return (
        <div className="top-landing-page">
          <div className="text-section">
            <div className="text-group">
              <h2>Hi, I am</h2>
              <h1>Henrique Neto</h1>
              <h3>Computer Scientist and Beyond</h3>
            </div>
            <div className="social-buttons">
              <SocialButton image="/images/logos/twitter.png" alt="Twitter" url="https://twitter.com/?lang=en" />
              <SocialButton image="/images/logos/git.png" alt="GitHub" url="https://github.com" />
              <SocialButton image="/images/logos/linkedin.png" alt="LinkedIn" url="https://linkedin.com" />
            </div>
          </div>
          <div className="empty-section">
            <img src="/images/Photos/me.png" alt="Your Name" />
          </div>
        </div>
      );
};

export default TopLandingPage;
