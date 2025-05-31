import React, { useState } from 'react';
import './SideNav.css';

const SideNav = () => {
    const [activeItem, setActiveItem] = useState(0);
    const [hoveredItem, setHoveredItem] = useState(null);

    const navItems = [
        "Sales & Marketing",
        "Untitled Professionals",
        "IT and Telecom",
        "Contact Centre",
        "Accounting & Finance",
        "Insurance",
        "Medical",
        "Dental"
    ];

    return (
        <div className="side-nav">
            <div className="nav-header">
                <div className="header-content">
                    <h3>
                        <span className="title-text">Categories</span>
                    </h3>
                </div>
            </div>
            <ul className="nav-items">
                {navItems.map((item, index) => (
                    <li
                        key={index}
                        className={`nav-item ${index === activeItem ? 'active' : ''}`}
                        onClick={() => setActiveItem(index)}
                        onMouseEnter={() => setHoveredItem(index)}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        <div className="item-content">
                            <span className="nav-icon">
                                {index === 0 ? (
                                    <span className="icon-pulse"></span>
                                ) : (
                                    <span className="icon-float"></span>
                                )}
                            </span>
                            <span className="nav-text">{item}</span>
                            {hoveredItem === index && (
                                <span className="hover-highlight"></span>
                            )}
                        </div>
                        {index === activeItem && (
                            <div className="active-glow"></div>
                        )}
                    </li>
                ))}
            </ul>
            
        </div>
    );
};

export default SideNav;