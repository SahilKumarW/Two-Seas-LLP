import React, { useState, useEffect } from 'react';
import './Careers.css';
import { jobOpenings } from '../../jobsData';
import { FaLinkedin, FaBriefcase } from 'react-icons/fa';

const Careers = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [activeCard, setActiveCard] = useState(null);
    const [activeJob, setActiveJob] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showJobDetails, setShowJobDetails] = useState(false);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files?.[0] || null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
    };

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

    const handleJobClick = (job) => {
        setSelectedJob(job);
        setShowJobDetails(true);
        // Add a new entry to the history stack
        window.history.pushState({ showDetails: true }, '', window.location.pathname);
    };

    const handleBackToJobs = () => {
        setShowJobDetails(false);
        // Replace current history entry to prevent double-back
        window.history.replaceState({ showDetails: false }, '', window.location.pathname);
    };

    useEffect(() => {
        // Handle browser back/forward buttons
        const handlePopState = (event) => {
            setShowJobDetails(false);
        };

        window.addEventListener('popstate', handlePopState);
        
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    return (
        <div className="careers-root">
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
                <div className="section-container">
                    <h2 className="section-title">OUR OPENINGS</h2>
                    <p className="section-subtitle">Explore current opportunities to join our growing team</p>

                    {!showJobDetails ? (
                        <div className="openings-grid">
                            {jobOpenings.map((job) => (
                                <div
                                    className={`job-card ${activeJob === job.id ? 'active' : ''}`}
                                    key={job.id}
                                    onMouseEnter={() => setActiveJob(job.id)}
                                    onMouseLeave={() => setActiveJob(null)}
                                    onClick={() => handleJobClick(job)}
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
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="job-details-container">
                            <div className="job-details-header">
                                <h2 className="job-details-title">{selectedJob.title}</h2>
                                <div className="job-details-meta">
                                    <span className={`job-mode ${selectedJob.mode.toLowerCase()} text-white`}>
                                        {selectedJob.mode}
                                    </span>
                                    <span className="job-location text-white">
                                        {selectedJob.location}
                                    </span>
                                    <span className="job-type">
                                        {selectedJob.type}
                                    </span>
                                </div>
                            </div>

                            <div className="job-details-content">
                                <div className="job-details-section">
                                    <h3>Position Overview</h3>
                                    <p>{selectedJob.details.overview}</p>
                                </div>

                                <div className="job-details-section">
                                    <h3>Key Responsibilities</h3>
                                    <ul>
                                        {selectedJob.details.responsibilities.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="job-details-section">
                                    <h3>Qualifications</h3>
                                    <ul>
                                        {selectedJob.details.qualifications.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                {selectedJob.details.preferredQualifications && (
                                    <div className="job-details-section">
                                        <h3>Preferred Qualifications</h3>
                                        <ul>
                                            {selectedJob.details.preferredQualifications.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="job-details-section">
                                    <h3>What We Offer</h3>
                                    <ul>
                                        {selectedJob.details.benefits.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="apply-actions">
                                    <div className="apply-options">
                                        <button className="apply-btn apply-direct">
                                            Apply for this Position
                                        </button>
                                        <a
                                            href={`https://www.indeed.com/jobs?q=${encodeURIComponent(selectedJob.title)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="apply-btn apply-indeed"
                                        >
                                            <FaBriefcase /> Apply via Indeed
                                        </a>
                                        <a
                                            href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(selectedJob.title)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="apply-btn apply-linkedin"
                                        >
                                            <FaLinkedin /> Apply via LinkedIn
                                        </a>
                                    </div>

                                    <div className="back-button-container">
                                        <button
                                            className="back-button"
                                            onClick={() => setShowJobDetails(false)}
                                        >
                                            ← Back to Jobs
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Careers;