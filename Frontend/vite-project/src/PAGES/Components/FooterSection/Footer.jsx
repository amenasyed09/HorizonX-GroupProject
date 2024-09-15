import React, { useState } from 'react';
import './Footer.css';  // Import your custom CSS
import TrendsSection from '../TrendSection/TrendSection';
const Footer = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic, such as sending data to backend or API
        console.log('Form Data:', formData);
        alert("Thank you for contacting us!");
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* About Us */}
                <div className="footer-section about-us">
                    <h4>About Us</h4>
                    <p>We help you find the best homes, offering listings for rentals, homes for sale, and market trends.</p>
                </div>

                {/* Contact Form */}
                <div className="footer-section contact-info">
                    <h4>Contact Us</h4>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message:</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div>

                {/* Resources */}
                <div className="footer-section resources">
                    <h4>Resources</h4>
                    <ul>
                        <li><a href="/rent">Homes for Rent</a></li>
                        <li><a href="/sell">Homes for Sale</a></li>
                        <li><a href="/sold">Sold Homes</a></li>
                        <li><a href="#trends">Market Trends</a></li>
                    </ul>
                </div>

                {/* Social Media Links */}
                <div className="footer-section social-media">
                    <h4>Follow Us</h4>
                    <a href="#"><i className="fab fa-facebook"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                    <a href="#"><i className="fab fa-linkedin"></i></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
