import React from "react";
import "./Difference.css";

const Difference = () => {
    return (
        <div className="difference-container">
            <h2 className="difference-title">The Two Seas LLP difference</h2>
            <p className="difference-subtitle">
                We take a few simple ideas very seriously
            </p>

            {/* Key Features Section */}
            <div className="difference-features">
                <div className="feature">
                    <img src="/icons/quality-icon.png" alt="Quality-driven outsourcing" />
                    <h3>Quality-driven outsourcing</h3>
                    <p>We maintain rigorous standards for vetting talent to ensure your outsourcing success.</p>
                </div>
                <div className="feature">
                    <img src="/icons/scalable-icon.png" alt="Designed to be simple and scalable" />
                    <h3>Designed to be simple and scalable</h3>
                    <p>We prioritise results over complication, simplifying your end-to-end outsourcing process.</p>
                </div>
                <div className="feature">
                    <img src="/icons/australia-icon.png" alt="Australian market focus" />
                    <h3>Australian market focus</h3>
                    <p>We've served the Australian market exclusively for more than five years and understand exactly what works for local businesses.</p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="difference-stats">
                <div className="stat">
                    <h1>700+</h1>
                    <div className="stat-underline"></div>
                    <p>Staff placed</p>
                </div>
                <div className="stat">
                    <h1>90%</h1>
                    <div className="stat-underline"></div>
                    <p>Placement success rate</p>
                </div>
            </div>
        </div>
    );
};

export default Difference;
