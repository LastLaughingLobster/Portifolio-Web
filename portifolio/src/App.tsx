// App.tsx
import React, { FunctionComponent } from 'react';
import Header from './components/Header/Header';
import LandingPage from './components/LandingPage/LandingPage';
import SkillsPage from './components/SkillsPage/SkillsPage';
import PlaygroundPage from './components/PlaygroundPage/PlaygroundPage';
import ContactPage from './components/ContactPage/ContactPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const App: FunctionComponent = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/playgorund" element={<PlaygroundPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
};

export default App;