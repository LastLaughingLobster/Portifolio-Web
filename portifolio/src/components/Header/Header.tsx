import React, { useState, FunctionComponent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header: FunctionComponent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/Portifolio-Web' || location.pathname === '/Portifolio-Web/';
  
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <nav>
        {/* Hamburger Icon */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        <ul className={menuOpen ? 'open' : ''}>
          {/* Home option for mobile view (only shown if not on the home page) */}
          {!isHomePage && <li className="mobile-home"><Link to="/Portifolio-Web" onClick={() => setMenuOpen(false)}>Home</Link></li>}

          <li><Link to="/skills" className={isHomePage ? '' : 'not-home'} onClick={() => setMenuOpen(false)}>Skills</Link></li>
          <li><Link to="/projects" className={isHomePage ? '' : 'not-home'} onClick={() => setMenuOpen(false)}>Projects</Link></li>
          <li><Link to="/playground" className={isHomePage ? '' : 'not-home'} onClick={() => setMenuOpen(false)}>Playground</Link></li>
          <li><Link to="/contact" className={`contact ${isHomePage ? '' : 'not-home'}`} onClick={() => setMenuOpen(false)}>Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
