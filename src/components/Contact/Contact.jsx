import React, { useState } from 'react';
import './Contact.css';
import logo from '../../assets/Two Seas Logo.png'; // Adjust path as needed

const Contact = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // You'd typically handle form submission here, e.g., sending data to an API
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form data submitted:", formData);
        // Add your form submission logic (e.g., API call, validation)
        alert('Thank you for your message! We will get back to you shortly.');
        setFormData({ // Clear form after submission
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            message: ''
        });
    };

    return (
        <div className="contact-page-wrapper"> {/* New wrapper for the entire section */}
            {/* Header section (remains largely the same) */}
            <div className="contact-header">
                <div className="logo-container">
                    <img
                        src={logo}
                        alt="Two Seas LLP Logo"
                        className="contact-logo"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/100?text=Logo"; // Fallback image
                        }}
                    />
                </div>
                <h1 className="contact-title">
                    <span className="title-blue">Reach</span>
                    <span className="title-teal"> Us Out</span>
                </h1>
            </div>

            {/* Main content: Calendly + Form */}
            <div className="contact-content-grid"> {/* New grid for side-by-side layout */}
                {/* Left Side: Calendly Integration */}
                <div className="calendly-section">
                    <h2 className="section-title-alt">Schedule Your Call</h2>
                    <p className="section-subtitle-alt">
                        Your path to building/scaling a thriving business begins here.
                    </p>
                    <div className="calendly-embed-container">
                        {/* Replace with your actual Calendly embed code */}
                        <iframe
                            src="https://calendly.com/YOUR_CALENDLY_USERNAME/30min" // <<< IMPORTANT: Replace with your Calendly URL
                            width="100%"
                            height="700px" // Adjust height as needed
                            frameBorder="0"
                            title="Schedule a meeting"
                        ></iframe>
                    </div>
                </div>

                {/* Right Side: Contact Form */}
                <form className="contact-form" onSubmit={handleSubmit}>
                <h2 className="form-title">Fill in the Form Below</h2>
                    {/* Input Fields */}
                    <div className="contact-card">
                        <div className="input-grid">
                            <div className="input-pair">
                                <div className="input-container">
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="contact-input"
                                        required
                                    />
                                </div>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="contact-input"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="input-pair">
                                <div className="input-container">
                                    <input
                                        type="tel" // Changed to tel for phone numbers
                                        name="phone"
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="contact-input"
                                    />
                                </div>
                                <div className="input-container">
                                    <input
                                        type="email" // Changed to email for email validation
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="contact-input"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message Box */}
                    <div className="contact-card">
                        <h2 className="section-title">Message / Query</h2>
                        <textarea
                            name="message"
                            placeholder="Type your message here..."
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            className="contact-textarea"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="submit-btn">
                        Send Message <span className="btn-wave">→</span>
                    </button>

                    {/* Contact Options - Only Email remains */}
                    <div className="contact-options-single"> {/* Adjusted class for single item */}
                        <div className="contact-method">
                            <div className="method-icon blue-bg">✉️</div>
                            <h3>Email</h3>
                            <p className="highlight-blue">contact@twoseas.org</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Contact;