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

    return (
        <div className="contact-container">
            {/* Header */}
            <div className="contact-header">
                <div className="logo-container">
                    <img
                        src={logo}
                        alt="Two Seas LLP Logo"
                        className="contact-logo"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/100?text=Logo";
                        }}
                    />
                </div>
                <h1 className="contact-title">
                    <span className="title-blue">Reach</span>
                    <span className="title-teal"> Us Out</span>
                </h1>
            </div>

            {/* Rest of your form remains the same */}
            <form className="contact-form">
                {/* Title Card */}
                <div className="contact-card accent-card">
                    <h2 className="section-title">Schedule Your Call</h2>
                    <p className="section-subtitle">
                        Your path to building/scaling a thriving business begins here
                    </p>
                    <div className="wave-decoration"></div>
                </div>

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
                                />
                            </div>
                        </div>
                        <div className="input-pair">
                            <div className="input-container">
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="contact-input"
                                />
                            </div>
                            <div className="input-container">
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="contact-input"
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
                    />
                </div>

                {/* Submit Button */}
                <button type="submit" className="submit-btn">
                    Send Message <span className="btn-wave">→</span>
                </button>

                {/* Contact Options */}
                <div className="contact-options">
                    <div className="contact-method">
                        <div className="method-icon teal-bg">📞</div>
                        <h3>Call Us</h3>
                        <p className="highlight-teal">+1 (123) 456-7890</p>
                    </div>
                    <div className="contact-method">
                        <div className="method-icon blue-bg">✉️</div>
                        <h3>Email</h3>
                        <p className="highlight-blue">contact@twoseasllp.com</p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Contact;