import React from "react";
import "./TalentSolutions.css";
import fbrLogo from "../../assets/FBR-Logo.png";
import secpLogo from "../../assets/SCEP-Logo.png";
import psebLogo from "../../assets/PSEB-Logo.png";
import hipaaLogo from "../../assets/Hipaa Compliant.jpg";
import { Link } from "react-router-dom";

const TalentSolutions = () => {
    return (
        <section className="talent-solutions">
            <div className="solutions-container">
                <div className="title-wrapper">
                    <h2 className="section-title">
                        <span className="title-line-1">College Educated,</span>
                        <span className="title-line-2">Adaptable, Smart and Witty Talent</span>
                    </h2>
                    <div className="all-in-one-badge">
                        ALL IN ONE SOLUTION!
                    </div>
                </div>

                <div className="solutions-content">
                    <div className="solutions-grid">
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                            <div key={num} className="solution-item">
                                <span className="solution-number">{num}</span>
                                <span className="solution-text">
                                    {[
                                        "HR",
                                        "Payroll",
                                        "Compliance",
                                        "Performance Analytics",
                                        "On-Ground Support",
                                        "Employee Well-Being"
                                    ][num - 1]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="compliance-section">
                <div className="compliance-logos">
                    {[fbrLogo, secpLogo, psebLogo, hipaaLogo].map((logo, index) => (
                        <div key={index} className="logo-item">
                            <img src={logo} alt={["FBR", "SECP", "PSEB", "HIPAA"][index]} />
                        </div>
                    ))}
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Link to="/how-we-work" className="how-we-work-button">
                        How We Work
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default TalentSolutions;