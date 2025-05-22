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
                        ©2025 Two Seas LLP <span className="dot">•</span> Incorporation No. 0271957 <span className="dot">•</span>{" "}
                        <a href="/privacy-policy" className="footer-link">Privacy policy</a>
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
