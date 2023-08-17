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
      <div className='section data-science'>
        <h2>Data Science</h2>
      </div>
      <div className='logo-grid'>
        <div className='logo-row'>
          <LogoImage logo="/images/logos/scikit-learn.png" name="Scikit-learn"/>
          <LogoImage logo="/images/logos/pandas.png" name="Pandas" />
          <LogoImage logo="/images/logos/numpy.png" name="Numpy" />
        </div>
        <div className='logo-row'>
          <LogoImage logo="/images/logos/tensorflow.png" name="TensorFlow" />
          <LogoImage logo="/images/logos/opencv.png" name="OpenCV" />
          <LogoImage logo="/images/logos/mediaPipe.png" name="MediaPipe" />
        </div>
      </div>

      {/* Game Development Section */}
      <div className='section game-dev'>
        <h2>Game Development</h2>
      </div>
      <div className='logo-grid'>
        <div className='logo-row'>
          <LogoImage logo="/images/logos/Godot.png" name="Godot" />
          <LogoImage logo="/images/logos/P5js.png" name="P5.js" />
          <LogoImage logo="/images/logos/cpp.png" name="C++" />
        </div>
      </div>

      <div className='section'>
        <h2>Miscellaneous</h2>
      </div>
    </div>
  );
};

export default SkillsPage;
