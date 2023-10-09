// EducationCard.tsx
import React from 'react';
import './EducationCard.css';

type EducationNode = {
  title: string;
  years: string;
  paragraph: string;
};

type EducationCardProps = {
  educationData: EducationNode[];
};

const EducationCard: React.FC<EducationCardProps> = ({ educationData }) => {
  return (
    <div className="education-card">
      <h2 className="education-card-header">Education</h2>
      <div className="education-timeline">
        {educationData.map((node, index) => (
          <div key={index} className="education-node">
            <h3 className="education-node-title">{node.title}</h3>
            <span className="education-node-years">{node.years}</span>
            <p className="education-node-paragraph">{node.paragraph}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationCard;
