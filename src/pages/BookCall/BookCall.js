import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaTimes } from "react-icons/fa";
import "./BookCall.css";
import logo from "../../assets/Two Seas Logo.png";
import { niches } from "../AdminDashboard/constants";

const BookCall = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    niche: "",
    companyName: "",
    companyWebsite: "",
    hearAbout: "",
    hearAboutOther: ""
  });

  const hearAboutOptions = [
    "Indeed",
    "LinkedIn",
    "Facebook",
    "TikTok",
    "Snapchat",
    "Two Seas Marketing",
    "Others"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Add your form submission logic here
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="overlay">
      <div className="form-wrapper">
        <div className="form-container">
          <button
            className="close-btn"
            onClick={handleClose}
            aria-label="Close form"
          >
            <FaTimes />
          </button>

          <div className="left-section">
            <img src={logo} alt="Two Seas Logo" className="logo" />
          </div>

          <div className="right-section">
            <h2 className="company-name">Two Seas LLP</h2>
            <p className="form-subtitle">Fill in the details below and our team will be in touch.</p>

            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label>Full Name*</label>
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
                <label>Company Name*</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter your company's name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Company Website*</label>
                <input
                  type="text"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  placeholder="Enter your company's website"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email*</label>
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
                <label>Phone Number*</label>
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
                <label>Niche*</label>
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

              <div className="form-group">
                <label>Where did you hear about us?*</label>
                <div className="radio-group">
                  {hearAboutOptions.map((option, index) => (
                    <div key={index} className="radio-option">
                      <input
                        type="radio"
                        id={`hearAbout-${index}`}
                        name="hearAbout"
                        value={option}
                        checked={formData.hearAbout === option}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor={`hearAbout-${index}`}>{option}</label>
                    </div>
                  ))}
                </div>
                {formData.hearAbout === "Others" && (
                  <input
                    type="text"
                    name="hearAboutOther"
                    value={formData.hearAboutOther}
                    onChange={handleChange}
                    placeholder="Please specify"
                    required
                    className="other-input"
                  />
                )}
              </div>

              <button type="submit" className="submit-btn">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCall;