import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./BookCall.css";
import logo from "../../assets/logo.png"; // Update with actual path to your logo
import { niches } from "../AdminDashboard/constants";

const BookCall = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        niche: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (value) => {
        setFormData({ ...formData, phone: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
    };

    return (
        <div className="overlay">
            <div className="form-container">
                {/* Left Section - Logo */}
                <div className="left-section">
                    <img src={logo} alt="Company Logo" className="logo" />
                </div>

                {/* Right Section - Form */}
                <div className="right-section">
                    <h2 style={{ textAlign: 'center', color: '#2A2D7C', marginTop: '20px' }} className="company-name">Two Seas LLP</h2>
                    <p style={{ textAlign: 'center' }} className="form-subtitle">Fill in the details below to schedule a call.</p>

                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div style={{ gap: '0' }} className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <PhoneInput
                                country={"pk"}
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                inputClass="phone-input"
                                containerClass="phone-container"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Niche</label>
                            <select
                                name="niche"
                                value={formData.niche}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select Niche</option>
                                {niches.map((niche) => (
                                    <option key={niche.id} value={niche.name}>
                                        {niche.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="submit-btn">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookCall;
