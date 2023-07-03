// Header.tsx
import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: FunctionComponent = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/skills">Skills</Link></li>
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/playground">Playground</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
