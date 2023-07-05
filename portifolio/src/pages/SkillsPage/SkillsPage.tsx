// SkillsPage.tsx
import React from 'react';
import LogoImage from '../../components/LogoImage/LogoImage';
import './SkillsPage.css';

const SkillsPage = () => {
  return (
    <div className='skills-page'>
      <div className='section front-end'>
        <h2>Front End</h2>
      </div>
      <div className='logo-grid'>
        <div className='logo-row'>
          <LogoImage logo="/images/logos/js.png" name="JavaScript" />
          <LogoImage logo="/images/logos/css.png" name="CSS" />
          <LogoImage logo="/images/logos/html.png" name="HTML" />
        </div>
        <div className='logo-row'>
          <LogoImage logo="/images/logos/react.png" name="React" />
          <LogoImage logo="/images/logos/angular.png" name="Angular" />
          <LogoImage logo="/images/logos/ts.png" name="TypeScript" />
        </div>
      </div>
      <div className='section'>
        <h2>Back End</h2>
        {/* Add your images and paragraphs here */}
      </div>
      <div className='logo-grid'>
        <div className='logo-row'>
          <LogoImage logo="/images/logos/csharp.png" name="C#" />
          <LogoImage logo="/images/logos/net.png" name=".NET" />
          <LogoImage logo="/images/logos/rabbit.png" name="RabbitMQ" />
        </div>
        <div className='logo-row'>
          <LogoImage logo="/images/logos/python.png" name="Python" />
          <LogoImage logo="/images/logos/fastapi.png" name="Fast API" />
          <LogoImage logo="/images/logos/springBoot.png" name="Spring Boot" />
        </div>
      </div>
      <div className='section'>
        <h2>Miscellaneous</h2>
        {/* Add your images and paragraphs here */}
      </div>
    </div>
  );
};

export default SkillsPage;
