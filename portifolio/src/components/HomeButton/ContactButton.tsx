import React, { FunctionComponent, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ContactButton.css';

const ContactButton: FunctionComponent = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 960);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 960);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <li>
      <Link to="/contact" className="contact-button">
        {!isMobile && "Let's get in touch"}
        <span className="svg-icon">
          <img src={process.env.PUBLIC_URL + "/images/icons/paper_plane.svg"} alt="Contact" />
        </span>
      </Link>
    </li>
  );
};

export default ContactButton;
