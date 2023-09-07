import React from 'react';
import { RubiksCube } from './RubiksCube/RubiksCube';
import './SkillsPage.css';
import Sketch from 'react-p5';
import ThreeCube from '../../components/Cube/ThreeCube';

const SkillsPage = () => {

  return (
    <div className='skills-page'>
      <div className="content-container">
        <ThreeCube/>
        {/* <div className="text-section-skills">
          <h1>TextHere</h1>
        </div>
        <div className="p5-canvas">
          <ThreeCube/>
        </div> */}
      </div>
    </div>
  );
};

export default SkillsPage;
