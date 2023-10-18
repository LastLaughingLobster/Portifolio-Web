// ProjectsPage.tsx
import React, { useState } from 'react';
import './ProjectsPage.css';
import ProjectCard from '../../components/ProjectCard/ProjectCard';

// Sample data. Later, replace this with an HTTP request.
const sampleProjects = [
    {
        technologies: [
            { techName: '.NET', fileName: 'net.png' },
            { techName: 'Angular', fileName: 'angular.png' },
            { techName: 'SQL', fileName: 'sql.png' },
            { techName: 'RabbitMQ', fileName: 'rabbit.png' },
            { techName: 'Selenium', fileName: 'selenium.png' },
        ],
        title: 'Dell Scout',
        textDescription: "Scout was an audit software developed for DELL by CESAR. It served as an internal tool within the company, details of which I am unable to disclose further. I dedicated two and a half years to this project. My journey began as a QA intern for the initial six months, after which I transitioned into the role of a Junior Developer for the subsequent two years. This experience imparted valuable lessons on collaborating within large teams and sharpened my capabilities as a full-stack engineer, though my primary focus remained on the backend. By the end of my tenure, I was independently developing full features and felt prepared to take on greater responsibilities in my career.",
        imagePath: process.env.PUBLIC_URL + "/images/Photos/dell.jpg" ,
    },
    {
        technologies: [
            { techName: 'React', fileName: 'react.png' },
            { techName: 'GraphQL', fileName: 'graphql.png' },
            { techName: 'OracleSQL', fileName: 'oracle.png' },
            { techName: 'SpringBoot', fileName: 'springBoot.png' }
        ],
        title: 'Petrobras Flexboard',
        textDescription: "The Flex board was an innovative solution devised by C.E.S.A.R for Petrobras, the premier oil company in Brazil. I was a part of this project for 7 months. Unfortunately, due to a binding non-disclosure agreement, I'm unable to delve into the specifics of our solution. The technological stack was intriguing, being a fusion of diverse technologies such as React, Spring Boot, GraphQL, and Oracle. Most of my hands-on experience was with Spring Boot and SQL, especially in crafting high-performance queries and procedures. While the project offered substantial learning opportunities, it ultimately wasn't the right fit for me. I decided to depart from C.E.S.A.R in search of new experiences and opportunities.",
        imagePath: process.env.PUBLIC_URL + "/images/Photos/flex.jpg",
    },
    {
        technologies: [
            { techName: 'VUE.js', fileName: 'vue.png' },
            { techName: 'Node.js', fileName: 'node.svg' },
            { techName: 'FireBase', fileName: 'firebase.png' },
        ],
        title: 'Ekäut\'s Barril Tracking',
        textDescription: "One of the most exhilarating projects I've ever been a part of involved a brewery (EKÄUT) with a unique challenge. They sought a cost-effective method to track beer barrels. While today's solution might easily point towards using Apple's AirTags, back in 2019, they weren't in the picture. Instead of focusing directly on the barrels, we pivoted our approach: why not track the delivery personnel responsible for the barrels?\n\n Our ingenious solution centered on QR codes, each imprinted with a barrel identifier and a link to our platform. Leveraging the browser's geolocation capabilities, each scan of a barrel not only tracked the smartphone of the delivery person through the app but also facilitated the transaction's conclusion. We essentially developed a precursor to the modern beer delivery app.\nThroughout this project, our understanding deepened around Vue.js, Node.js, and Firebase as a non-relational database all while having delicious pints!",
        imagePath: process.env.PUBLIC_URL + "/images/Photos/ekaut.jpg",
    },
    {
        technologies: [
            { techName: 'P5.js', fileName: 'p5js.png' },
            { techName: 'React.js', fileName: 'react.png' },
            { techName: 'SQL', fileName: 'sql.png' },
        ],
        title: 'Come Tudo/ All Eater',
        textDescription: "\"Come Tudo,\" which translates to \"All Eater\" from Portuguese, was designed with a noble goal in mind: to assist children with dietary restrictions in adopting healthier eating habits. This initiative was materialized as an MVP (Minimum Viable Product) to address this specific challenge. Drawing inspiration from the popular children's game \"Pou,\" we crafted a game centered around our protagonist, the \"All Eater.\" The game's core revolved around the character consuming fresh foods. What made it special was its customizable feature, allowing parents to modify the food items to align with their child's specific needs. So, whether it's tomatoes, carrots, or any other nutritious item, the game could be tailored accordingly. Personally, the experience was exhilarating for me. I was entrusted with the task of developing the mini-games within this platform. With the aid of p5.js, I successfully crafted games reminiscent of the classic \"Snake\" and \"Asteroid.\" The entire journey, from conception to development, was truly a joyous endeavor.",
        imagePath: process.env.PUBLIC_URL + "/images/Photos/sneke.jpeg",
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
