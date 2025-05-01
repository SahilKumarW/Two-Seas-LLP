import React, { useState } from 'react';
import './Navbar.css';
import logo from "../../assets/Two Seas Logo.png";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const currentPath = window.location.pathname;
    const navigate = useNavigate();

    const isActive = (path) => currentPath === path;

    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="logo-wrapper" onClick={handleLogoClick}>
                    <div className="logo-background">
                        <img src={logo} alt="Two Seas Logo" className="nav-logo" />
                    </div>
                </div>
                <div className="nav-links">
                    <a href="/" className={`nav-link ${isActive('/') ? 'white-text' : ''}`}>Home</a>
                    <div
                        className="nav-link dropdown-trigger"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <span className={`${currentPath.startsWith('/virtual-assistant') || currentPath.startsWith('/sales') || currentPath.startsWith('/marketing') || currentPath.startsWith('/admin') || currentPath.startsWith('/medical') || currentPath.startsWith('/dental') || currentPath.startsWith('/insurance') || currentPath.startsWith('/it') ? 'white-text' : ''}`}>
                            Our Services
                        </span>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <a href="/virtual-assistant" className={`dropdown-item ${isActive('/virtual-assistant') ? 'white-text' : ''}`}>Virtual Assistant</a>
                                <a href="/sales" className={`dropdown-item ${isActive('/sales') ? 'white-text' : ''}`}>Sales</a>
                                <a href="/marketing" className={`dropdown-item ${isActive('/marketing') ? 'white-text' : ''}`}>Marketing</a>
                                <a href="/admin" className={`dropdown-item ${isActive('/admin') ? 'white-text' : ''}`}>Admin</a>
                                <a href="/medical" className={`dropdown-item ${isActive('/medical') ? 'white-text' : ''}`}>Medical</a>
                                <a href="/dental" className={`dropdown-item ${isActive('/dental') ? 'white-text' : ''}`}>Dental</a>
                                <a href="/insurance" className={`dropdown-item ${isActive('/insurance') ? 'white-text' : ''}`}>Insurance</a>
                                <a href="/it" className={`dropdown-item ${isActive('/it') ? 'white-text' : ''}`}>IT</a>
                            </div>
                        )}
                    </div>
                    <a href="/how-we-work" className={`nav-link ${isActive('/how-we-work') ? 'white-text' : ''}`}>How We Work</a>
                    <a href="/contact-us" className={`nav-link ${isActive('/contact-us') ? 'white-text' : ''}`}>Contact Us</a>
                    <a href="/careers" className={`nav-link careers-link ${isActive('/careers') ? 'white-text' : ''}`}>Careers</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;