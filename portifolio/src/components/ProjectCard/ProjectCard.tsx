import React from 'react';
import './ProjectCard.css';

interface Project {
  title: string;
  description: string;
  stack: { tech: string, imgSrc: string }[];
  companies: { name: string, imgSrc: string }[];
}

interface Props {
  project: Project;
}

const ProjectCard: React.FC<Props> = ({ project }) => {
    return (
      <div className="project-card">
        <span className="arrow left">←</span>
  
        <div className="card-header">
          {project.companies.map((company, index) => (
            <img key={index} src= { process.env.PUBLIC_URL + company.imgSrc} alt={company.name} className="company-logo" />
          ))}
          <h2 className="project-title">{project.title}</h2>
        </div>
        
        <p className="project-description">{project.description}</p>
        
        <div className="stack-list">
          {project.stack.map((techItem, index) => (
            <div key={index} className="stack-item">
              <img src={ process.env.PUBLIC_URL + techItem.imgSrc} alt={techItem.tech} />
              <span>{techItem.tech}</span>
            </div>
          ))}
        </div>
  
        <span className="arrow right">→</span>
      </div>
    );
  };
  

export default ProjectCard;
