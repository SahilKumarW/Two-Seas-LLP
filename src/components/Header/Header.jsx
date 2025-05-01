import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="container">
                <div className="logo">
                    <img src="https://www.Two Seas LLP.com.au/wp-content/uploads/2022/08/logo.png" alt="Two Seas LLP" />
                </div>
                <nav className="nav">
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/services">Services</a></li>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </nav>
                <div className="mobile-menu">
                    <FontAwesomeIcon icon={faBars} />
                </div>
            </div>
        </header>
    );
};

export default Header;