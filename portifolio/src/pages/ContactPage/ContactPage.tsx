import React from 'react';
import './ContactPage.css';
import SocialButton from '../../components/SocialButton/SocialButton';

const ContactPage: React.FC = () => {

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            subject: formData.get("subject") as string,
            message: formData.get("message") as string
        };
    
        try {
            const response = await fetch('https://me7tkkvnqk.execute-api.eu-west-1.amazonaws.com/prod', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error("Error sending email:", error);
        }
    };

    return (
        <div className="center-container">
            <div className="contact-container">
                <h2 className='header-class'>Let's Work Together</h2>
                <form className="contact-form" onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Name" />
                    <input type="email" name="email" placeholder="Email (Optional)" />
                    <input type="text" name="subject" placeholder="Subject" />
                    <textarea name="message" placeholder="Your message..."></textarea>
                    <button type="submit">Send Me an Email</button>
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
