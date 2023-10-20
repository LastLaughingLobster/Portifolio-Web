import React, { useState, useEffect } from 'react';
import ThreeCube from '../../components/Cube/ThreeCube';
import './SkillsPage.css';
import { Vector3 } from 'three';
import SkillSticker from '../../components/SkillSticker/SkillSticker';


const SkillsPage = () => {
    const [focusColor, setFocusColor] = useState<"red" | "green" | "blue" | "yellow" | "white" | "orange" | "black" >("black");
    const [isAnimating, setIsAnimating] = useState(false);

    // TODO: Move this to an endpoint latter
    const colorContentMapping = {
        black: {
            header: 'Skills',
            paragraph: 'According to the Cambridge Dictionary, a skill is defined as "an ability to perform an activity or job proficiently, especially through practice." Analogous to mastering a Rubik\'s cube, the essence lies in consistent practice. On the cube, you will find a selection of skills I have honed and continue to cultivate as a computer scientist and developer for the past 5 years. You can also play with it : ). The skill experience goes from 1 to 3 and can be seeing in the cards bellow',
            skills : [
            ]
        },
        red: {
            header: 'Misc Skills',
            paragraph: 'These are some other skills. Shout Out to Rust my current favorite language.',
            skills : [
                { fileName: 'docker.png', skillName: 'Docker', skillLevel: 2, color: '#1D63ED' },
                { fileName: 'selenium.png', skillName: 'Selenium', skillLevel: 2, color: '#5aad47' },
                { fileName: 'jenkins.png', skillName: 'Jenkins', skillLevel: 2, color: '#ecd6bb' },
                { fileName: 'rust.png', skillName: 'Rust', skillLevel: 3, color: '#d44c31' },
                { fileName: 'haskell.png', skillName: 'Haskell', skillLevel: 2, color: '#5b5083' },
                { fileName: 'cpp.png', skillName: 'C++', skillLevel: 2, color: '#2d649e' }
            ]
        },
        green: {
            header: 'Data Science',
            paragraph: 'I relly like Data Science and Machine Learning. Using statistics and Computers to create inteligence facinates me',
            skills : [
                { fileName: 'python.png', skillName: 'Python', skillLevel: 3, color: '#4b74a0' },
                { fileName: 'scikit-learn.png', skillName: 'Scikit Learn', skillLevel: 2, color: '#ed9e54' },
                { fileName: 'mediaPipe.png', skillName: 'Media Pipe', skillLevel: 1, color: '#4799a8' },
                { fileName: 'tensorflow.png', skillName: 'Tensor Flow', skillLevel: 2, color: '#e29645' },
                { fileName: 'numpy.png', skillName: 'NumPy', skillLevel: 2, color: '#5a7ecb' },
                { fileName: 'opencv.png', skillName: 'OpenCV', skillLevel: 1, color: '#79f952' }
            ]
        },
        blue: {
            header: 'Quantum Computing',
            paragraph: 'My Bachlor\'s Thesis was building a Quantun Neural Network. Quantum Computing is the real computing',
            skills : [
                { fileName: 'qiskit.png', skillName: 'Qiskit', skillLevel: 2, color: '#5b5083' },
                { fileName: 'tensorflow.png', skillName: 'Tensor FlowQ', skillLevel: 1, color: '#e29645' }
            ]
        },
        yellow: {
            header: 'Back End',
            paragraph: 'Maybe where i shine more in web developemnt, is the area i have the bigges experience. APIs all the way down',
            skills : [
                { fileName: 'net.png', skillName: '.NET', skillLevel: 3, color: '#503dce' },
                { fileName: 'csharp.png', skillName: 'C#', skillLevel: 3, color: '#357ff6' },
                { fileName: 'fastApi.png', skillName: 'Fast API', skillLevel: 2, color: '#499a8f' },
                { fileName: 'springBoot.png', skillName: 'Spring Boot', skillLevel: 3, color: '#81b255' },
                { fileName: 'sql.png', skillName: 'SQL', skillLevel: 3, color: '#F7DF1E' },
                { fileName: 'firebase.png', skillName: 'Firebase', skillLevel: 2, color: '#f3aa43' },
                { fileName: 'graphql.png', skillName: 'GraphQL', skillLevel: 2, color: '#d550aa' },
                { fileName: 'rabbit.png', skillName: 'RabbitMQ', skillLevel: 3, color: '#ef7334' }
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
                { fileName: 'css.png', skillName: 'CSS3', skillLevel: 3, color: '#1572B6' }
            ]
        },
        orange: {
            header: 'Game Dev',
            paragraph: "I\'ve implemented the cube using Three.js and some good'ol linear algebra. I Can't even belive i've built something so good. For comparison check Googles cube. P5 for when i wnat to have fun. And i am currently building a Noita style game with godot.",
            skills : [
                { fileName: 'Godot.png', skillName: 'Godot', skillLevel: 1, color: '#5c8fbd' },
                { fileName: 'p5js.png', skillName: 'P5.js', skillLevel: 3, color: '#dc4065' },
                { fileName: 'threejs.svg', skillName: 'Three.js', skillLevel: 2, color: '#FFFFFF' }
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
                    <h1>{focusColor && colorContentMapping[focusColor].header }</h1>
                    <p>{focusColor && colorContentMapping[focusColor].paragraph }</p>
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
                    <button className="white-button" onClick={() => setFocusColor("white")} disabled={isAnimating}></button>
                    <button className="green-button" onClick={() => setFocusColor("green")} disabled={isAnimating}></button>
                    <button className="blue-button" onClick={() => setFocusColor("blue")} disabled={isAnimating}></button>
                    <button className="yellow-button" onClick={() => setFocusColor("yellow")} disabled={isAnimating}></button>
                    <button className="red-button" onClick={() => setFocusColor("red")} disabled={isAnimating}></button>
                    <button className="orange-button" onClick={() => setFocusColor("orange")} disabled={isAnimating}></button>
                </div>
            </div>
            <div className="three-cube-class">
            {
                windowWidth < 960 
                ? <ThreeCube focusColor={focusColor} cameraPositionFromParent={new Vector3(2, 2, 3.8)} setIsAnimating={setIsAnimating} />
                : <ThreeCube focusColor={focusColor} setIsAnimating={setIsAnimating} />
            }
            </div>
        </div>
    );
};

export default SkillsPage;
