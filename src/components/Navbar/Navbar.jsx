import React, { useState } from 'react';
import './Navbar.css';
import logo from "../../assets/Two Seas Logo.png";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const currentPath = window.location.pathname;
    const navigate = useNavigate();

    const isActive = (path) => currentPath === path;

    const handleLogoClick = () => {
        navigate('/');
        setIsMobileMenuOpen(false);  // Close mobile menu on navigation
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="logo-wrapper" onClick={handleLogoClick}>
                    <div className="logo-background">
                        <img src={logo} alt="Two Seas Logo" className="nav-logo" />
                    </div>
                </div>

                {/* Hamburger Icon for mobile */}
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
                    <a href="/" className={`nav-link ${isActive('/') ? 'white-text' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Home</a>
                    <div
                        className="nav-link dropdown-trigger"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}  // enable click toggle on mobile
                    >
                        <span className={`${currentPath.startsWith('/services') ? 'white-text' : ''}`}>
                            Our Services
                        </span>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                {/* Updated Services */}
                                <a href="/services/website-development" className={`dropdown-item ${isActive('/services/website-development') ? 'white-text' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Website Development</a>
                                <a href="/services/application-development" className={`dropdown-item ${isActive('/services/application-development') ? 'white-text' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Application Development</a>
                                <a href="/services/seo" className={`dropdown-item ${isActive('/services/seo') ? 'white-text' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Search Engine Optimization</a>
                                                                
                                {/* Existing Services (if you want to keep them)
                                <a href="/virtual-assistant" className={`dropdown-item ${isActive('/virtual-assistant') ? 'white-text' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Virtual Assistant</a>
                                <a href="/sales" className={`dropdown-item ${isActive('/sales') ? 'white-text' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Sales</a>
                                <a href="/marketing" className={`dropdown-item ${isActive('/marketing') ? 'white-text' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Marketing</a>
                                <a href="/admin" className={`dropdown-item ${isActive('/admin') ? 'white-text' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Admin</a>
                                <a href="/medical" className={`dropdown-item ${isActive('/medical') ? 'white-text' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Medical</a>
                                <a href="/dental" className={`dropdown-item ${isActive('/dental') ? 'white-text' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Dental</a>
                                <a href="/insurance" className={`dropdown-item ${isActive('/insurance') ? 'white-text' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Insurance</a>
                                <a href="/it" className={`dropdown-item ${isActive('/it') ? 'white-text' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>IT</a> */}
                            </div>
                        )}
                    </div>
                    <a href="/how-we-work" className={`nav-link ${isActive('/how-we-work') ? 'white-text' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>How We Work</a>
                    <a href="/contact-us" className={`nav-link ${isActive('/contact-us') ? 'white-text' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Contact Us</a>
                    <a href="/careers" className={`nav-link careers-link ${isActive('/careers') ? 'white-text' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Careers</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;