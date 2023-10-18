// Contact.tsx

import React from 'react';
import './ContactPage.css';
import SocialButton from '../../components/SocialButton/SocialButton';
import emailjs from 'emailjs-com';

const ContactPage: React.FC = () => {
    const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', e.currentTarget, 'YOUR_USER_ID')
          .then((result) => {
              console.log(result.text);
          }, (error) => {
              console.log(error.text);
          });
    };

    return (
        <div className="center-container">
            <div className="contact-container">
                <h2 className='header-class'>Let's Work Together</h2>
                <form className="contact-form">
                    <input type="text" placeholder="Name" />
                    <input type="email" placeholder="Email" />
                    <input type="text" placeholder="Subject" />
                    <textarea placeholder="Your message..."></textarea>
                    <button type="submit">Send Message</button>
                </form>
                <div className="social-buttons">
                    <SocialButton image={process.env.PUBLIC_URL + "/images/logos/twitter.png"} alt="Twitter" url="https://twitter.com/?lang=en" />
                    <SocialButton image={process.env.PUBLIC_URL + "/images/logos/git.png"} alt="GitHub" url="https://github.com" />
                    <SocialButton image={process.env.PUBLIC_URL + "/images/logos/linkedin.png"} alt="LinkedIn" url="https://linkedin.com" />
                </div>
            </div>
        </div>
    );
}

export default ContactPage;
