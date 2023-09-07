import React from 'react';
import './LandingPageBackground.css';

const LandingPageBackground: React.FC = () => {
    return (
        <div className="background-container">
            <div className="left-background"></div>
            
            <div className="rainbow-section">
                <div className="rainbow-color" style={{background: "#2962FF"}}></div>
                <div className="rainbow-color" style={{background: "#96CA2D"}}></div>
                <div className="rainbow-color" style={{background: "#FFBE00"}}></div>
                <div className="rainbow-color" style={{background: "#D50000"}}></div>
            </div>

            <div className="right-background"></div>
        </div>

    );
};

export default LandingPageBackground;
