import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./BookCall.css";
import logo from "../../assets/logo.png"; // Update with actual path to your logo

const BookCall = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        industry: "",
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
                    <h2 className="company-name">Two Seas LLP</h2>
                    <p className="form-subtitle">Fill in the details below to schedule a call.</p>

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

                        <div className="form-group">
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
                                country={"us"}
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                inputClass="phone-input"
                                containerClass="phone-container"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Industry</label>
                            <select
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select Industry</option>
                                <option value="Energy & Utilities">Energy & Utilities</option>
                                <option value="Finance">Finance</option>
                                <option value="Real Estate">Real Estate</option>
                                <option value="IT & Telecom">IT & Telecom</option>
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
