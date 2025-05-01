import React from 'react';
import { FaVideo, FaUserShield, FaUserTie } from 'react-icons/fa';

const ProcessSection = () => {
    return (
        <section className="modern-process-section">
            <div className="process-header">
                <h2>Our Process</h2>
                <div className="header-divider"></div>
            </div>

            <div className="process-steps">
                {/* Meeting Step */}
                <div className="process-step">
                    <div className="step-header">
                        <div className="step-icon">
                            <FaVideo />
                        </div>
                        <h3>Meeting</h3>
                    </div>
                    <ul className="step-content">
                        <li>Our dedicated account manager takes a zoom call to discuss how you really realize and achieve.</li>
                    </ul>
                </div>

                {/* Selection Step */}
                <div className="process-step">
                    <div className="step-header">
                        <div className="step-icon">
                            <FaUserShield />
                        </div>
                        <h3>Selection</h3>
                    </div>
                    <ul className="step-content">
                        <li>Based on client needs, our VR team selects and filters the right file for your company from the latest pool.</li>
                        <li>Our latest pool includes thousands of credits from whom only the top makes up a recommended, another option.</li>
                        <li>Our complete profile is created with a recruiter assessment, and reference input will available to our clients.</li>
                    </ul>
                </div>

                {/* Interview Step */}
                <div className="process-step">
                    <div className="step-header">
                        <div className="step-icon">
                            <FaUserTie />
                        </div>
                        <h3>Interview</h3>
                    </div>
                    <ul className="step-content">
                        <li>Once you have selected a candidate of your preference, we will arrange for the interviews help you control the employee and identify the action mechanism.</li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default ProcessSection;