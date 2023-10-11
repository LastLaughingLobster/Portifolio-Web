import React, { useState, useEffect } from 'react';
import ThreeCube from '../../components/Cube/ThreeCube';
import './SkillsPage.css';
import { Vector3 } from 'three';
import SkillSticker from '../../components/SkillSticker/SkillSticker';


const SkillsPage = () => {
    const [focusColor, setFocusColor] = useState<"red" | "green" | "blue" | "yellow" | "white" | "orange">();

    // TODO: Move this to an endpoint latter
    const colorContentMapping = {
        red: {
            header: 'Misc Skills',
            paragraph: 'These are some other skills. Shout Out to Rust my current favorite language.',
            skills : [
                { fileName: 'js.png', skillName: 'JS', skillLevel: 3, color: '#F7DF1E' }
            ]
        },
        green: {
            header: 'Data Science',
            paragraph: 'I relly like Data Science and Machine Learning. Using statistics and Computers to create inteligence facinates me',
            skills : [
                { fileName: 'js.png', skillName: 'JS', skillLevel: 3, color: '#F7DF1E' }
            ]
        },
        blue: {
            header: 'Quantum Computing',
            paragraph: 'My Bachlor\'s Thesis was building a Quantun Neural Network. Quantum Computing is the real computing',
            skills : [
                { fileName: 'js.png', skillName: 'JS', skillLevel: 3, color: '#F7DF1E' }
            ]
        },
        yellow: {
            header: 'Back End',
            paragraph: 'Maybe where i shine more in web developemnt, is the area i have the bigges experience. APIs all the way down',
            skills : [
                { fileName: 'js.png', skillName: 'JS', skillLevel: 3, color: '#F7DF1E' }
            ]
        },
        white: {
            header: 'Front End',
            paragraph: "I used to hate front end back in college due to css. But now it's only cascading love",
            skills : [
                { fileName: 'js.png', skillName: 'JS', skillLevel: 3, color: '#F7DF1E' },
                { fileName: 'ts.png', skillName: 'TS', skillLevel: 2, color: '#3178C6' },
                { fileName: 'html.png', skillName: 'HTML5', skillLevel: 3, color: '#E34F26' },
                { fileName: 'angular.png', skillName: 'Angular', skillLevel: 2, color: '#B52E31' },
                { fileName: 'react.png', skillName: 'React', skillLevel: 3, color: '#61DAFB' },
                { fileName: 'css.png', skillName: 'CSS3', skillLevel: 3, color: '#1572B6' },
                { fileName: 'react.png', skillName: 'React', skillLevel: 3, color: '#61DAFB' },
                { fileName: 'css.png', skillName: 'CSS3', skillLevel: 3, color: '#1572B6' },
            ]
        },
        orange: {
            header: 'Game Dev',
            paragraph: "I\'ve implemented the cube using Three.js and some good'ol linear algebra. I Can't even belive i've built something so good. For comparison check Googles cube. P5 for when i wnat to have fun. And i am currently building a Noita style game with godot.",
            skills : [
                { fileName: 'js.png', skillName: 'JS', skillLevel: 3, color: '#F7DF1E' }
            ]
        }
    };

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }

        // Set event listener
        window.addEventListener('resize', handleResize);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);


    return (
        <div className='skills-page'>
            <div className="content-left">
                <div className="skills-text">
                    {/* Displaying content based on the focusColor */}
                    <h1>{focusColor ? colorContentMapping[focusColor].header : 'Skills'}</h1>
                    <p>{focusColor ? colorContentMapping[focusColor].paragraph : 'According to the Cambridge Dictionary, a skill is defined as "an ability to perform an activity or job proficiently, especially through practice." Analogous to mastering a Rubik\'s cube, the essence lies in consistent practice. On the cube, you will find a selection of skills I have honed and continue to cultivate as a computer scientist and developer for the past 5 years. You can also play with it : )'}</p>
                </div>
                {focusColor && colorContentMapping[focusColor].skills &&
                    <div className="skill-stickers-container">
                        {colorContentMapping[focusColor].skills.map((skill, index) => (
                            <SkillSticker 
                                key={index}
                                fileName={skill.fileName}
                                skillName={skill.skillName}
                                skillLevel={skill.skillLevel}
                                color={skill.color}
                            />
                        ))}
                    </div>
                }
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
                {
                    windowWidth < 960 
                    ? <ThreeCube focusColor={focusColor} cameraPositionFromParent={new Vector3(2, 2, 3.8)} />
                    : <ThreeCube focusColor={focusColor} />
                }
            </div>
        </div>
    );
};

export default SkillsPage;
