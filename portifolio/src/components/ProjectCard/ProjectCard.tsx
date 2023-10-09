import React from 'react';
import './ProjectCard.css';

type Technology = {
  techName: string;
  emoji?: string; // optional field for emoji
  fileName?: string; // optional field for image filename
};

type ProjectCardProps = {
  technologies: Technology[];
  title: string;
  textDescription: string;
  imagePath: string;
};

const LogosPath = process.env.PUBLIC_URL + "/images/logos/";

const ProjectCard: React.FC<ProjectCardProps> = ({ technologies, title, textDescription, imagePath }) => {
  return (
    <div className="project-card">
      <img className="project-card-image" src={imagePath} alt={title} />
      <div className="project-card-content">
        <h3 className="project-card-title">{title}</h3>
        <p className="project-card-description">{textDescription}</p>
        <div className="project-card-technologies">
          {technologies.map((tech, index) => (
            <div key={index} className="project-card-technology">
              {tech.emoji ? (
                <span className="tech-icon">{tech.emoji}</span>
              ) : (
                <img 
                  className="tech-icon" 
                  src={LogosPath + tech.fileName} 
                  alt={tech.techName} 
                  width="20" 
                  height="20"
                />
              )}
              <span>{tech.techName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
