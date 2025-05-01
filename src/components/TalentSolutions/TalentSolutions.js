import React from "react";
import "./TalentSolutions.css";
import fbrLogo from "../../assets/FBR-Logo.png";
import secpLogo from "../../assets/SCEP-Logo.png";
import psebLogo from "../../assets/PSEB-Logo.png";
import hipaaLogo from "../../assets/Hipaa Compliant.jpg";

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

                <div className="solutions-grid">
                    {/* First Row */}
                    <div className="solution-row">
                        <div className="solution-item">
                            <span className="solution-number">1</span>
                            <span className="solution-text">On-Ground Support</span>
                        </div>
                        <div className="solution-item">
                            <span className="solution-number">2</span>
                            <span className="solution-text">HR</span>
                        </div>
                        <div className="solution-item">
                            <span className="solution-number">3</span>
                            <span className="solution-text">Compliance</span>
                        </div>
                    </div>

                    {/* Second Row */}
                    <div className="solution-row">
                        <div className="solution-item">
                            <span className="solution-number">4</span>
                            <span className="solution-text">Performance Analytics</span>
                        </div>
                        <div className="solution-item">
                            <span className="solution-number">5</span>
                            <span className="solution-text">Employee Well-Being</span>
                        </div>
                    </div>
                </div>

                <div className="compliance-logos">
                    <div className="logo-item">
                        <img src={fbrLogo} alt="FBR" />
                    </div>
                    <div className="logo-item">
                        <img src={secpLogo} alt="SECP" />
                    </div>
                    <div className="logo-item">
                        <img src={psebLogo} alt="PSEB" />
                    </div>
                    <div className="logo-item">
                        <img src={hipaaLogo} alt="HIPAA" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TalentSolutions;