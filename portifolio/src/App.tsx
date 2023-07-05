// App.tsx
import React, { FunctionComponent } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import HomeButton from './components/HomeButton/HomeButton';
import LandingPage from './pages/LandingPage/LandingPage';
import SkillsPage from './pages/SkillsPage/SkillsPage';
import PlaygroundPage from './pages/PlaygroundPage/PlaygroundPage';
import ContactPage from './pages/ContactPage/ContactPage';

const Main: FunctionComponent = () => {
  const location = useLocation();

  return (
    <>
      <Header />
      {location.pathname !== '/' && <HomeButton />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
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
