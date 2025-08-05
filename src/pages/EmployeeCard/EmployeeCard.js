import React, { useState } from 'react';
import { FaFileAlt, FaClipboardCheck, FaHeart, FaCalendarAlt, FaRegHeart, FaStar } from 'react-icons/fa';
import './EmployeeCard.css';
import { useEmployees } from '../../hooks/useEmployees';

const EmployeeCard = () => {
  const [wishlist, setWishlist] = useState({});
  const [expandedCards, setExpandedCards] = useState({});
  const { employees, loading, error } = useEmployees();

  const toggleCardExpand = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleWishlist = (id) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleViewDocument = (url) => {
    if (!url || url === '') {
      alert('Document not available');
      return;
    }
    window.open(url, '_blank');
  };

  const bookInterview = (email) => {
    if (!email || email === '') {
      alert('Email not available');
      return;
    }
    window.open(`mailto:${email}?subject=Interview Request&body=I would like to schedule an interview`, '_blank');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading professionals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error loading professionals: {error}</p>
      </div>
    );
  }

  // Filter out hidden employees
  const visibleEmployees = employees.filter(emp => emp.status !== 'hidden');

  // Helper function to calculate rating
  const calculateRating = (rate) => {
    if (!rate) return '4.5';
    const wholeNumber = Math.min(5, Math.max(4, Math.floor(rate / 20)));
    const decimal = rate % 20;
    return `${wholeNumber}.${decimal}`;
  };

  return (
    <div className="employee-portal">
      <header className="portal-header">
        <div className="header-content">
          <h1 className="portal-title">Talent Nexus</h1>
          <p className="portal-subtitle">Discover Exceptional Tech Professionals</p>
        </div>
      </header>

      <div className="employee-grid">
        {visibleEmployees.map((employee, index) => (
          <div
            key={employee.id}
            className={`employee-card ${expandedCards[employee.id] ? 'expanded' : ''}`}
            onClick={() => toggleCardExpand(employee.id)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="card-content">
              <div className="card-background">
                <div className="employee-profile">
                  <div className="avatar-container">
                    <div className="avatar-wrapper">
                      <img
                        src={employee.image || 'https://via.placeholder.com/150'}
                        alt={employee.name}
                        className="employee-avatar"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                      <div className="experience-badge">{employee.experience}</div>
                    </div>
                    <button
                      className={`wishlist-button ${wishlist[employee.id] ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(employee.id);
                      }}
                    >
                      {wishlist[employee.id] ? <FaHeart /> : <FaRegHeart />}
                    </button>
                  </div>
                  <div className="profile-info">
                    <h3 className="employee-name">{employee.name}</h3>
                    <p className="employee-position">{employee.position}</p>
                    <div className="rating">
                      <FaStar className="star" />
                      <span>{calculateRating(employee.rate)}</span>
                    </div>
                  </div>
                </div>

                <div className="employee-intro">
                  <p style={{ color: '#2A2D7C' }}>{employee.intro}</p>
                </div>

                <div className={`expandable-content ${expandedCards[employee.id] ? 'visible' : ''}`}>
                  <div className="expertise-section">
                    <h4 className="section-label">Core Expertise</h4>
                    <div className="expertise-tags">
                      {employee.skills?.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      )) || <span className="skill-tag">No skills listed</span>}
                    </div>
                  </div>

                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Rate</span>
                      <span className="detail-value">
                        {employee.currency || 'USD'} {employee.rate || 'N/A'}/hr
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Experience</span>
                      <span className="detail-value">{employee.experience || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="document-buttons">
                    <button
                      className="doc-button resume"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDocument(employee.resumeUrl);
                      }}
                    >
                      <FaFileAlt /> Resume
                    </button>
                    <button
                      className="doc-button assessment"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDocument(employee.assessmentUrl);
                      }}
                    >
                      <FaClipboardCheck /> Assessment
                    </button>
                  </div>
                </div>
              </div>

              <button
                className="primary-button book-interview"
                onClick={(e) => {
                  e.stopPropagation();
                  bookInterview(employee.email);
                }}
              >
                <FaCalendarAlt /> Schedule Interview
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { useEmployees };
export default EmployeeCard;