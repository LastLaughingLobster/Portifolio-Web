// Header.tsx
import React, { FunctionComponent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header: FunctionComponent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/Portifolio-Web';

  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/skills" className={isHomePage ? '' : 'not-home'}>Skills</Link></li>
          <li><Link to="/projects" className={isHomePage ? '' : 'not-home'}>Projects</Link></li>
          <li><Link to="/playground" className={isHomePage ? '' : 'not-home'}>Playground</Link></li>
          <li><Link to="/contact" className={isHomePage ? '' : 'not-home'}>Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
