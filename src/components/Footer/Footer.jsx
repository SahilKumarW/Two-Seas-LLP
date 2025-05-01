import React from "react";
import "./Footer.css";
import linkedinIcon from "../../assets/linkedin.svg";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-left">
                    <h2 className="footer-logo">Two Seas LLP<sup>®</sup></h2>
                    <p className="footer-text">
                        ©2025 Two Seas LLP Pty Ltd <span className="dot">•</span> ABN 18 636 896 485 <span className="dot">•</span>{" "}
                        <a href="#" className="footer-link">Privacy policy</a>
                    </p>
                </div>
                <div className="footer-right">
                    <a href="#" className="linkedin-icon">
                        <img src={linkedinIcon} alt="LinkedIn" />
                    </a>
                    <a href="mailto:hello@Two Seas LLP.com.au" className="footer-link">hello@TwoSeasLLP.org</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
