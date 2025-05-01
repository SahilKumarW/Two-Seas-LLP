import React from "react";
import "./WhoWeAre.css";
import whoWeAreImage from "../../assets/who-we-are.png";

const WhoWeAre = () => {
    return (
        <section className="who-we-are">
            <div className="who-we-are-container">
                {/* Left Image */}
                <div className="who-we-are-image">
                    <img src={whoWeAreImage} alt="Video Call Meeting" />
                </div>

                {/* Right Text Content */}
                <div className="who-we-are-text">
                    <h2 className="who-we-are-title">Who we are</h2>
                    <p className="who-we-are-highlight">
                        A team of <span>retired military officers</span> led by Alumnus of an American University
                    </p>
                    <p className="who-we-are-description">
                        We strive to provide <span>transparency</span>, the right strategy, and the extremely necessary
                        on-ground support to ensure overseas bear results.
                    </p>
                    <button className="who-we-are-button">
                        Book a Demo
                    </button>
                </div>
            </div>
        </section>
    );
};

export default WhoWeAre;