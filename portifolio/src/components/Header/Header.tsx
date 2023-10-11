import React, { useState, FunctionComponent, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header: FunctionComponent = () => {
  const location = useLocation();

  // State for active tab
  const [activeTab, setActiveTab] = useState(location.pathname);

  // State for mobile view
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 960);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setIsMobile(window.innerWidth <= 960);
    });

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', () => {
        setIsMobile(window.innerWidth <= 960);
      });
    };
  }, []);

  return (
    <header>
      <nav className="gradient-nav">
        <ul>
          <li>
            <Link to="/Portifolio-Web" className={activeTab === '/Portifolio-Web' ? 'active' : ''} onClick={() => setActiveTab('/Portifolio-Web')}>About</Link>
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
          {isMobile && (
            <li>
              <Link to="/contact" className="contact-button">
                <span className="svg-icon">
                  <img src={process.env.PUBLIC_URL + "/images/icons/paper_plane.svg"} alt="Contact" />
                </span>
              </Link>
            </li>
          )}
        </ul>
      </nav>
      {!isMobile && (
        <Link to="/contact" className="contact-button separate-contact">
          Let's get in touch
          <span className="svg-icon">
            <img src={process.env.PUBLIC_URL + "/images/icons/paper_plane.svg"} alt="Contact" />
          </span>
        </Link>
      )}
    </header>
  );
};

export default Header;
