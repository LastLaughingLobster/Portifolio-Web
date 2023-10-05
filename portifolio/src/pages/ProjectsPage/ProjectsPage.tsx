// ProjectsPage.tsx
import React, { useState } from 'react';
import './ProjectsPage.css';
import ProjectCard from '../../components/ProjectCard/ProjectCard';

// Sample data. Later, replace this with an HTTP request.
const sampleProjects = [
    {
        technologies: [
            { techName: 'Python', fileName: 'python.png' },
            { techName: 'React', fileName: 'react.png' },
        ],
        title: 'Dell Scout',
        textDescription: "Scout was an audit software developed for DELL by CESAR. It served as an internal tool within the company, details of which I am unable to disclose further. I dedicated two and a half years to this project. My journey began as a QA intern for the initial six months, after which I transitioned into the role of a Junior Developer for the subsequent two years. This experience imparted valuable lessons on collaborating within large teams and sharpened my capabilities as a full-stack engineer, though my primary focus remained on the backend. By the end of my tenure, I was independently developing full features and felt prepared to take on greater responsibilities in my career.",
        imagePath: process.env.PUBLIC_URL + "/images/Photos/dell.jpg" ,
    },
    {
        technologies: [
            { techName: 'JavaScript', fileName: 'js.png' },
            { techName: 'HTML', fileName: 'html.png' },
        ],
        title: 'Petrobras Flexboard',
        textDescription: 'This is a description of the second cool project.',
        imagePath: process.env.PUBLIC_URL + "/images/Photos/flex.jpg",
    },
    {
        technologies: [
            { techName: 'JavaScript', fileName: 'js.png' },
            { techName: 'HTML', fileName: 'html.png' },
        ],
        title: 'Petrobras Flexboard',
        textDescription: 'This is a description of the second cool project.',
        imagePath: process.env.PUBLIC_URL + "/images/Photos/flex.jpg",
    },
    {
        technologies: [
            { techName: 'JavaScript', fileName: 'js.png' },
            { techName: 'HTML', fileName: 'html.png' },
        ],
        title: 'Petrobras Flexboard',
        textDescription: 'This is a description of the second cool project.',
        imagePath: process.env.PUBLIC_URL + "/images/Photos/flex.jpg",
    },
    
];

const ProjectsPage: React.FunctionComponent = () => {
    return (
        <div className="projects-page">
            {sampleProjects.map((project, index) => (
                <ProjectCard 
                    key={index}
                    technologies={project.technologies}
                    title={project.title}
                    textDescription={project.textDescription}
                    imagePath={project.imagePath}
                />
            ))}
        </div>
    );
};

export default ProjectsPage;
