import React from "react";
import { useNavigate } from "react-router-dom";
import "./CTA.css";

const CTA = () => {
    const navigate = useNavigate();
    return (
        <div className="cta-container">
            <h2 className="cta-title">Find out what we can do for you</h2>
            <div className="cta-buttons">
                <button className="cta-button" onClick={() => navigate("/contact-us")}>
                    Contact Us
                </button>
                <button className="cta-button secondary">
                    Book a Free Consultation
                </button>
            </div>
        </div>
    );
};

export default CTA;