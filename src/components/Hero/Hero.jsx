import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-container">
                <h1 className="hero-title">
                    Extrordinarily talented, <br />skillfully sourced,<br />methodically placed.
                </h1>
                <p className="hero-subtitle">
                    Well practiced in Western approaches and deployable in days; find out how we provide talent at 60% of the cost than that of hiring locally.
                </p>
                <Link to="/book-call" className="hero-cta">
                    Book a free strategy call
                </Link>
            </div>
        </section>
    );
};

export default Hero;