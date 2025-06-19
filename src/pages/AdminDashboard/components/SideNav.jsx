import React, { useState } from 'react';
import './SideNav.css';
import { navItems } from '../constants';

const SideNav = ({ wishlist = [], setShowWishlist }) => {
    const [activeItem, setActiveItem] = useState(0);
    const [hoveredItem, setHoveredItem] = useState(null);

    return (
        <div className="side-nav">
            {/* Wishlist button added before the header */}
            <button
                className="wishlist-btn"
                onClick={() => setShowWishlist(true)}
            >
                Wishlist ({wishlist.length || 0})
            </button>

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