import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from "../../assets/Two Seas Logo.png";

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    const services = [
        { 
            id: 'insurance',
            title: "Insurance", 
            icon: "🤝",
            desc: "Expert insurance professionals for all your coverage needs.",
            details: {
                description: "We provide specialized insurance professionals including underwriters, claims adjusters, risk managers, and actuaries. All candidates have minimum 2 years experience in the insurance sector.",
                hiringProcess: "Our rigorous 4-step process ensures we find insurance experts with the right technical knowledge and customer service skills."
            }
        },
        { 
            id: 'sales-marketing',
            title: "Sales & Marketing", 
            icon: "📈",
            desc: "Revenue-driving professionals for your growth needs.",
            details: {
                description: "Our sales and marketing team includes digital marketers, sales executives, business developers, and CRM specialists. We focus on both B2B and B2C expertise.",
                hiringProcess: "Candidates undergo practical sales simulations and marketing strategy assessments."
            }
        },
        { 
            id: 'accounting-finance',
            title: "Accounting & Finance", 
            icon: "💰",
            desc: "Financial experts to manage your fiscal operations.",
            details: {
                description: "We provide qualified accountants, financial analysts, auditors, and bookkeepers. All professionals are proficient in major accounting software.",
                hiringProcess: "Financial professionals complete technical accounting tests and scenario-based evaluations."
            }
        },
        { 
            id: 'virtual-professionals',
            title: "Virtual Professionals", 
            displayTitle: "Virtual",
            icon: "👥",
            desc: "Skilled remote support for your business needs.",
            details: {
                description: "Our virtual assistants, data entry specialists, and remote administrators are trained in productivity tools and communication platforms.",
                hiringProcess: "Virtual professionals are tested on time management, communication skills, and technical proficiency."
            }
        },
        { 
            id: 'it-telecom',
            title: "IT & Telecom", 
            icon: "💻",
            desc: "Technical experts for your digital infrastructure.",
            details: {
                description: "We provide software developers, network engineers, cybersecurity specialists, and telecom technicians across all major platforms and languages.",
                hiringProcess: "IT candidates complete coding challenges and infrastructure troubleshooting scenarios."
            }
        }
    ];

    const handleLogoClick = () => {
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
    };

    const handleServiceClick = (service) => {
        navigate(`/services/${service.id}`, { state: { service } });
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="logo-wrapper" onClick={handleLogoClick}>
                    <img src={logo} alt="Two Seas Logo" className="nav-logo" />
                </div>

                <button
                    className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>

                <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    <Link to="/" className={`nav-link ${isActive('/') ? 'white-text' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                        Home
                    </Link>
                    
                    <div
                        className="nav-link dropdown-trigger"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <span className={`${location.pathname.startsWith('/services') ? 'white-text' : ''}`}>
                            Our Professionals
                        </span>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                {services.map(service => (
                                    <div
                                        key={service.id}
                                        className={`dropdown-item ${isActive(`/services/${service.id}`) ? 'white-text' : ''}`}
                                        onClick={() => handleServiceClick(service)}
                                    >
                                        {/* <span className="dropdown-icon">{service.icon}</span> */}
                                        {service.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <Link to="/how-we-work" className={`nav-link ${isActive('/how-we-work') ? 'white-text' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                        How We Work
                    </Link>
                    
                    <Link to="/contact-us" className={`nav-link ${isActive('/contact-us') ? 'white-text' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                        Contact Us
                    </Link>
                    
                    <Link to="/careers" className={`nav-link careers-link ${isActive('/careers') ? 'white-text' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                        Careers
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;