import React from "react";
import "./Footer.css";
import linkedinIcon from "../../assets/linkedin.svg";
import whatsappIcon from "../../assets/whatsapp.svg";
import emailIcon from "../../assets/email.svg";

const Footer = () => {
    const contactInfo = {
        whatsapp: {
            number: "923347777506",
            display: "+92 (334) 7777506"
        },
        email: "hello@TwoSeasLLP.org",
        linkedin: {
            url: "https://linkedin.com/company/two-seas-llp",
            display: "Two Seas LLP"
        }
    };

    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp.number}?text=Hello%20Two%20Seas%20LLP`;

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
                    {/* Email */}
                    <a href={`mailto:${contactInfo.email}`} className="footer-link contact-line" aria-label="Email">
                        <img src={emailIcon} alt="Email" className="contact-icon email-icon" />
                        {contactInfo.email}
                    </a>

                    {/* LinkedIn */}
                    <a href={contactInfo.linkedin.url} target="_blank" rel="noopener noreferrer" className="footer-link contact-line" aria-label="LinkedIn">
                        <img src={linkedinIcon} alt="LinkedIn" className="contact-icon linkedin-icon" />
                        {contactInfo.linkedin.display}
                    </a>

                    {/* WhatsApp */}
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="footer-link contact-line" aria-label="WhatsApp">
                        <img src={whatsappIcon} alt="WhatsApp" className="contact-icon whatsapp-icon" />
                        {contactInfo.whatsapp.display}
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
