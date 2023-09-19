import React, { useState } from 'react';
import ThreeCube from '../../components/Cube/ThreeCube';
import './SkillsPage.css';

const SkillsPage = () => {
    const [focusColor, setFocusColor] = useState<"red" | "green" | "blue" | "yellow" | "white" | "orange">();

    return (
        <div className='skills-page'>
            <ThreeCube focusColor={focusColor} />

            <div className="color-buttons-container">
                <button onClick={() => setFocusColor("red")}>Red</button>
                <button onClick={() => setFocusColor("green")}>Green</button>
                <button onClick={() => setFocusColor("blue")}>Blue</button>
                <button onClick={() => setFocusColor("yellow")}>Yellow</button>
                <button onClick={() => setFocusColor("white")}>White</button>
                <button onClick={() => setFocusColor("orange")}>Orange</button>
            </div>

            {/* ... your other commented code ... */}
        </div>
    );
};

export default SkillsPage;
