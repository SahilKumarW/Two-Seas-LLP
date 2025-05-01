import React from "react";
import "./CTA.css";

const CTA = () => {
    return (
        <div className="cta-container">
            <h2 className="cta-title">Find out what we can do for you</h2>
            <div className="cta-buttons">
                <button className="cta-button">
                    Call Us
                </button>
                <button className="cta-button secondary">
                    Email
                </button>
            </div>
        </div>
    );
};

export default CTA;