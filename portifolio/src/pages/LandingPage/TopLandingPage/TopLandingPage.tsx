// TopLandingPage.tsx
import React, { FunctionComponent } from 'react';
import './TopLandingPage.css';
import SocialButton from '../../../components/SocialButton/SocialButton';
import RubiksImageGenerator from '../../../components/CubyBackGround/RubiksImageGenerator';
import EducationCard from '../../../components/EducationCard/EducationCard';
import ProjectCard from '../../../components/ProjectCard/ProjectCard';
import LanguagesCard from '../../../components/LanguagesCard/LanguagesCard';

const educationData = [
  {
    title: "Eletronical Engeneering",
    years: "(2016 - 2018)",
    paragraph: "I began my academic journey in Electrical Engineering at UFPE, where I studied for two years. It was during this time that I was first introduced to programming, specifically with the C language. My passion for programming grew so deep that I made the decision to pivot my career path and pursue a degree in Computer Science. Nonetheless, my two years in the engineering program provided me with a solid foundation in mathematics and physics. These concepts continue to serve as a cornerstone for my work as a developer today."
  },
  {
    title: "Computer Science",
    years: "(2018 - 2022)",
    paragraph: "I pursued my Bachelor's in Computer Science at C.E.S.A.R School in Recife. I was fortunate to be a part of the second-ever cohort of the institution. By the time we graduated, we proudly ranked 4th among all colleges in Brazil in the National College Ranking Exam. The program exceeded my expectations, delving deep into pivotal computer science concepts ranging from Operating Systems and User Experience to the hands-on experience of constructing an 8-bit CPU using breadboards. The curriculum offered a holistic understanding of computing, from the bare-metal foundations to higher-level web app development. Additionally, I had the invaluable opportunity to collaborate with real-world clients during my studies, working on projects alongside design students. This provided me with practical work experience even before graduation."
  },
  {
    title: "New Adventures",
    years: "(2022 - Present)",
    paragraph: "I am deeply passionate about continuous learning; in fact, I consider studying one of my favorite hobbies. The world is teeming with fascinating knowledge, and with every new insight I acquire, I'm humbled by how much more there is to discover. I am currently pursuing a Master's Degree, focusing on my two favorite areas of Computer Science: Machine Learning and Game Engineering. I aspire to make meaningful contributions to the realms of science and knowledge in the future."
  }
];

const about =
{
  technologies: [
    { techName: ' Drums', emoji: '🥁' },
    { techName: 'Keyboard', emoji: '🎹' },
    { techName: 'Video Games', emoji: '🎮' },
    { techName: 'Cinema', emoji: '🎬' },
    { techName: 'Geography', emoji: '🌍' },
    { techName: 'Cience', emoji: '🔬' },
  ],
  title: 'About',
  textDescription: "From Recife, PE, in Brazil's vibrant northeast, my journey has been shaped by both sun-soaked beaches and an insatiable thirst for knowledge. My interests span from STEM and Biology to Geography, and I'm well-versed in global capitals. A musician at heart, I play the drums and keyboard with fervor. While I love cinema, video games resonate with me most deeply, blending art and technology in enthralling ways. Above all, I believe in software that genuinely adds value to users. A wise professor once told me, 'Good software is eternal, while hardware fades.' If you're keen on collaborating, teaming up, or diving into nerdy chats, I'm here.",
  imagePath: process.env.PUBLIC_URL + "/images/Photos/about.png",
}


const TopLandingPage: FunctionComponent = () => {
  return (
    <> 
      <div className="top-landing-page">
        <div className="empty-section">
          <RubiksImageGenerator imagePath={`${process.env.PUBLIC_URL}/images/Photos/me_white.png`} />
        </div>
        <div className="text-section">
          <div className="text-group">
            <h2>Hi, I am</h2>
            <h1>Henrique Neto</h1>
            <h3>Computer Scientist and Beyond</h3>
          </div>
          <div className="social-buttons">
            <SocialButton image={process.env.PUBLIC_URL + "/images/logos/twitter.png"} alt="Twitter" url="https://twitter.com/?lang=en" />
            <SocialButton image={process.env.PUBLIC_URL + "/images/logos/git.png"} alt="GitHub" url="https://github.com" />
            <SocialButton image={process.env.PUBLIC_URL + "/images/logos/linkedin.png"} alt="LinkedIn" url="https://linkedin.com" />
          </div>
        </div>
      </div>

      <div className="lower-part">
        <div className="right-section">
          <ProjectCard
            technologies={about.technologies}
            title={about.title}
            textDescription={about.textDescription}
            imagePath={about.imagePath}
          />
          <LanguagesCard />
        </div>
        <EducationCard educationData={educationData} />
      </div>
    </>
  );
};


export default TopLandingPage;
