import React, { useState } from 'react';
import ThreeCube from '../../components/Cube/ThreeCube';
import './SkillsPage.css';

const SkillsPage = () => {
    const [focusColor, setFocusColor] = useState<"red" | "green" | "blue" | "yellow" | "white" | "orange">();

    // Mapping color to its corresponding header and paragraph content
    const colorContentMapping = {
        red: {
            header: 'Misc Skills',
            paragraph: ''
        },
        green: {
            header: 'Data Science',
            paragraph: ''
        },
        blue: {
            header: 'Quantum Computing',
            paragraph: ''
        },
        yellow: {
            header: 'Back End',
            paragraph: ''
        },
        white: {
            header: 'Front End',
            paragraph: ''
        },
        orange: {
            header: 'Game Dev',
            paragraph: ''
        }
    };

    return (
        <div className='skills-page'>
            <div className="content-left">
                <div className="skills-text">
                    {/* Displaying content based on the focusColor */}
                    <h1>{focusColor ? colorContentMapping[focusColor].header : 'Skills'}</h1>
                    <p>{focusColor ? colorContentMapping[focusColor].paragraph : 'According to the Cambridge Dictionary, a skill is defined as "an ability to perform an activity or job proficiently, especially through practice." Analogous to mastering a Rubik\'s cube, the essence lies in consistent practice. On the cube, you will find a selection of skills I have honed and continue to cultivate as a computer scientist and developer for the past 5 years. You can also play with it : )'}</p>
                </div>
                <div className="color-buttons-container">
                    <button className="white-button" onClick={() => setFocusColor("white")}></button>
                    <button className="green-button" onClick={() => setFocusColor("green")}></button>
                    <button className="blue-button" onClick={() => setFocusColor("blue")}></button>
                    <button className="yellow-button" onClick={() => setFocusColor("yellow")}></button>
                    <button className="red-button" onClick={() => setFocusColor("red")}></button>
                    <button className="orange-button" onClick={() => setFocusColor("orange")}></button>
                </div>
            </div>
            <div className="three-cube-class">
                <ThreeCube focusColor={focusColor} />
            </div>
        </div>
    );
};

export default SkillsPage;
