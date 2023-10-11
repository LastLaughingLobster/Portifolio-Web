import React from 'react';
import './SkillSticker.css';

interface SkillStickerProps {
    fileName: string;          
    skillName: string;        
    skillLevel: number;   
    color: string;          
}

const LogosPath = process.env.PUBLIC_URL + "/images/logos/";

const SkillSticker: React.FC<SkillStickerProps> = ({ fileName, skillName, skillLevel, color }) => {
    return (
        <div className="skill-sticker">
            <div className="header">
                <img src={LogosPath + fileName} alt={skillName} className="skill-logo" />
                <h2 className="skill-sticker-text">{skillName}</h2>
            </div>
            <div className="skill-bar">
                {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="skill-level" style={{ backgroundColor: idx < skillLevel ? color : 'transparent' }}></div>
                ))}
            </div>
        </div>
    );
}

export default SkillSticker;
