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
        <div className="contact-page">

            {/* Header */}
            <header className="contact-header">
                <h1>Let's get in touch!</h1>
            </header>

            {/* Personal Info */}
            <section className="personal-info">
                <h2>My Information</h2>
                <p><strong>Name:</strong> Henrique Joaquim Ferreira Cruz Neto</p>
                <p><strong>Position:</strong> Software Engineer / Researcher</p>
                <p><strong>Email:</strong> henriquecruz_neto@icloud.com</p>
                <p><strong>Phone:</strong> +55 81 988580711</p>
                <p><strong>Address:</strong> Recife, Brazil</p>
            </section>

            {/* Contact Form */}
            <section className="contact-form">
                <h2>Contact Me</h2>
                <form onSubmit={sendEmail}>
                    <input type="text" name="name" placeholder="Name" required />
                    <input type="email" name="email" placeholder="Email" required />
                    <input type="text" name="subject" placeholder="Subject" required />
                    <textarea name="message" placeholder="Your message..." required></textarea>
                    <button type="submit">Send Message</button>
                </form>
            </section>
            

            {/* Social Media Links */}
            
            <div className="social-buttons">
                <SocialButton image="/images/logos/twitter.png" alt="Twitter" url="https://twitter.com/?lang=en" />
                <SocialButton image="/images/logos/git.png" alt="GitHub" url="https://github.com" />
                <SocialButton image="/images/logos/linkedin.png" alt="LinkedIn" url="https://linkedin.com" />
            </div>

            {/* Optional Map */}
            {/* Uncomment and add your map embed code if required */}
            {/* 
            <section className="location-map">
                <h2>Our Location</h2>
                <div className="map">
                    // Embed your map here
                </div>
            </section> 
            */}

            {/* Footer */}
            <footer className="contact-footer">
                <p>© 2023 Henrique Cruz Neto. All rights reserved.</p>
            </footer>

        </div>
    );
}

export default ContactPage;
