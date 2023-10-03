// ProjectsCarousel.tsx
import React, { useState } from 'react';
import './ProjectsPage.css';

type LogoName = {
    logoUrl: string;
    name: string;
    color: string;  
};


interface Project {
    title: string;
    description: string;
    logosUrl: string[];
    stack: LogoName[];
}

const projectsData: Project[] = [
    {
        title: "Dell's SCOUT",
        description: "Scout was an audit software developed for DELL by CESAR. It served as an internal tool within the company, details of which I am unable to disclose further. I dedicated two and a half years to this project. My journey began as a QA intern for the initial six months, after which I transitioned into the role of a Junior Developer for the subsequent two years. This experience imparted valuable lessons on collaborating within large teams and sharpened my capabilities as a full-stack engineer, though my primary focus remained on the backend. By the end of my tenure, I was independently developing full features and felt prepared to take on greater responsibilities in my career.",
        logosUrl: ["/images/logos/dell.png","/images/logos/cesar.png"],
        stack: [
            { logoUrl: "/images/logos/angular.png", name: "Angular"  , color : "white"},
            { logoUrl: "/images/logos/net.png", name: ".NET" , color : "blue"},
            { logoUrl: "/images/logos/rabbit.png", name: "RabbitMQ" , color : "orange"},
            { logoUrl: "/images/logos/sql.png", name: "MS SQL Server" , color : "yellow"}
        ]
    },
    {
        title: "Petrobras FlexBoard",
        description: "Scout was an audit software developed for DELL by CESAR. It served as an internal tool within the company, details of which I am unable to disclose further. I dedicated two and a half years to this project. My journey began as a QA intern for the initial six months, after which I transitioned into the role of a Junior Developer for the subsequent two years. This experience imparted valuable lessons on collaborating within large teams and sharpened my capabilities as a full-stack engineer, though my primary focus remained on the backend. By the end of my tenure, I was independently developing full features and felt prepared to take on greater responsibilities in my career.",
        logosUrl: ["/images/logos/petrobras.png", "/images/logos/cesar.png"],
        stack: [
            { logoUrl: "/images/logos/react.png", name: "React" , color : "blue"},
            { logoUrl: "/images/logos/springBoot.png", name: "SpringBoot" , color : "green"},
            { logoUrl: "/images/logos/graphql.png", name: "GraphQL" , color : "grey"},
            { logoUrl: "/images/logos/oracle.png", name: "Oracle Database" , color : "white"}
        ]
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
            
            <div className="carousel-card">
                            
                {/* And this will be up*/}
                <div className="details-section">
                    <h2>{projectsData[currentIndex].title}</h2>
                    <p>{projectsData[currentIndex].description}</p>
                </div>

                {/* When in mobile this will be on the bottom*/}
                <div className="left-section">
                    <div className="logos-section">
                        {projectsData[currentIndex].logosUrl.map((logo, index) => (
                            <img key={index} src={process.env.PUBLIC_URL + logo} alt={`Logo ${index + 1}`} className="project-logo" />
                        ))}
                    </div>
                    <div className="stack-section">
                        {projectsData[currentIndex].stack.map((tech, index) => (
                            <div key={index} className="stack-item" style={{ backgroundColor: tech.color }}> 
                                <img src={process.env.PUBLIC_URL + tech.logoUrl} alt={tech.name} />
                                <p>{tech.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mobile-buttons">
                    <button onClick={handlePrev} className="carousel-button carousel-prev-mobile">{"<"}</button>
                    <button onClick={handleNext} className="carousel-button carousel-next-mobile">{">"}</button>
                </div>      
            </div>
            
            {/* ... Your existing code ... */}

            <button onClick={handlePrev} className="carousel-button carousel-prev">←</button>
            <button onClick={handleNext} className="carousel-button carousel-next">→</button>
        

        </div>
    );
    
};

export default ProjectsPage;