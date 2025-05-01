import React, { useState } from 'react';
import './Careers.css';

const Careers = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [activeCard, setActiveCard] = useState(null);
    const [activeJob, setActiveJob] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files?.[0] || null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    const jobOpenings = [
        {
            title: "Sales Development Representative",
            description: "Generate new business opportunities and qualify leads for our sales team.",
            mode: "Remote",
            location: "Pakistan",
            type: "Full-time"
        },
        {
            title: "Account Executive",
            description: "Manage client relationships and drive sales growth in your assigned territory.",
            mode: "Onsite",
            location: "Pakistan",
            type: "Full-time"
        },
        {
            title: "Virtual Assistant",
            description: "Provide administrative support to our teams across different time zones.",
            mode: "Remote",
            location: "Global",
            type: "Part-time"
        },
        {
            title: "Accounting Associate",
            description: "Handle day-to-day accounting operations and financial reporting.",
            mode: "Remote",
            location: "Pakistan",
            type: "Full-time"
        },
        {
            title: "Account Executive",
            description: "Manage client relationships and drive sales growth in your assigned territory.",
            mode: "Remote",
            location: "Pakistan",
            type: "Full-time"
        },
        {
            title: "React Developer",
            description: "Build and maintain our web applications using modern React practices.",
            mode: "Onsite",
            location: "Pakistan",
            type: "Full-time"
        }
    ];

    const benefits = [
        {
            title: "Global Opportunity",
            description: "Work with international teams in multiple time zones",
            icon: "🌐"
        },
        {
            title: "People Orientation",
            description: "Join a culture of well-being, professional development, and respect!",
            icon: "👥"
        },
        {
            title: "Remote Flexibility",
            description: "Work from the convenience of your home",
            icon: "🏠"
        },
        {
            title: "Annual Perks",
            description: "Regular increments and performance bonuses",
            icon: "💰"
        },
        {
            title: "Medical Insurance",
            description: "Comprehensive health coverage for you and your family",
            icon: "🏥"
        },
        {
            title: "Company Tours",
            description: "Opportunities to visit our global offices",
            icon: "✈️"
        }
    ];

    return (
        <div className="careers-container">
            {/* Enhanced Header Section */}
            <header className="careers-header">
                <div className="header-content">
                    <div className="title-container">
                        <h1 className="header-title">
                            <span className="title-gradient">COME WORK WITH US</span>
                        </h1>
                        <div className="title-decoration">
                            <div className="decoration-line"></div>
                            <div className="decoration-dot"></div>
                            <div className="decoration-line"></div>
                        </div>
                    </div>

                    <p className="header-subtext">
                        We're looking for curious minds, creative thinkers, and passionate problem-solvers.
                        Tell us why you're a perfect fit!
                    </p>
                </div>
            </header>

            {/* Job Openings Section */}
            <section className="openings-section">
                <h2 className="section-title">OUR OPENINGS</h2>
                <p className="section-subtitle">Explore current opportunities to join our growing team</p>

                <div className="openings-grid">
                    {jobOpenings.map((job, index) => (
                        <div
                            className={`job-card ${activeJob === index ? 'active' : ''}`}
                            key={index}
                            onMouseEnter={() => setActiveJob(index)}
                            onMouseLeave={() => setActiveJob(null)}
                        >
                            <div className="job-header">
                                <h3 className="job-title">{job.title}</h3>
                                <div className="job-meta">
                                    <span className={`job-mode ${job.mode.toLowerCase()}`}>{job.mode}</span>
                                    <span className="job-location">{job.location}</span>
                                </div>
                            </div>

                            <div className="job-description">
                                <p>{job.description}</p>
                                <div className="job-buttons">
                                    <button className="apply-btn apply-here">
                                        Apply Here
                                    </button>
                                    <button className="apply-btn apply-linkedin">
                                        Apply via LinkedIn
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits Cards Section */}
            <section className="benefits-section">
                <h2 className="section-title">Why Join Our Team?</h2>
                <p className="section-subtitle">We offer more than just a job - we offer growth, community, and meaningful work.</p>

                <div className="benefits-grid">
                    {benefits.map((benefit, index) => (
                        <div
                            className={`benefit-card ${activeCard === index ? 'active' : ''}`}
                            key={index}
                            onMouseEnter={() => setActiveCard(index)}
                            onMouseLeave={() => setActiveCard(null)}
                        >
                            <div className="card-icon">{benefit.icon}</div>
                            <h3 className="card-title">{benefit.title}</h3>
                            <p className="card-description">{benefit.description}</p>
                            <div className="card-highlight"></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Main Form Section */}
            <main className="careers-main">
                <h2 className="form-heading">
                    Ready to join the team? Fill out the application and upload your resume below.
                </h2>
                <form onSubmit={handleSubmit} className="application-form">
                    <div className="form-grid">
                        <div className="input-field">
                            <input type="text" placeholder="Name" className="form-input" />
                        </div>
                        <div className="input-field">
                            <input type="email" placeholder="Email" className="form-input" />
                        </div>
                        <div className="input-field">
                            <input type="tel" placeholder="Phone" className="form-input" />
                        </div>
                        <div className="input-field">
                            <input type="text" placeholder="Initiation Date (e.g. 10A)" className="form-input" />
                        </div>
                    </div>

                    {/* Enhanced File Upload */}
                    <div className="file-upload-container">
                        <label className="file-upload-label">
                            <div className={`file-upload-box ${selectedFile ? 'has-file' : ''}`}>
                                {selectedFile ? (
                                    <>
                                        <span className="file-icon">📄</span>
                                        <span className="file-name">{selectedFile.name}</span>
                                        <button
                                            type="button"
                                            className="file-clear"
                                            onClick={() => setSelectedFile(null)}
                                        >
                                            ×
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span className="file-icon">⬆️</span>
                                        <span>Upload Resume (PDF only)</span>
                                    </>
                                )}
                            </div>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="file-input"
                            />
                        </label>
                    </div>

                    <div className="input-field">
                        <textarea placeholder="Tell us about your experience and why you'd be a great fit (Optional)"
                            className="form-input textarea-input" rows="4"></textarea>
                    </div>

                    <button type="submit" className="submit-btn">
                        Submit Application <span className="btn-arrow">→</span>
                    </button>
                </form>

                {isSubmitted && (
                    <div className="submission-message">
                        <div className="message-icon">✓</div>
                        <p>Sit back and relax - your application has been successfully submitted.
                            We'll contact the right candidates. No follow-up needed.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Careers;