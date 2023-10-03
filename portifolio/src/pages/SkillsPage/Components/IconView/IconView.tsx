import React from 'react';
import './IconView.css';

interface IconViewProps {
    image: string;
    name: string;
    grade: 1 | 2 | 3;
}

const IconView: React.FC<IconViewProps> = ({ image, name, grade }) => {
    return (
        <div className="icon-view-container">
            <img src={image} alt={name} className="icon-image" />
            <p className="icon-name">{name}</p>
            <div className="grade-container">
                {[1, 2, 3].map(num => (
                    <div key={num} className={`grade-block ${grade >= num ? 'active' : ''}`} />
                ))}
            </div>
        </div>
    );
}

export default IconView;
