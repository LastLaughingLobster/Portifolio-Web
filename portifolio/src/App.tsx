// App.tsx
import React, { FunctionComponent } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import ContactButton from './components/HomeButton/ContactButton';
import LandingPage from './pages/LandingPage/LandingPage';
import SkillsPage from './pages/SkillsPage/SkillsPage';
import PlaygroundPage from './pages/PlaygroundPage/PlaygroundPage';
import ContactPage from './pages/ContactPage/ContactPage';
import ProjectsPage from './pages/ProjectsPage/ProjectsPage';
import GridTillesBackground from './components/CubyBackGround/GridTillesBackground';
import './App.css';

const Main: FunctionComponent = () => {
  
  return (
    <>
      <Header />
      <GridTillesBackground/>
      <Routes>
        <Route path="/Portifolio-Web" element={<LandingPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
      </Routes>
  
      {/* <ContactButton /> */}
    </>
  );
};


const App: FunctionComponent = () => {
  return (
    <Router>
      <Main />
    </Router>
  );
};

export default App;
