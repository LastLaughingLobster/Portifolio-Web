import React, { useState, FunctionComponent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header: FunctionComponent = () => {
  const location = useLocation();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState(location.pathname);

  return (
    <header>
      <nav className="gradient-nav">
        <ul>
          <li>
            <Link to="/Portifolio-Web" className={activeTab === '/Portifolio-Web' ? 'active' : ''} onClick={() => setActiveTab('/Portifolio-Web')}>Home</Link>
          </li>
          <li>
            <Link to="/skills" className={activeTab === '/skills' ? 'active' : ''} onClick={() => setActiveTab('/skills')}>Skills</Link>
          </li>
          <li>
            <Link to="/projects" className={activeTab === '/projects' ? 'active' : ''} onClick={() => setActiveTab('/projects')}>Projects</Link>
          </li>
          <li>
            <Link to="/playground" className={activeTab === '/playground' ? 'active' : ''} onClick={() => setActiveTab('/playground')}>Playground</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
