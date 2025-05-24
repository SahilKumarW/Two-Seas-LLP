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
                        <li>Our account manager takes a zoom call with you to identify your needs, time zone, company culture, nature of expansion, and quality of talent that you require.</li>
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
                        <li>Based on client needs, our HR team selects and filters talent from our talent pool or if it feels the need to; re-advertisment is done to scower the right fits according to exact qulifactions that is desired by the clients.</li>
                        <li>Our latest pool includes thousands of candidates from whom only the top matches are recommended to the clients. Ensuring the saving of time and effort.</li>
                        <li>Our complete profile is created with a recruiter assessment, and reference input which is made available to our clients.</li>
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
                        <li>Once you have selected a candidate of your preference, we will arrange for the interviews, helping you control the employee through our methods of overseeing.</li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default ProcessSection;