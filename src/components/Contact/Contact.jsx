import React, { useState } from 'react';
import './Contact.css';
import logo from '../../assets/Two Seas Logo.png'; // Adjust path as needed
import CalendarScheduler from '../../components/CalendarScheduler'; // Import the custom scheduler

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        phone: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form data submitted:", formData);
        alert('Thank you for your message! We will get back to you shortly.');
        setFormData({
            name: '',
            companyName: '',
            phone: '',
            email: '',
            message: ''
        });
    };

    // Handler for when the scheduling form is submitted
    const handleScheduleSubmit = async (appointmentData) => {
        try {
            // Combine contact form data with appointment data
            const fullData = {
                ...appointmentData,
                contactInfo: {
                    name: formData.name,
                    companyName: formData.companyName,
                    email: formData.email,
                    phone: formData.phone
                }
            };

            console.log("Scheduling data:", fullData);

            // Here you would typically send to your API
            // await api.scheduleAppointment(fullData);

            // For now, we'll use the email fallback from the CalendarScheduler
            return false; // Return false to let the component handle its default behavior
        } catch (error) {
            console.error('Error scheduling appointment:', error);
            throw error;
        }
    };

    return (
        <div className="contact-page-wrapper">
            {/* Header section */}
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

            {/* Main content: Scheduler + Form */}
            <div className="contact-content-grid">
                {/* Left Side: Custom Scheduler Integration */}
                <div className="calendly-section">
                    <h2 className="section-title-alt">Schedule Your Call</h2>
                    <p className="section-subtitle-alt">
                        Your path to building/scaling a thriving business begins here.
                    </p>
                    {/* <div className="custom-scheduler-container"> */}
                    <CalendarScheduler
                        onScheduleSubmit={handleScheduleSubmit}
                        // title="Book a Strategy Call"
                        submitButtonText="Confirm Appointment"
                        successMessage="We'll contact you shortly to confirm your appointment time."
                    />
                    {/* </div> */}
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
                                        name="name"
                                        placeholder="Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="contact-input"
                                        required
                                    />
                                </div>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        name="companyName"
                                        placeholder="Company Name"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className="contact-input"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="input-pair">
                                <div className="input-container">
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="contact-input"
                                    />
                                </div>
                                <div className="input-container">
                                    <input
                                        type="email"
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

                    {/* Contact Options */}
                    <div className="contact-options-single">
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