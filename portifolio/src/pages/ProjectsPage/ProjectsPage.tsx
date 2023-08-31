// ProjectsCarousel.tsx
import React, { useState } from 'react';
import './ProjectsPage.css';

interface Project {
    title: string;
    description: string;
    imageUrl: string;
    liveLink: string;
    githubLink: string;
}

const projectsData: Project[] = [
    {
        title: "Dell's SCOUT",
        description: "Scout was a Account tool desingd for DELL. I worked on CESAR and our client was dell ",
        imageUrl: "/images/Photos/dell.jpg",
        liveLink: "https://live-link-1.com",
        githubLink: "https://github.com/user/project1"
    },
    {
        title: "Petrobras FlexBoard",
        description: "A brief description about project 2.",
        imageUrl: "/images/Photos/flex.jpg",
        liveLink: "https://live-link-2.com",
        githubLink: "https://github.com/user/project2"
    },
    {
        title: "Barril Tracking Ekaut",
        description: "A brief description about project 3.",
        imageUrl: "/images/Photos/ekaut.jpg",
        liveLink: "https://live-link-3.com",
        githubLink: "https://github.com/user/project3"
    },
    {
        title: "LIBRAS Detector",
        description: "A brief description about project 4.",
        imageUrl: "/images/Photos/libras.png",
        liveLink: "https://live-link-4.com",
        githubLink: "https://github.com/user/project4"
    }
];

const ProjectsPage: React.FunctionComponent = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex(prevIndex => (prevIndex === 0 ? projectsData.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prevIndex => (prevIndex === projectsData.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <div className="carousel-container">
            <button onClick={handlePrev} className="carousel-button carousel-prev">Prev</button>
            
            <div className="carousel-card">
                <img src={process.env.PUBLIC_URL + projectsData[currentIndex].imageUrl} alt={projectsData[currentIndex].title} className="project-image" />
                <h2>{projectsData[currentIndex].title}</h2>
                <p>{projectsData[currentIndex].description}</p>
                <div className="project-links">
                    <a href={projectsData[currentIndex].liveLink} target="_blank" rel="noopener noreferrer">See it live</a>
                    <a href={projectsData[currentIndex].githubLink} target="_blank" rel="noopener noreferrer">View on GitHub</a>
                </div>
            </div>
            
            <button onClick={handleNext} className="carousel-button carousel-next">Next</button>
        </div>
    );
};

export default ProjectsPage;
