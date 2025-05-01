import React from "react";
import "./WhyUs.css";

const WhyUs = () => {
    return (
        <section className="why-us-section">
            <div className="why-us-container">
                <h2 className="section-title">
                    <span className="title-slash"></span> <span className="script-font">Why Us?</span>
                </h2>

                {/* Process Flow */}
                <div className="process-flow">
                    <div className="flow-section">
                        <h3>Needs Assessment</h3>
                        <div className="flow-arrow">→</div>
                        <h3>Rigorous Interviewing</h3>
                        <div className="flow-arrow">→</div>
                        <h3>Finding the Right Fit</h3>
                    </div>
                    <div className="flow-section secondary-flow">
                        <p>Initial Screening</p>
                        <div className="flow-arrow">→</div>
                        <p>Interviews</p>
                        <div className="flow-arrow">→</div>
                        <p>Reference Checking</p>
                    </div>
                </div>

                {/* Cards Row */}
                <div className="benefits-grid">
                    <div className="benefit-card">
                        <h3>Filtered Talent</h3>
                        <p>Pre-verified, reference checked, and deployable in days</p>
                    </div>

                    <div className="benefit-card">
                        <h3>Ground Support</h3>
                        <p>Logistical help, office setup, country norms</p>
                    </div>

                    <div className="benefit-card highlight-card">
                        <h3>Dedicated Account Managers</h3>
                        <p>KPI, ROI and UKst</p>
                        <p className="card-detail">Performance metrics are constantly monitored and delivered to our clients</p>
                    </div>

                    <div className="benefit-card">
                        <h3>Help in Scaling & Expanding</h3>
                        <p>We look for long term partnerships and help you scale and expand</p>
                        <p className="business-model">Such is our business model</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyUs;