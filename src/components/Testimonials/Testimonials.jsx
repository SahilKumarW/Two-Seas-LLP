import React, { useState } from "react";
import "./Testimonials.css";
import { FaQuoteLeft } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const testimonials = [
    {
        quote: "Our experience with Two Seas LLP was easy, efficient and honest, and this is exactly what you want as a Manager when you are trying to expand your team for growth. We cannot recommend them enough for engaging offshore staff.",
        name: "Nicola McCarron",
        company: "H&B/Origin",
        logo: "/logos/origin-logo.png" // Update path to your actual logo
    },
    {
        quote: "Our experience with Two Seas LLP of selecting candidates through to actioning our plan was absolutely brilliant. The level of service & backup is second to none and we look forward to utilising their services even more in the future.",
        name: "David Rogers",
        company: "Modern Group",
        logo: "/logos/modern-group-logo.png" // Update path to your actual logo
    },
    {
        quote: "Working with Two Seas LLP was excellent. Communication and follow up was great. I feel that my level of candidates were top notch. I would like to hesitate in recommending Two Seas LLP's new remote roles.",
        name: "Lloyd Morren",
        company: "Nedlands Group",
        logo: "/logos/nedlands-logo.png" // Update path to your actual logo
    },
    {
        quote: "Two Seas LLP has always demonstrated an interest in our business, and they are constantly looking at innovative ways to help us grow, retain, motivate, and retain our teams.",
        name: "Tim Close",
        company: "Comms Channel",
        logo: "/logos/comms-channel-logo.png"
    }
];

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevTestimonial = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="testimonials-container">
            <h2 className="testimonials-title">Success stories</h2>

            <div className="testimonial-carousel">
                <button className="nav-arrow prev" onClick={prevTestimonial}>
                    <IoIosArrowBack />
                </button>

                <div className="testimonial-slide">
                    <div className="testimonial-content">
                        <FaQuoteLeft className="quote-icon" />
                        <p className="testimonial-text">{testimonials[currentIndex].quote}</p>
                        <div className="testimonial-author">
                            <span className="author-name">{testimonials[currentIndex].name}</span>
                            <span className="author-company">{testimonials[currentIndex].company}</span>
                        </div>
                        <img
                            src={testimonials[currentIndex].logo}
                            alt={testimonials[currentIndex].company}
                            className="company-logo"
                        />
                    </div>
                </div>

                <button className="nav-arrow next" onClick={nextTestimonial}>
                    <IoIosArrowForward />
                </button>
            </div>

            <div className="carousel-dots">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Testimonials;