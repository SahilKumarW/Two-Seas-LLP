import React from "react";
import { Link } from "react-router-dom";
import "./Process.css";

const Process = () => {
    return (
        <div className="process-container">
            <h2 className="process-title">Building your dream team</h2>
            <div className="process-steps">

                {/* Step 1 */}
                <div className="process-step">
                    <div className="process-number-container">
                        <div className="process-number">1</div>
                        <div className="vertical-line"></div>
                    </div>
                    <div className="process-content">
                        <h3>Strategy</h3>
                        <div className="underline"></div>
                        <p>
                            Work with your dedicated relationship manager to define your talent strategy and remote operations.
                        </p>
                        <Link to="/book-call" className="process-button">
                            Book a strategy call
                        </Link>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="process-step">
                    <div className="process-number-container">
                        <div className="process-number">2</div>
                        <div className="vertical-line"></div>
                    </div>
                    <div className="process-content">
                        <h3>Talent selection</h3>
                        <div className="underline"></div>
                        <p>
                            We match you with pre-vetted talent from our pool of 25,000+ professionals.
                        </p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="process-step">
                    <div className="process-number-container">
                        <div className="process-number">3</div>
                    </div>
                    <div className="process-content">
                        <h3>Remote team management</h3>
                        <div className="underline"></div>
                        <p>
                            We integrate team members into your business, and ensure your operations run smoothly through people support and equipping you with the tools to effortlessly manage your remote team.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Process;
